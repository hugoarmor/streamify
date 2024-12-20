defmodule StreamifyServerWeb.FilesController do
  use StreamifyServerWeb, :controller

  def index(conn, params) do
    folder_relative_path = params["folder_relative_path"]
    Auth.Service.enable_folder_access!(conn, folder_relative_path || ".")

    folder_path = FilesService.join_managed_folder(folder_relative_path || "")

    result =
      folder_path
      |> FilesService.get_folder_files!()

    json(conn, result)
  rescue
    error ->
      conn |> send_resp(400, "Error getting folder: #{inspect(error)}")
  end

  def download(conn, %{"file_path" => file_path}) do
    file_path
    |> FilesService.join_managed_folder()
    |> FilesService.get_file_stream()
    |> case do
      {:ok, stream, stats} ->
        conn =
          conn
          |> put_resp_header("content-disposition", "attachment; filename=\"#{stats.file_name}\"")
          |> put_resp_header("content-length", Integer.to_string(stats.size))
          |> send_chunked(200)

        Enum.each(stream, fn chunk ->
          conn |> chunk(chunk)
        end)

        conn

      {:error, message} ->
        conn |> send_resp(400, message)
    end
  end

  def destroy(conn, %{"file_path" => file_path}) do
    Auth.Service.enable_folder_access!(conn, file_path |> Path.dirname())

    file_path
    |> FilesService.join_managed_folder()
    |> FilesService.delete_file()
    |> case do
      {:ok, _} ->
        conn |> send_resp(200, "File #{file_path} deleted successfully")

      {:error, reason} ->
        conn |> send_resp(400, "File #{file_path} could not be deleted: #{reason}")
    end
  end

  def destroy_many(conn, %{"file_paths" => file_paths}) do
    file_paths
    |> Enum.each(fn file_path ->
      folder_relative_path = file_path |> Path.dirname()
      Auth.Service.enable_folder_access!(conn, folder_relative_path)

      file_path = FilesService.join_managed_folder(file_path)

      FilesService.delete_file(file_path)
    end)

    conn |> send_resp(200, "Files deleted successfully")
  end

  def rename(conn, %{"old_path" => old_path, "new_file_path" => new_file_path}) do
    Auth.Service.enable_folder_access!(conn, old_path |> Path.dirname())
    Auth.Service.enable_folder_access!(conn, new_file_path |> Path.dirname())

    old_path = FilesService.join_managed_folder(old_path)
    new_file_path = FilesService.join_managed_folder(new_file_path)

    case FilesService.rename_file(old_path, new_file_path) do
      :ok ->
        conn |> send_resp(200, "File #{old_path} renamed to #{new_file_path} successfully")

      {:error, reason} ->
        conn
        |> send_resp(400, "File #{old_path} could not be renamed to #{new_file_path}: #{reason}")
    end
  end

  def upload(conn, %{"file_name" => file_name, "file" => file}) do
    Auth.Service.enable_folder_access!(conn, file_name |> Path.dirname())

    file_path = FilesService.join_managed_folder(file_name)

    case FilesService.copy_file(file.path, file_path) do
      :ok ->
        conn |> send_resp(200, "Chunk uploaded successfully")

      {:error, reason} ->
        conn |> send_resp(400, "Chunk could not be uploaded: #{reason}")
    end
  end

  def zip(conn, %{"file_paths" => file_paths}) do
    zip_id = UUID.uuid4()
    zip_file_path = ~c"#{FilesService.join_managed_folder(zip_id)}.zip"

    case FilesService.zip_files(zip_file_path, file_paths) do
      {:ok, _zip_file_path} ->
        conn |> send_resp(200, zip_id)

      {:error, reason} ->
        conn |> send_resp(400, "Files could not be zipped: #{reason}")
    end
  end

  def download_zip(conn, %{"zip_id" => zip_id}) do
    zip_file_path = ~c"#{FilesService.join_managed_folder(zip_id)}.zip"

    case FilesService.get_file_stream(zip_file_path) do
      {:ok, stream, stats} ->
        conn =
          conn
          |> put_resp_header("content-disposition", "attachment; filename=\"#{stats.file_name}\"")
          |> put_resp_header("content-length", Integer.to_string(stats.size))
          |> send_chunked(200)

        Enum.each(stream, fn chunk ->
          conn |> chunk(chunk)
        end)

        FilesService.delete_file(zip_file_path)

        conn

      {:error, message} ->
        FilesService.delete_file(zip_file_path)
        conn |> send_resp(400, message)
    end
  end

  def create_folder(conn, %{"folder_path" => folder_path}) do
    Auth.Service.enable_folder_access!(conn, folder_path)

    case FilesService.create_folder(folder_path) do
      :ok ->
        conn |> send_resp(200, "Folder #{folder_path} created successfully")

      {:error, reason} ->
        conn |> send_resp(400, "Folder #{folder_path} could not be created: #{reason}")
    end
  end
end

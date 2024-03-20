defmodule StreamifyServerWeb.FilesController do
  use StreamifyServerWeb, :controller

  def index(conn, _params) do
    result =
      FilesService.get_managed_folder()
      |> FilesService.get_folder_files!()

    json(conn, result)
  end

  def show(conn, %{"file_path" => file_path}) do
    file_path = "#{FilesService.get_managed_folder()}/#{file_path}"

    result = FilesService.get_file_stream(file_path)

    case result do
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
    file_path = "#{FilesService.get_managed_folder()}/#{file_path}"

    case FilesService.delete_file(file_path) do
      :ok ->
        conn |> send_resp(200, "File #{file_path} deleted successfully")

      {:error, reason} ->
        conn |> send_resp(400, "File #{file_path} could not be deleted: #{reason}")
    end
  end

  def destroy_many(conn, %{"file_paths" => file_paths}) do
    file_paths
    |> Enum.each(fn file_path ->
      file_path = "#{FilesService.get_managed_folder()}/#{file_path}"

      FilesService.delete_file(file_path)
    end)

    conn |> send_resp(200, "Files deleted successfully")
  end

  def rename(conn, %{"old_path" => old_path, "new_file_path" => new_file_path}) do
    old_path = "#{FilesService.get_managed_folder()}/#{old_path}"
    new_file_path = "#{FilesService.get_managed_folder()}/#{new_file_path}"

    case FilesService.rename_file(old_path, new_file_path) do
      :ok ->
        conn |> send_resp(200, "File #{old_path} renamed to #{new_file_path} successfully")

      {:error, reason} ->
        conn |> send_resp(400, "File #{old_path} could not be renamed to #{new_file_path}: #{reason}")
    end
  end

  def upload(conn, %{"file_name" => file_name, "file" => file}) do
    file_path = "#{FilesService.get_managed_folder()}/#{file_name}"

    case FilesService.copy_file(file.path, file_path) do
      :ok ->
        conn |> send_resp(200, "Chunk uploaded successfully")

      {:error, reason} ->
        conn |> send_resp(400, "Chunk could not be uploaded: #{reason}")
    end
  end

  def zip(conn, %{"file_paths" => file_paths}) do
    managed_folder = FilesService.get_managed_folder()
    zip_id = UUID.uuid4()
    zip_file_path = ~c"#{managed_folder}/#{zip_id}.zip"

    case FilesService.zip_files(zip_file_path, file_paths) do
      {:ok, _zip_file_path} ->
        conn |> send_resp(200, zip_id)

      {:error, reason} ->
        conn |> send_resp(400, "Files could not be zipped: #{reason}")
    end
  end

  def download_zip(conn, %{"zip_id" => zip_id}) do
    managed_folder = FilesService.get_managed_folder()
    zip_file_path = ~c"#{managed_folder}/#{zip_id}.zip"

    result = FilesService.get_file_stream(zip_file_path)

    case result do
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
end

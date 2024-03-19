defmodule FilesController do
  require Logger
  use Plug.Router

  plug(:match)
  plug(:dispatch)

  get "/:file_path" do
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

  get "/" do
    result =
      FilesService.get_managed_folder()
      |> FilesService.get_folder_files!()
      |> Jason.encode!(pretty: true)

    conn |> send_resp(200, result)
  end

  delete "/:file_path" do
    file_path = "#{FilesService.get_managed_folder()}/#{file_path}"

    case FilesService.delete_file(file_path) do
      :ok ->
        conn |> send_resp(200, "File #{file_path} deleted successfully")

      {:error, reason} ->
        conn |> send_resp(400, "File #{file_path} could not be deleted: #{reason}")
    end
  end

  delete "/" do
    file_paths = conn.body_params["file_paths"]

    Enum.each(file_paths, fn file_path ->
      file_path = "#{FilesService.get_managed_folder()}/#{file_path}"

      FilesService.delete_file(file_path)
    end)

    conn |> send_resp(200, "Files deleted successfully")
  end

  patch "/:file_path/rename" do
    new_file_path = conn.body_params["new_file_path"]

    file_path = "#{FilesService.get_managed_folder()}/#{file_path}"
    new_file_path = "#{FilesService.get_managed_folder()}/#{new_file_path}"

    case FilesService.rename_file(file_path, new_file_path) do
      :ok ->
        conn |> send_resp(200, "File #{file_path} renamed to #{new_file_path} successfully")

      {:error, reason} ->
        conn
        |> send_resp(400, "File #{file_path} could not be renamed to #{new_file_path}: #{reason}")
    end
  end

  post "/upload" do
    file_path = "#{FilesService.get_managed_folder()}/#{conn.body_params["file_name"]}"
    file = conn.body_params["file"]

    case FilesService.copy_file(file.path, file_path) do
      :ok ->
        conn |> send_resp(200, "Chunk uploaded successfully")

      {:error, reason} ->
        conn |> send_resp(400, "Chunk could not be uploaded: #{reason}")
    end
  end

  post "/zip" do
    file_paths = conn.body_params["file_paths"]

    managed_folder = FilesService.get_managed_folder()
    zip_id = UUID.uuid4()
    zip_file_path = ~c"#{managed_folder}/#{zip_id}.zip"

    case FilesService.zip_files(zip_file_path, file_paths) do
      {:ok, _file_path} ->
        conn |> send_resp(200, zip_id)

      {:error, reason} ->
        conn |> send_resp(400, "Files could not be zipped: #{reason}")
    end
  end

  get "zip/:zip_id" do
    file_path = "#{FilesService.get_managed_folder()}/#{zip_id}.zip"

    IO.puts("File path: #{file_path}")

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

        FilesService.delete_file(file_path)

        conn

      {:error, message} ->
        FilesService.delete_file(file_path)
        conn |> send_resp(400, message)
    end
  end
end

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

    case FilesService.detele_file(file_path) do
      :ok ->
        conn |> send_resp(200, "File #{file_path} deleted successfully")

      {:error, reason} ->
        conn |> send_resp(400, "File #{file_path} could not be deleted: #{reason}")
    end
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
    is_append? = conn.body_params["append"] === "true"

    stream = file.path |> File.stream!([], 2048)

    case FilesService.upload_file_stream(file_path, stream, is_append?) do
      :ok ->
        conn |> send_resp(200, "Chunk uploaded successfully")

      {:error, reason} ->
        conn |> send_resp(400, "Chunk could not be uploaded: #{reason}")
    end
  end


end

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

        external_ip = conn.remote_ip |> Tuple.to_list() |> Enum.join(".")

        IO.puts("[INFO] File #{file_path} streamed successfully to #{external_ip}")

        conn
      {:error, message} ->
        conn |> send_resp(400, message)
    end
  end

  get "/" do
    result = FilesService.get_managed_folder() |> FilesService.get_folder_files!() |> Jason.encode!(pretty: true)

    conn |> send_resp(200, result)
  end
end

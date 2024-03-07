defmodule Router do
  use Plug.Router

  plug(:match)
  plug(:dispatch)

  get "/" do
    conn
    |> put_resp_header("content-type", "text/html")
    |> send_file(200, "static/index.html")
  end

  forward("/files", to: FilesController)
end

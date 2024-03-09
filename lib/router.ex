defmodule Router do
  use Plug.Router

  plug(:match)
  plug(:dispatch)

  forward("/api/files", to: FilesController)

  match _ do
    conn
    |> put_resp_header("content-type", "text/html")
    |> send_file(200, "static/index.html")
  end
end

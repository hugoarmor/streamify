defmodule Router do
  use Plug.Router

  plug(Api.CORS)

  plug(:match)
  plug(Plug.Parsers,
    parsers: [:json],
    pass: ["application/json", "text/json"],
    json_decoder: Jason
  )
  plug(:dispatch)

  forward("/api/files", to: FilesController)

  match _ do
    path = conn.request_path

    case path do
      "/" -> conn |> send_file(200, "static/build/index.html")
      _ -> conn |> send_file(200, "static/build#{path}")
    end
  end
end

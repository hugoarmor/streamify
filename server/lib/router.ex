defmodule Router do
  use Plug.Router

  plug(Api.CORS)

  plug(:match)
  plug(Plug.Parsers,
    parsers: [:json, :urlencoded, {:multipart, length: 100_000_000_000_000}],
    pass: ["application/json", "text/json", "application/x-www-form-urlencoded", "multipart/form-data"],
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

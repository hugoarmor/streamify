defmodule Router do
  use Plug.Router

  plug(:match)
  plug(:dispatch)

  forward("/files", to: FilesController)
end

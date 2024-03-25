defmodule StreamifyServer.Repo do
  use Ecto.Repo,
    otp_app: :streamify_server,
    adapter: Ecto.Adapters.SQLite3
end

defmodule StreamifyServerWeb.Guardian do
  use Guardian, otp_app: :streamify_server

  def subject_for_token(id, _claims) do
    {:ok, id}
  end

  def resource_from_claims(%{"sub" => sub}) do
    type = sub |> String.split(":") |> List.first()
    id = sub |> String.split(":") |> List.last()

    case type do
      "jam" -> {:ok, StreamifyServer.Repo.get(Jam, id) |> map_jam()}
      "user" -> {:ok, StreamifyServer.Repo.get(StreamifyServer.User, id) |> map_user()}
    end
  end

  def map_user(user) do
    Map.put(user, :role, "user")
  end

  def map_jam(jam) do
    Map.put(jam, :role, "jam")
  end
end

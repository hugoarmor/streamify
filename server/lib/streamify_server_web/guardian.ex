defmodule StreamifyServerWeb.Guardian do
  use Guardian, otp_app: :streamify_server

  def subject_for_token(user, _claims) do
    {:ok, "user:#{user.id}"}
  end

  def resource_from_claims(%{"sub" => sub}) do
    id = String.split(sub, ":", parts: 2) |> List.last

    case id do
      "guest" -> {:ok, %{id: "guest"}}
      _ -> {:ok, StreamifyServer.Repo.get(StreamifyServer.User, id)}
    end
  end
end

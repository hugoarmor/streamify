defmodule StreamifyServerWeb.AuthController do
  use StreamifyServerWeb, :controller

  def authenticate(conn, %{"email" => email, "password" => password}) do
    case StreamifyServer.User.authenticate_user(email, password) do
      {:ok, user} ->
        case StreamifyServerWeb.Guardian.encode_and_sign(user, %{}, token_type: :access) do
          {:ok, jwt, _full_claims} ->
            conn
            |> put_status(:ok)
            |> put_resp_header("authorization", "Bearer #{jwt}")
            |> json(%{message: "Successfully authenticated"})

          {:error, reason} ->
            conn
            |> put_status(:unauthorized)
            |> json(%{message: reason})
        end

      {:error, reason} ->
        conn
        |> put_status(:unauthorized)
        |> json(%{message: reason})
    end
  end
end

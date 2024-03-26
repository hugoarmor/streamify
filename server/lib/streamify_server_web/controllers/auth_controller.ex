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
            |> json(%{
              token: "Bearer #{jwt}",
              message: "Successfully authenticated"
            })

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

  def authenticate_guest(conn, %{"password" => password, "jam_id" => jam_id}) do
    jam = StreamifyServer.Repo.get!(Jam, jam_id)

    Argon2.verify_pass(password, jam.password) || raise(RuntimeError, "Unauthorized")

    guest = %{id: "guest"}

    case StreamifyServerWeb.Guardian.encode_and_sign(guest, %{}, token_type: :access) do
      {:ok, jwt, _full_claims} ->
        conn
        |> put_status(:ok)
        |> put_resp_header("authorization", "Bearer #{jwt}")
        |> json(%{
          token: jwt,
          message: "Successfully authenticated"
        })

      {:error, reason} ->
        conn
        |> put_status(:unauthorized)
        |> json(%{message: reason})
    end
  rescue
    _ -> conn |> put_status(:unauthorized) |> json(%{message: "Unauthorized"})
  end

  def me(conn, _params) do
    current_resource = Guardian.Plug.current_resource(conn)

    user =
      case current_resource do
        %{id: "guest"} -> %StreamifyServer.User{id: "guest"}
        user -> user
      end

    conn
    |> put_status(:ok)
    |> json(StreamifyServer.User.to_map(user))
  end
end

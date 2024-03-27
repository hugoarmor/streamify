defmodule StreamifyServerWeb.AuthController do
  use StreamifyServerWeb, :controller

  def authenticate(conn, %{"username" => username, "password" => password}) do
    case StreamifyServer.User.authenticate_user(username, password) do
      {:ok, user} ->
        handle_successful_authentication(conn, user)

      {:error, _reason} ->
        handle_authentication_error(conn)
    end
  end

  defp handle_successful_authentication(conn, user) do
    case StreamifyServerWeb.Guardian.encode_and_sign(user, %{}, token_type: :access) do
      {:ok, jwt, _full_claims} ->
        conn
        |> put_status(:ok)
        |> put_resp_header("authorization", jwt)
        |> json(%{token: jwt, message: "Successfully authenticated"})

      {:error, _reason} ->
        handle_authentication_error(conn)
    end
  end

  defp handle_authentication_error(conn) do
    conn
    |> put_status(:unauthorized)
    |> json(%{message: "Unauthorized"})
  end

  def authenticate_guest(conn, %{"password" => password, "jam_id" => jam_id}) do
    with jam <- StreamifyServer.Repo.get(Jam, jam_id),
         true <- Argon2.verify_pass(password, jam.password) do
      handle_successful_guest_authentication(conn)
    else
      _ ->
        IO.puts "FAILED HERE"
        handle_authentication_error(conn)
    end
  end

  defp handle_successful_guest_authentication(conn) do
    guest = %{id: "guest"}

    case StreamifyServerWeb.Guardian.encode_and_sign(guest, %{}, token_type: :access) do
      {:ok, jwt, _full_claims} ->
        conn
        |> put_status(:ok)
        |> put_resp_header("authorization", jwt)
        |> json(%{token: jwt, message: "Successfully authenticated"})

      {:error, _reason} ->
        handle_authentication_error(conn)
    end
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

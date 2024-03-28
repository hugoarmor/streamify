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
    resource = "user:#{user.id}"

    case StreamifyServerWeb.Guardian.encode_and_sign(resource, %{}, token_type: :access) do
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
      handle_successful_guest_authentication(conn, jam_id)
    else
      _ ->
        handle_authentication_error(conn)
    end
  end

  defp handle_successful_guest_authentication(conn, jam_id) do
    resource = "jam:#{jam_id}"

    case StreamifyServerWeb.Guardian.encode_and_sign(resource, %{}, token_type: :access) do
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

    case current_resource.role do
      "user" -> conn |> put_status(:ok) |> json(StreamifyServer.User.to_map(current_resource))
      _ -> conn |> put_status(:unauthorized) |> json(%{message: "Unauthorized"})
    end
  end

  def authorize_jam_guest(conn, %{"jam_id" => jam_id}) do
    if Auth.Service.jam_guest_authorized?(conn, jam_id) do
      conn |> put_status(:ok) |> json(%{message: "Authorized"})
    else
      conn |> put_status(:unauthorized) |> json(%{message: "Unauthorized"})
    end
  end
end

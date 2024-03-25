defmodule StreamifyServerWeb.UsersController do
  use StreamifyServerWeb, :controller

  def index(conn, _params) do
    users = StreamifyServer.Repo.all(StreamifyServer.User)
    json conn, StreamifyServer.User.to_map_many(users)
  end

  def show(conn, %{"id" => id}) do
    user = StreamifyServer.Repo.get(StreamifyServer.User, id)
    json conn, StreamifyServer.User.to_map(user)
  end

  def create(conn, %{"user" => user_params}) do
    changeset = StreamifyServer.User.changeset(%StreamifyServer.User{}, user_params)
    case StreamifyServer.Repo.insert(changeset) do
      {:ok, user} ->
        conn
        |> put_status(:created)
        |> json(StreamifyServer.User.to_map(user))
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(StreamifyServer.User.to_map(changeset))
    end
  end

  def update(conn, %{"id" => id, "user" => user_params}) do
    user = StreamifyServer.Repo.get!(StreamifyServer.User, id)
    changeset = StreamifyServer.User.changeset(user, user_params)
    case StreamifyServer.Repo.update(changeset) do
      {:ok, user} ->
        conn
        |> put_status(:ok)
        |> json(StreamifyServer.User.to_map(user))
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(StreamifyServer.User.to_map(changeset))
    end
  end

  def delete(conn, %{"id" => id}) do
    user = StreamifyServer.Repo.get!(StreamifyServer.User, id)
    StreamifyServer.Repo.delete!(user)
    conn |> put_status(:no_content) |> send_resp(200, "")
  end
end

defmodule StreamifyServerWeb.JamsController do
  use StreamifyServerWeb, :controller

  def index(conn, _params) do
    jams = StreamifyServer.Repo.all(Jam)
    json conn, Jam.to_map_many(jams)
  end

  def show(conn, %{"id" => id}) do
    jam = StreamifyServer.Repo.get(Jam, id)
    json conn, Jam.to_map(jam)
  end

  def create(conn, %{"jam" => jam_params}) do
    changeset = Jam.changeset(%Jam{}, jam_params)
    case StreamifyServer.Repo.insert(changeset) do
      {:ok, jam} ->
        conn
        |> put_status(:created)
        |> json(Jam.to_map(jam))
      {:error, _changeset} ->
        conn
        |> send_resp(422, "Could not create jam")
    end
  end

  def update(conn, %{"id" => id, "jam" => jam_params}) do
    jam = StreamifyServer.Repo.get!(Jam, id)
    changeset = Jam.changeset(jam, jam_params)
    case StreamifyServer.Repo.update(changeset) do
      {:ok, jam} ->
        conn
        |> put_status(:ok)
        |> json(Jam.to_map(jam))
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(Jam.to_map(changeset))
    end
  end

  def delete(conn, %{"id" => id}) do
    jam = StreamifyServer.Repo.get!(Jam, id)
    StreamifyServer.Repo.delete!(jam)
    conn |> send_resp(204, "")
  end
end

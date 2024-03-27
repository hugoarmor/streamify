defmodule StreamifyServerWeb.JamsController do
  use StreamifyServerWeb, :controller

  def index(conn, _params) do
    jams = StreamifyServer.Repo.all(Jam)
    json(conn, Jam.to_map_many(jams))
  end

  def show(conn, %{"id" => id}) do
    case StreamifyServer.Repo.get(Jam, id) do
      nil ->
        conn |> send_resp(404, "Not found")

      jam ->
        handle_jam_response(conn, jam)
    end
  end

  defp handle_jam_response(conn, jam) do
    case jam.folder_relative_path
         |> FilesService.join_managed_folder()
         |> FilesService.path_exists?() do
      true ->
        handle_existing_jam(conn, jam)
      false ->
        conn |> send_resp(404, "Not found")
    end
  end

  defp handle_existing_jam(conn, jam) do
    case Jam.expired?(jam) do
      true ->
        conn |> send_resp(404, "Not found")
      false ->
        conn |> json(Jam.to_map(jam))
    end
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

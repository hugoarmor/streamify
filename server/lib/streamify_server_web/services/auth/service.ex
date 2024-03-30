defmodule Auth.Service do
  import Plug.Conn

  def jam_guest_authorized?(conn, jam_id) do
    current_resource = Guardian.Plug.current_resource(conn)

    current_resource.id == jam_id && current_resource.role == "jam"
  end

  def jam_guest?(conn) do
    Guardian.Plug.current_resource(conn).role == "jam"
  end

  def can_access_folder?(conn, folder_relative_path) do
    if jam_guest?(conn) do
      folder_relative_path == Guardian.Plug.current_resource(conn).folder_relative_path
    else
      true
    end
  end

  def enable_folder_access!(conn, folder_relative_path) do
    if !can_access_folder?(conn, folder_relative_path) do
      conn |> send_resp(403, "Unauthorized") |> halt()
    end
  end
end

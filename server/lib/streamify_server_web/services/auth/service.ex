defmodule Auth.Service do
  def jam_guest_authorized?(conn, jam_id) do
    current_resource = Guardian.Plug.current_resource(conn)

    current_resource.id == jam_id && current_resource.role == "jam"
  end

  def jam_guest?(conn) do
    Guardian.Plug.current_resource(conn).role == "jam"
  end
end

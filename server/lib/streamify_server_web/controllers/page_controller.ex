defmodule StreamifyServerWeb.PageController do
  use StreamifyServerWeb, :controller

  def index(conn, _params) do

    conn |> put_resp_content_type("text/html") |>
    send_resp(200, File.read!("priv/static/index.html"))
  end
end

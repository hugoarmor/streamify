defmodule StreamifyServerWeb.PageController do
  use StreamifyServerWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end

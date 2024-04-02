defmodule StreamifyServerWeb.Router do
  use StreamifyServerWeb, :router

  pipeline :browser do
    plug(:accepts, ["html"])
    plug(:fetch_session)
    plug(:fetch_live_flash)
    plug(:put_root_layout, {StreamifyServerWeb.LayoutView, :root})
    plug(:protect_from_forgery)
    plug(:put_secure_browser_headers)
  end

  pipeline :api do
    plug(:accepts, ["json"])
  end

  pipeline :static do
    plug(Plug.Static, at: "/", from: {:streamify_server, "public"}, gzip: false)
  end

  pipeline :auth do
    plug(Guardian.Plug.Pipeline,
      module: StreamifyServerWeb.Guardian,
      error_handler: StreamifyServerWeb.AuthErrorHandler
    )

    plug(Guardian.Plug.VerifySession, claims: %{"typ" => "access"})
    plug(Guardian.Plug.VerifyHeader, claims: %{"typ" => "access"})
    plug(Guardian.Plug.EnsureAuthenticated)
    plug(Guardian.Plug.LoadResource, allow_blank: true)
  end

  scope "/browser", StreamifyServerWeb do
    pipe_through(:browser)

    get("/", PageController, :index)
  end

  scope "/auth", StreamifyServerWeb do
    post("/sign_in", AuthController, :authenticate)
    post("/jams/sign_in", AuthController, :authenticate_guest)

    pipe_through(:auth)
    get("/me", AuthController, :me)
    get("/jams/:jam_id", AuthController, :authorize_jam_guest)
  end

  # Other scopes may use custom stacks.
  scope "/api", StreamifyServerWeb do
    pipe_through(:api)

    get("/files/:file_path", FilesController, :download)
    get("/files/zip/:zip_id", FilesController, :download_zip)
    resources("/jams", JamsController, only: [:show])

    pipe_through(:auth)

    get("/files", FilesController, :index)
    delete("/files/:file_path", FilesController, :destroy)
    delete("/files", FilesController, :destroy_many)
    patch("/files/:old_path/rename", FilesController, :rename)
    post("/files/upload", FilesController, :upload)
    post("/files/zip", FilesController, :zip)

    resources("/users", UsersController)
    resources("/jams", JamsController, only: [:index, :create, :update])
  end

  scope "/", StreamifyServerWeb do
    pipe_through(:static)

    get "/*path", PageController, :index
  end
end

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

  scope "/", StreamifyServerWeb do
    pipe_through(:browser)

    get("/", PageController, :index)
  end

  scope "/auth", StreamifyServerWeb do
    post("/sign_in", AuthController, :authenticate)
    post("/jams/sign_in", AuthController, :authenticate_guest)

    pipe_through(:auth)
    get("/me", AuthController, :me)
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

  # Enables LiveDashboard only for development
  #
  # If you want to use the LiveDashboard in production, you should put
  # it behind authentication and allow only admins to access it.
  # If your application does not have an admins-only section yet,
  # you can use Plug.BasicAuth to set up some basic authentication
  # as long as you are also using SSL (which you should anyway).
  if Mix.env() in [:dev, :test] do
    import Phoenix.LiveDashboard.Router

    scope "/" do
      pipe_through(:browser)

      live_dashboard("/dashboard", metrics: StreamifyServerWeb.Telemetry)
    end
  end

  # Enables the Swoosh mailbox preview in development.
  #
  # Note that preview only shows emails that were sent by the same
  # node running the Phoenix server.
  if Mix.env() == :dev do
    scope "/dev" do
      pipe_through(:browser)

      forward("/mailbox", Plug.Swoosh.MailboxPreview)
    end
  end
end

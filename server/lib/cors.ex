defmodule Api.CORS do
  use Corsica.Router,
    origins: "*",
    allow_credentials: true,
    max_age: 600

  resource("/public/*", origins: "*")
  resource("/*")
end

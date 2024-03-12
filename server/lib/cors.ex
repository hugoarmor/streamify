defmodule Api.CORS do
  use Corsica.Router,
    origins: "*",
    allow_credentials: true,
    max_age: 600,
    allow_headers: ["accept", "content-type", "authorization"]

  resource("/public/*", origins: "*")
  resource("/*")
end

defmodule StreamifyServerWeb.CORS do
  use Corsica.Router,
    origins: "*",
    allow_credentials: true,
    max_age: 600,
    allow_headers: ["accept", "content-type", "authorization"],
    allow_methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"]

  resource("/public/*", origins: "*")
  resource("/*")
end

defmodule Streamify.MixProject do
  use Mix.Project

  def project do
    [
      app: :streamify,
      version: "0.1.0",
      elixir: "~> 1.15",
      start_permanent: Mix.env() == :prod,
      deps: deps(),
      releases: [streamify: [version: "0.1.0"]]
    ]
  end

  # Run "mix help compile.app" to learn about applications.
  def application do
    [
      mod: {Streamify, []},
      extra_applications: [:logger],
    ]
  end

  # Run "mix help deps" to learn about dependencies.
  defp deps do
    [
      {:plug_cowboy, "~> 2.0"},
      {:bandit, "~> 1.0"},
      {:distillery, "~> 2.0"}
    ]
  end
end

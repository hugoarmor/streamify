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
      extra_applications: extra_applications(Mix.env(),[:logger, :lettuce])
    ]
  end

  defp extra_applications(:dev, default), do: default ++ [:lettuce]
  defp extra_applications(_, default), do: default

  # Run "mix help deps" to learn about dependencies.
  defp deps do
    [
      {:plug_cowboy, "~> 2.0"},
      {:bandit, "~> 1.0"},
      {:distillery, "~> 2.0"},
      {:jason, "~> 1.2"},
      {:corsica, "~> 2.1"},
      {:lettuce, "~> 0.3.0", only: :dev}
    ]
  end
end

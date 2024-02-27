defmodule Streamify do
  use Application

  def start(_type, _args) do
    IO.puts "Starting Streamify..."

    managed_folder = FilesService.get_managed_folder();
    {status, _} = managed_folder |> File.stat();

    if status == :error do
      IO.puts "Error: Managed folder #{managed_folder} does not exist or is not accessible."
      System.halt(1)
    end

    children = [
      {Bandit, plug: Router, scheme: :http, port: 4000}
    ]

    {:ok, pid} = Supervisor.start_link(children, strategy: :one_for_one)

    File.read!("static/streamify.txt") |> IO.puts()
    IO.puts "[INFO] The folder #{managed_folder} is being Streamified at http://localhost:4000."

    Process.sleep(:infinity)

    {:ok, pid}
  end
end

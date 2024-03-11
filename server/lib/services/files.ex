defmodule FilesService do
  def get_file_stream(file_path) do
    stats = File.stat!(file_path)
    file_name = Path.basename(file_path)
    stats_with_file_name = Map.put_new(stats, :file_name, file_name)

    stream = File.stream!(file_path, [], 10**6)

    {:ok, stream, stats_with_file_name}
  rescue
    _ -> {:error, "File #{file_path} not found"}
  end

  def get_managed_folder do
    path = Path.expand("~/Streamify")

    {status, _stat} = File.stat(path)

    if status == :error do
      File.mkdir_p!(path)
      IO.puts("Created managed folder #{path}")
    end

    path
  end

  def get_folder_files!(path) do
    File.ls!(path)
    |> Enum.into(%{}, fn file ->
      file_path = Path.join(path, file)
      stats = File.stat!(file_path, [{:time, :posix}])

      relative_path = Path.relative_to(file_path, get_managed_folder())

      {file,
       %{
         size: stats.size,
         type: stats.type,
         last_modified: stats.mtime,
         relative_path: relative_path
       }}
    end)
  end
end

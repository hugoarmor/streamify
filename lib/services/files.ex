defmodule FilesService do
  def get_file_stream({from, to}, file_path) do
    {stream, stats} = get_file_stream_internal(file_path)
    send(from, {to, {:ok, stream, stats}})
  rescue
    _ -> send(from, {to, {:error, "File #{file_path} not found"}})
  end

  def get_file_stream(file_path) do
    get_file_stream_internal(file_path)
  rescue
    _ -> {:error, "File #{file_path} not found"}
  end

  defp get_file_stream_internal(file_path) do
    stats = File.stat!(file_path)
    file_name = Path.basename(file_path)
    stats_with_file_name = Map.put_new(stats, :file_name, file_name)

    stream = File.stream!(file_path, [], 2048)

    {stream, stats_with_file_name}
  end

  def get_managed_folder do
    System.get_env("STREAMIFY_MANAGED_FOLDER")
  end
end

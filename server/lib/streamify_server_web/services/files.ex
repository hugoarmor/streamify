defmodule FilesService do
  def get_file_stream(file_path) do
    stats = File.stat!(file_path)
    file_name = Path.basename(file_path)
    stats_with_file_name = Map.put_new(stats, :file_name, file_name)

    stream = File.stream!(file_path, [], 10 ** 6)

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

  def delete_file(file_path) do
    File.rm_rf(file_path)
  end

  def rename_file(old_path, new_path) do
    File.rename(old_path, new_path)
  end

  def upload_file_stream(file_path, stream, is_append? \\ false) do
    if !is_append? do
      File.rm(file_path)
    end

    Enum.each(stream, fn chunk ->
      File.write!(file_path, chunk, [:append])
    end)
  rescue
    error -> {:error, "File #{file_path} could not be uploaded: #{inspect(error)}"}
  end

  def create_folder(folder_path) do
    managed_folder = get_managed_folder()

    case File.mkdir_p(Path.join(managed_folder, folder_path)) do
      :ok -> :ok
      {:error, reason} -> {:error, "Could not create folder #{folder_path}: #{reason}"}
    end
  end

  def copy_file(old_path, new_path) do
    File.cp(old_path, new_path)
  end

  def zip_files(zip_file_path, file_paths) do
    managed_folder = get_managed_folder()

    file_paths =
      file_paths
      |> Enum.map(fn filename -> Path.join(managed_folder, filename) end)
      |> Enum.map(&String.to_charlist/1)

    case :zip.create(zip_file_path, file_paths) do
      {:ok, zip_file_path} -> {:ok, zip_file_path}
      {:error, reason} ->
        delete_file(zip_file_path)
        {:error, reason}
    end
  end

  def path_exists?(path) do
    File.exists?(path)
  end

  def join_managed_folder(file_path) do
    Path.join(get_managed_folder(), file_path)
  end
end

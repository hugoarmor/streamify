defmodule StreamifyServer.Repo.Migrations.CreateJamsTable do
  use Ecto.Migration

  def change do
    create table(:jams, primary_key: false) do
      add :id, :uuid, primary_key: true
      add :folder_relative_path, :string, [null: false, unique: true]
      add :expires_at, :utc_datetime
      add :bytes_limit, :integer
      add :password, :string, null: false
      add :can_edit, :boolean, null: false, default: false

      timestamps()
    end

    create unique_index(:jams, [:folder_relative_path])
  end
end

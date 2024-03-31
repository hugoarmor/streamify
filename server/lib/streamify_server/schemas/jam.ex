defmodule Jam do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}

  schema "jams" do
    field :folder_relative_path, :string
    field :bytes_limit, :integer
    field :expires_at, :utc_datetime
    field :password, :string
    field :can_edit, :boolean, default: false

    timestamps()
  end

  @doc false
  def changeset(user, params \\ %{}) do
    user
    |> cast(params, [:folder_relative_path, :expires_at, :bytes_limit, :password, :can_edit])
    |> validate_required([:folder_relative_path, :password])
    |> put_password_hash()
  end

  defp put_password_hash(changeset) do
    case get_change(changeset, :password) do
      nil -> changeset
      password -> put_change(changeset, :password, Argon2.hash_pwd_salt(password))
    end
  end

  def to_map(user) do
    %{
      id: user.id,
      folder_relative_path: user.folder_relative_path,
      expires_at: user.expires_at,
      can_edit: user.can_edit,
      bytes_limit: user.bytes_limit,
      inserted_at: user.inserted_at,
      updated_at: user.updated_at
    }
  end

  def to_map_many(jams) do
    Enum.map(jams, &to_map/1)
  end

  def expired?(jam) do
    DateTime.to_unix(jam.expires_at) < DateTime.to_unix(DateTime.utc_now())
  end
end

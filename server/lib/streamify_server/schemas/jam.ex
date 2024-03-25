defmodule Jam do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}

  schema "jams" do
    field :folder_relative_path, :string
    field :bytes_limit, :integer
    field :expires_at, :utc_datetime
    field :password, :string

    timestamps()
  end

  @doc false
  def changeset(user, params \\ %{}) do
    user
    |> cast(params, [:folder_relative_path, :expires_at, :bytes_limit, :password])
    |> validate_required([:folder_relative_path, :password])
    |> unique_constraint(:folder_relative_path)
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
      bytes_limit: user.bytes_limit,
      inserted_at: user.inserted_at,
      updated_at: user.updated_at
    }
  end

  def to_map_many(jams) do
    Enum.map(jams, &to_map/1)
  end
end

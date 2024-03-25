defmodule StreamifyServer.User do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}

  schema "users" do
    field :username, :string
    field :email, :string
    field :password_hash, :string

    timestamps()
  end

  @doc false
  def changeset(user, params \\ %{}) do
    user
    |> cast(params, [:username, :email])
    |> validate_required([:username, :email])
    |> validate_length(:username, min: 1)
    |> validate_format(:email, ~r/@/)
    |> put_password_hash(params)
  end

  defp put_password_hash(changeset, params) do
    case params["password"] do
      nil -> changeset
      password -> put_change(changeset, :password_hash, Argon2.hash_pwd_salt(password))
    end
  end

  def to_map(user) do
    %{
      id: user.id,
      username: user.username,
      email: user.email,
      inserted_at: user.inserted_at,
      updated_at: user.updated_at
    }
  end

  def to_map_many(users) do
    Enum.map(users, &to_map/1)
  end
end

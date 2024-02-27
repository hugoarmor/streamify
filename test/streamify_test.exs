defmodule StreamifyTest do
  use ExUnit.Case
  doctest Streamify

  test "greets the world" do
    assert Streamify.hello() == :world
  end
end

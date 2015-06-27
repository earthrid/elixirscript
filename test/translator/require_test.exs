defmodule ElixirScript.Translator.Require.Test do
  use ShouldI
  import ElixirScript.TestHelper

  should "translate require without as" do
    ex_ast = quote do
        require Hello.World
    end

    js_code = """
      Kernel.SpecialForms.require(Hello.World, Erlang.list(), this)
    """

    assert_translation(ex_ast, js_code)
  end

  should "translate require with as" do
    ex_ast = quote do
      require Hello.World, as: Test
    end

    js_code = """
    Kernel.SpecialForms.require(Hello.World, Erlang.list(Erlang.tuple(Erlang.atom('as'), Erlang.atom('Test'))), this)
    """

    assert_translation(ex_ast, js_code)
  end


end
var assert = require("../lib/d3-assert");

var requirejs, Linear;

describe('Linear', function(){

  before(function (asyncReturn){
    assert.requirejs('require-config', function(_requirejs) {
      requirejs = _requirejs;
      Linear = requirejs("scale.linear");
      asyncReturn();
    });
  });

  describe('range', function(){
    it("does not coerce range to numbers", function(){
      var scale, range;
      scale = Linear().range(["0", "2"]);
      range = scale.range();
      assert.equal(typeof range[0], "string");
      assert.equal(typeof range[1], "string");
    });

    it("can specify range values as colors", function(){
      var Rgb = requirejs('color.rgb');
      var Hsl = requirejs('color.hsl');
      var scale;
      scale = Linear().range(["red", "blue"]);
      assert.equal(scale.get(0.5), "#800080");
      scale = Linear().range(["#ff0000", "#0000ff"]);
      assert.equal(scale.get(0.5), "#800080");
      scale = Linear().range(["#f00", "#00f"]);
      assert.equal(scale.get(0.5), "#800080");
      scale = Linear().range([Rgb.parse(255,0,0), Hsl.parse(240,1,0.5)]);
      assert.equal(scale.get(0.5), "#800080");
      scale = scale.range(["hsl(0,100%,50%)", "hsl(240,100%,50%)"]);
      assert.equal(scale.get(0.5), "#800080");
    });
    it("can specify range values as arrays or objects", function(){
      var scale;
      scale = Linear().range([{color: "red"}, {color: "blue"}]);
      assert.deepEqual(scale.get(0.5), {"color":"#800080"});
      scale = scale.range([["red"], ["blue"]]);
      assert.deepEqual(scale.get(0.5), ["#800080"]);
    });
  });


});

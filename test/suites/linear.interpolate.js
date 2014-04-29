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

  describe('interpolate', function(){

    it("defaults to d3.interpolate", function(){
      var Interpolate = requirejs('interpolate');
      var scale, range;
      scale = Linear().range(["red", "blue"]);
      range = scale.range();
      assert.equal(scale.interpolate(), Interpolate.any);
      assert.equal(scale.get(0.5), "#800080");
    });
    it("can specify a custom interpolator", function(){
      var Interpolate = requirejs('interpolate');
      var scale, range;
      scale = Linear().range(["red", "blue"]).interpolate(Interpolate.hsl);
      assert.equal(scale.get(0.5), "#ff00ff");
      /*
      */
    });
  });


});

function inDelta(actual, expected, delta) {
  return actual >= expected - delta && actual <= expected + delta;
}


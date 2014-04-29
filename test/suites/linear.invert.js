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


  describe("invert", function(){
    it("coerces range value to numbers", function(){
      var scale;
      scale = Linear().range(["0", "2"]);
      assert.ok(inDelta(scale.invert("1"), 0.5, 1e-6));
      scale = Linear().range([new Date(1990, 0, 1), new Date(1991, 0, 1)]);
       assert.ok(inDelta(scale.invert(new Date(1990, 6, 2, 13)), 0.5, 1e-3));
      scale = Linear().range(["#000", "#fff"]);
      assert.ok(isNaN(scale.invert("#999")));
    });
    it("can invert a polylinear descending domain", function(){
      var scale;
      scale = Linear().domain([4, 2, 1]).range([1, 2, 4]);
      assert.ok(inDelta(scale.get(1.5), 3, 1e-6));
      assert.ok(inDelta(scale.get(3), 1.5, 1e-6));
      assert.ok(inDelta(scale.invert(1.5), 3, 1e-6));
      assert.ok(inDelta(scale.invert(3), 1.5, 1e-6));
      assert.ok(isNaN(scale.invert("#999")));
    });
    it("can invert a polylinear descending range", function(){
      var scale;
      scale = Linear().domain([1, 2, 4]).range([4, 2, 1]);
      assert.ok(inDelta(scale.get(1.5), 3, 1e-6));
      assert.ok(inDelta(scale.get(3), 1.5, 1e-6));
      assert.ok(inDelta(scale.invert(1.5), 3, 1e-6));
      assert.ok(inDelta(scale.invert(3), 1.5, 1e-6));
    });
  });


});

function inDelta(actual, expected, delta) {
  return actual >= expected - delta && actual <= expected + delta;
}


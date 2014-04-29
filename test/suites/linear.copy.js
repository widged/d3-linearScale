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


  describe('copy', function(){
    it("changes to the domain are isolated", function(){
      var scale, copy;
      scale = Linear(); copy = scale.copy();
      scale.domain([1, 2]);
      assert.deepEqual(copy.domain(), [0, 1]);
      assert.equal(scale.get(1), 0);
      assert.equal(copy.get(1), 1);
      copy.domain([2, 3]);
      assert.equal(scale.get(2), 1);
      assert.equal(copy.get(2), 0);
      assert.deepEqual(scale.domain(), [1, 2]);
      assert.deepEqual(copy.domain(), [2, 3]);

    });
    it("changes to the range are isolated", function(){
      var scale, copy;
      scale = Linear(); copy = scale.copy();
      scale.range([1, 2]);
      assert.equal(scale.invert(1), 0);
      assert.equal(copy.invert(1), 1);
      assert.deepEqual(copy.range(), [0, 1]);
      copy.range([2, 3]);
      assert.equal(scale.invert(2), 1);
      assert.equal(copy.invert(2), 0);
      assert.deepEqual(scale.range(), [1, 2]);
      assert.deepEqual(copy.range(), [2, 3]);

    });
    it("changes to the interpolator are isolated", function(){
      var Interpolate = requirejs('interpolate');
      var scale, copy;
      scale = Linear().range(["red", "blue"]); copy = scale.copy();
      scale.interpolate(Interpolate.hsl);
      assert.equal(scale.get(0.5), "#ff00ff");
      assert.equal(copy.get(0.5), "#800080");
      assert.equal(copy.interpolate(), Interpolate.any);
    });
    it("changes to the clamping are isolated", function(){
      var scale, copy;
      scale = Linear().clamp(true); copy = scale.copy();
      scale.clamp(false);
      assert.equal(scale.get(2), 2);
      assert.equal(copy.get(2), 1);
      assert.equal(copy.clamp(), true);
      copy.clamp(false);
      assert.equal(scale.get(2), 2);
      assert.equal(copy.get(2), 2);
      assert.equal(copy.clamp(), false);
    });
  });


});


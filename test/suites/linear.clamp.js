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

  describe('clamp', function(){
    it("defaults to false", function(){
      var scale;
      scale = Linear();
      assert.equal(scale.clamp(), false);
      assert.inDelta(scale.get(-0.5), -0.5, 1e-6);
      assert.inDelta(scale.get(1.5), 1.5, 1e-6);
    });
    it("can clamp to the domain", function(){
      var scale;
      scale = Linear().clamp(true);
      assert.inDelta(scale.get(-0.5), 0.0, 1e-6);
      assert.inDelta(scale.get(0.5),  0.5, 1e-6);
      assert.inDelta(scale.get(1.5),  1.0, 1e-6);
      scale = Linear().domain([1, 0]).clamp(true);
      assert.inDelta(scale.get(-0.5), 1.0, 1e-6);
      assert.inDelta(scale.get(0.5), 0.5, 1e-6);
      assert.inDelta(scale.get(1.5), 0.0, 1e-6);
    });
    it("can clamp to the range", function(){
      var scale;
      scale = Linear().clamp(true);
      assert.inDelta(scale.get(-0.5), 0.0, 1e-6);
      assert.inDelta(scale.get(0.5),  0.5, 1e-6);
      assert.inDelta(scale.get(1.5),  1.0, 1e-6);
      scale = Linear().range([1, 0]).clamp(true);
      assert.inDelta(scale.get(-0.5), 1.0, 1e-6);
      assert.inDelta(scale.get(0.5), 0.5, 1e-6);
      assert.inDelta(scale.get(1.5), 0.0, 1e-6);
    });
  });

});


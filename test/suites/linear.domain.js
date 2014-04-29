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

  describe('domain', function(){
    it('coerces domain values to numbers', function(){
      var scale, domain;
      scale = Linear().domain([new Date(1990, 0, 1), new Date(1991, 0, 1)]);
      domain = scale.domain();
      assert.equal(typeof domain[0], "number");
      assert.equal(typeof domain[1], "number");
      assert.ok(inDelta(scale.get(new Date(1989, 09, 20)), -0.2, 1e-2));
      assert.ok(inDelta(scale.get(new Date(1990, 04, 27)), 0.4, 1e-2));
      scale = Linear().domain(["0", "1"]);
      domain = scale.domain();
      assert.equal(typeof domain[0], "number");
      assert.equal(typeof domain[1], "number");
      assert.ok(inDelta(scale.get(0.5), 0.5, 1e-6));
    });
    it('can specify a polylinear domain and range"', function(){
      var scale = Linear().domain([-10, 0, 100]).range([0, 5, 6]);
      assert.equal(scale.get(-5), 2.5);
      assert.equal(scale.get(50), 5.5);
      assert.equal(scale.get(75), 5.75);
    });
    it("the smaller of the domain or range is observed", function(){
        var scale;
        scale = Linear().domain([-10, 0]).range([0, 2, 4]).clamp(true);
        assert.equal(scale.get(-5), 1);
        assert.equal(scale.get(50), 2);
        scale = Linear().domain([-10, 0, 100]).range([5, 10]).clamp(true);
        assert.equal(scale.get(-5), 7.5);
        assert.equal(scale.get(50), 10);
    });
    it("an empty domain maps to the range start", function(){
        var scale = Linear().domain([0, 0]).range([5, 10]);
        assert.equal(scale.get(0), 5);
        assert.equal(scale.get(-1), 5);
        assert.equal(scale.get(1), 5);
    });

  });

});

function inDelta(actual, expected, delta) {
  return actual >= expected - delta && actual <= expected + delta;
}


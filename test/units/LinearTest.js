var assert = require("assert");

var requirejs, Linear;

function init(asyncReturn) {
  requirejs = require("requirejs");
  requirejs.config({ baseUrl: '.', nodeRequire: require });
    requirejs(['require-config'], function(Config) {
    requirejs.config(Config);
        Linear = requirejs("scale.linear");
        asyncReturn();
    });
}

describe('Linear', function(){

    before(function (done){
        init(done);
    });

  describe('constructor', function(){
    it('creates an instance with default domain and range', function(){
      var scale = Linear();
      assert.deepEqual(scale.domain(), [0,1]);
      assert.deepEqual(scale.range(), [0,1]);
      assert.equal(scale.get(0.5), 0.5);
    });
    it('can set a new domain', function(){
      var scale = Linear().domain([0, 5]);
      assert.deepEqual(scale.domain(), [0,5]);
      assert.deepEqual(scale.range(), [0,1]);
      assert.equal(scale.get(0.5), 0.1);
    });
    it('can set a new range', function(){
      var scale = Linear().range([0, 5]);
      assert.deepEqual(scale.domain(), [0,1]);
      assert.deepEqual(scale.range(), [0,5]);
      assert.equal(scale.get(0.5), 2.5);
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

  describe('clamp', function(){
    it("defaults to false", function(){
      var scale;
      scale = Linear();
      assert.equal(scale.clamp(), false);
      assert.ok(inDelta(scale.get(-0.5), -0.5, 1e-6));
      assert.ok(inDelta(scale.get(1.5), 1.5, 1e-6));
    });
    it("can clamp to the domain", function(){
      var scale;
      scale = Linear().clamp(true);
      assert.ok(inDelta(scale.get(-0.5), 0.0, 1e-6));
      assert.ok(inDelta(scale.get(0.5),  0.5, 1e-6));
      assert.ok(inDelta(scale.get(1.5),  1.0, 1e-6));
      scale = Linear().domain([1, 0]).clamp(true);
      assert.ok(inDelta(scale.get(-0.5), 1.0, 1e-6));
      assert.ok(inDelta(scale.get(0.5), 0.5, 1e-6));
      assert.ok(inDelta(scale.get(1.5), 0.0, 1e-6));
    });
    it("can clamp to the range", function(){
      var scale;
      scale = Linear().clamp(true);
      assert.ok(inDelta(scale.get(-0.5), 0.0, 1e-6));
      assert.ok(inDelta(scale.get(0.5),  0.5, 1e-6));
      assert.ok(inDelta(scale.get(1.5),  1.0, 1e-6));
      scale = Linear().range([1, 0]).clamp(true);
      assert.ok(inDelta(scale.get(-0.5), 1.0, 1e-6));
      assert.ok(inDelta(scale.get(0.5), 0.5, 1e-6));
      assert.ok(inDelta(scale.get(1.5), 0.0, 1e-6));
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
/*
*/
});

function inDelta(actual, expected, delta) {
  return actual >= expected - delta && actual <= expected + delta;
}


/*

  describe('nice', function(){
    it("nices the domain, extending it to round numbers", function(){
      var scale;
      scale = Linear().domain([1.1, 10.9]).nice();
      assert.equal(scale.domain(), [1, 11]);
      scale = Linear().domain([10.9, 1.1]).nice();
      assert.equal(scale.domain(), [11, 1]);
      scale = Linear().domain([0.7, 11.001]).nice();
      assert.equal(scale.domain(), [0, 12]);
      scale = Linear().domain([123.1, 6.7]).nice();
      assert.equal(scale.domain(), [130, 0]);
      scale = Linear().domain([0, 0.49]).nice();
      assert.equal(scale.domain(), [0, 0.5]);
    });
    it("has no effect on degenerate domains", function(){
      var scale;
      scale = Linear().domain([0, 0]).nice();
      assert.equal(scale.domain(), [0, 0]);
      scale = Linear().domain([0.5, 0.5]).nice();
      assert.equal(scale.domain(), [0.5, 0.5]);
    });
    it("nicing a polylinear domain only affects the extent", function(){
      var scale;
      scale = Linear().domain([1.1, 1, 2, 3, 10.9]).nice();
      assert.equal(scale.domain(), [1, 1, 2, 3, 11]);
      scale = Linear().domain([123.1, 1, 2, 3, -0.9]).nice();
      assert.equal(scale.domain(), [130, 1, 2, 3, -10]);
    });
    it("accepts a tick count to control nicing step", function(){
      var scale;
      scale = Linear().domain([12, 87]).nice(5);
      assert.equal(scale.domain(), [0, 100]);
      scale = Linear().domain([12, 87]).nice(10);
      assert.equal(scale.domain(), [10, 90]);
      scale = Linear().domain([12, 87]).nice(100);
      assert.equal(scale.domain(), [12, 87]);
    });
  });


    "ticks": {
      "generates ticks of varying degree": function(d3) {
        var x = d3.scale.linear();
        assert.deepEqual(x.ticks(1).map(x.tickFormat(1)), [0, 1]);
        assert.deepEqual(x.ticks(2).map(x.tickFormat(2)), [0, .5, 1]);
        assert.deepEqual(x.ticks(5).map(x.tickFormat(5)), [0, .2, .4, .6, .8, 1]);
        assert.deepEqual(x.ticks(10).map(x.tickFormat(10)), [0, .1, .2, .3, .4, .5, .6, .7, .8, .9, 1]);
        var x = d3.scale.linear().domain([1, 0]);
        assert.deepEqual(x.ticks(1).map(x.tickFormat(1)), [0, 1]);
        assert.deepEqual(x.ticks(2).map(x.tickFormat(2)), [0, .5, 1]);
        assert.deepEqual(x.ticks(5).map(x.tickFormat(5)), [0, .2, .4, .6, .8, 1]);
        assert.deepEqual(x.ticks(10).map(x.tickFormat(10)), [0, .1, .2, .3, .4, .5, .6, .7, .8, .9, 1]);
      },
      "formats ticks with the appropriate precision": function(d3) {
        var x = d3.scale.linear().domain([.123456789, 1.23456789]);
        assert.strictEqual(x.tickFormat(1)(x.ticks(1)[0]), "1");
        assert.strictEqual(x.tickFormat(2)(x.ticks(2)[0]), "0.5");
        assert.strictEqual(x.tickFormat(4)(x.ticks(4)[0]), "0.2");
        assert.strictEqual(x.tickFormat(8)(x.ticks(8)[0]), "0.2");
        assert.strictEqual(x.tickFormat(16)(x.ticks(16)[0]), "0.2");
        assert.strictEqual(x.tickFormat(32)(x.ticks(32)[0]), "0.15");
        assert.strictEqual(x.tickFormat(64)(x.ticks(64)[0]), "0.14");
        assert.strictEqual(x.tickFormat(128)(x.ticks(128)[0]), "0.13");
        assert.strictEqual(x.tickFormat(256)(x.ticks(256)[0]), "0.125");
        var x = d3.scale.linear().domain([0.01, 0.09]);
        assert.strictEqual(x.tickFormat(10,"g")(x.ticks(10)[0]), "0.01")
        assert.strictEqual(x.tickFormat(20,"g")(x.ticks(20)[0]), "0.010")
        assert.strictEqual(x.tickFormat(10,"r")(x.ticks(10)[0]), "0.01")
        assert.strictEqual(x.tickFormat(20,"r")(x.ticks(20)[0]), "0.010")
        assert.strictEqual(x.tickFormat(10,"e")(x.ticks(10)[0]), "1e-2")
        assert.strictEqual(x.tickFormat(20,"e")(x.ticks(20)[0]), "1.0e-2")
        assert.strictEqual(x.tickFormat(10,"%")(x.ticks(10)[0]), "1%")
        assert.strictEqual(x.tickFormat(20,"%")(x.ticks(10)[0]), "1.0%")
        assert.strictEqual(x.tickFormat(10,"p")(x.ticks(10)[0]), "1%")
        assert.strictEqual(x.tickFormat(20,"p")(x.ticks(10)[0]), "1.0%")
        var x = d3.scale.linear().domain([1000, 1001]);
        assert.strictEqual(x.tickFormat(3)(x.ticks(3)[1]), "1,000.5");
        assert.strictEqual(x.tickFormat(3,",g")(x.ticks(3)[1]), "1,000.5");
        assert.strictEqual(x.tickFormat(3,"g")(x.ticks(3)[1]), "1000.5");
        assert.strictEqual(x.tickFormat(3,"e")(x.ticks(3)[1]), "1.0005e+3");
        assert.strictEqual(x.tickFormat(3,"s")(x.ticks(3)[1]), "1.0005k");
      }
    },

    "tickFormat": {
      "applies automatic precision when not explicitly specified": function(d3) {
        var x = d3.scale.linear();
        assert.strictEqual(x.tickFormat(10, "f")(Math.PI), "3.1");
        assert.strictEqual(x.tickFormat(100, "f")(Math.PI), "3.14");
        assert.strictEqual(x.tickFormat(100, "$f")(Math.PI), "$3.14");
        assert.strictEqual(x.domain([0, 100]).tickFormat(100, "%")(Math.PI), "314%");
      },
      "applies fixed-scale SI-prefix notation": function(d3) {
        var x = d3.scale.linear().domain([0, 1e6]);
        assert.deepEqual(x.ticks(10).map(x.tickFormat(10, "s")), ["0.0M", "0.1M", "0.2M", "0.3M", "0.4M", "0.5M", "0.6M", "0.7M", "0.8M", "0.9M", "1.0M"]);
        assert.deepEqual(x.ticks(10).map(x.tickFormat(10, ".2s")), ["0.00M", "0.10M", "0.20M", "0.30M", "0.40M", "0.50M", "0.60M", "0.70M", "0.80M", "0.90M", "1.00M"]);
        assert.deepEqual(x.ticks(10).map(x.tickFormat(10, "+$s")), ["+$0.0M", "+$0.1M", "+$0.2M", "+$0.3M", "+$0.4M", "+$0.5M", "+$0.6M", "+$0.7M", "+$0.8M", "+$0.9M", "+$1.0M"]);
        var x = d3.scale.linear().domain([0, 1e5]);
        assert.deepEqual(x.ticks(10).map(x.tickFormat(10, "s")), ["0k", "10k", "20k", "30k", "40k", "50k", "60k", "70k", "80k", "90k", "100k"]);
        var x = d3.scale.linear().domain([0, 1e-4]);
        assert.deepEqual(x.ticks(10).map(x.tickFormat(10, "s")), ["0µ", "10µ", "20µ", "30µ", "40µ", "50µ", "60µ", "70µ", "80µ", "90µ", "100µ"]);
      },
      "if count is not specified, defaults to 10": function(d3) {
        var x = d3.scale.linear();
        assert.strictEqual(x.tickFormat()(Math.PI), "3.1");
        assert.strictEqual(x.tickFormat(1)(Math.PI), "3");
        assert.strictEqual(x.tickFormat(10)(Math.PI), "3.1");
        assert.strictEqual(x.tickFormat(100)(Math.PI), "3.14");
      }
    },
*/
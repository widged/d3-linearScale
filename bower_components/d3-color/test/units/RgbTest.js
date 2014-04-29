var assert = require("../lib/d3-assert");

var requirejs, ColorSpace;

function init(asyncReturn) {
  requirejs = require("requirejs");
  requirejs.config({ baseUrl: '.', nodeRequire: require });
    requirejs(['require-config'], function(Config) {
    requirejs.config(Config);
        ColorSpace = requirejs("rgb");
        asyncReturn();
    });
}

describe('Rgb', function(){

  before(function (done){
      init(done);
  });

  describe('type check', function(){
    it("expects rgb", function(){
      var brown = {"r":165,"g":42,"b":42};
      var black = {"r":0,"g":0,"b":0};
      assert.deepEqual(ColorSpace.validate(brown), brown);
      assert.deepEqual(ColorSpace.validate(), black);
      assert.deepEqual(ColorSpace.validate(""), black);
      assert.deepEqual(ColorSpace.validate({}), black);
      assert.deepEqual(ColorSpace.validate({r: "x", a: 'b' }), black);
    });
  });
  describe('color space conversion', function(){
    it("can convert from HEX", function(){
      var brown = {"r":165,"g":42,"b":42};
      var steelblue = { r: 70, g: 130, b: 180 }; // 0x4682b4
      assert.deepEqual(ColorSpace.fromHex(0xa52a2a), brown);
    });
    it("can convert to HEX", function(){
      assert.equal(ColorSpace.toHex({r: 255, g: 0, b: 0}), "#ff0000");
    });
    it("can convert to LAB", function(){
      var expected;
      expected = { l: 53.24079414130722, a: 80.09245959641109, b: 67.20319651585301 };
      assert.deepEqual(ColorSpace.toLab({r: 255, g: 0, b: 0}), expected);
      expected = { l: 41.73251953866431, a: -10.998411255098816, b: 48.21006600604577 };
      assert.deepEqual(ColorSpace.toLab({r: 102, g: 102, b: 0}), expected);
      expected = { l: 12.65624852526134, a: 0.12256520883417721, b: -16.833209795877284 };
      assert.deepEqual(ColorSpace.toLab({r: 12, g: 34, b: 56}), expected);
    });
    it("can convert to HSL", function(){
      var expected = { h:0, s:1, l:0.5};
      assert.deepEqual(ColorSpace.toHsl({r: 255, g: 0, b: 0}), expected);
      console.log(ColorSpace.toHsl({r: 70, g: 130, b: 180}));
    });
  });

  describe('lightness modification', function(){
    it("can derive a brighter color", function(){
      var brown = ColorSpace.fromHex(0xa52a2a);
      assert.deepEqual(ColorSpace.brighter(brown), {r: 235, g: 60, b: 60});
      assert.deepEqual(ColorSpace.brighter(brown, 0.5), {r: 197, g: 50, b: 50});
      assert.deepEqual(ColorSpace.brighter(brown, 1.0), {r: 235, g: 60, b: 60});
      assert.deepEqual(ColorSpace.brighter(brown, 2.0), {r: 255, g: 85, b: 85});
    });
    it("can derive a darker color", function(){
      var coral = ColorSpace.fromHex(0xff7f50);
      assert.deepEqual(ColorSpace.darker(coral), {r: 178, g: 88, b: 56});
      assert.deepEqual(ColorSpace.darker(coral, 0.5), {r: 213, g: 106, b: 66});
      assert.deepEqual(ColorSpace.darker(coral, 1.0), {r: 178, g: 88, b: 56});
      assert.deepEqual(ColorSpace.darker(coral, 2.0), {r: 124, g: 62, b: 39});
    });
  });

});

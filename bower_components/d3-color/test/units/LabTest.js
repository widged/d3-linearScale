var assert = require("../lib/d3-assert");

var requirejs, ColorSpace;

function init(asyncReturn) {
  requirejs = require("requirejs");
  requirejs.config({ baseUrl: '.', nodeRequire: require });
    requirejs(['require-config'], function(Config) {
    requirejs.config(Config);
        ColorSpace = requirejs("lab");
        asyncReturn();
    });
}


describe('Lab', function(){

  before(function (done){
      init(done);

  });

  describe('type check', function(){
    it("expects rgb", function(){
      var brown = {"l":165,"a":42,"b":42};
      var black = {"l":0,"a":0,"b":0};
      assert.deepEqual(ColorSpace.validate(brown), brown);
      assert.deepEqual(ColorSpace.validate(), black);
      assert.deepEqual(ColorSpace.validate(""), black);
      assert.deepEqual(ColorSpace.validate({}), black);
      assert.deepEqual(ColorSpace.validate({r: "x", a: 'b' }), black);
    });
  });
  describe('color space conversion', function(){
    it("can convert to LAB", function(){
      var expected = { l: 20, a: 0.8, b: 0.3 };
      assert.deepEqual(ColorSpace.toLab(expected), expected);
    });
    it("can convert to RGB", function(){
      var expected, steelblue = { l: 52.46551718768575, a: -4.0774710123572255, b: -32.19186122981343 };
      expected = { r: 12, g: 34, b: 56 };
      assert.deepEqual(ColorSpace.toRgb({ l: 12.65624852526134, a: 0.12256520883417721, b: -16.833209795877284 }), expected);
      expected = {r: 70, g: 130, b: 180};
      assert.deepEqual(ColorSpace.toRgb(steelblue), expected);
    });
    it("can convert to HCL", function(){
      expected = {"h":-89.58282792342067,"c":16.833655998102003,"l":12.65624852526134};
      assert.deepEqual(ColorSpace.toHcl({ l: 12.65624852526134, a: 0.12256520883417721, b: -16.833209795877284 }), expected);
    });
  });

  describe('lightness modification', function(){
    it("can derive a brighter color", function(){
      var steelblue = { l: 52.46551718768575, a: -4.0774710123572255, b: -32.19186122981343 };
      assert.deepEqual(ColorSpace.brighter(steelblue), {l: 70.46551718768575, a: -4.0774710123572255, b: -32.19186122981343});
      assert.deepEqual(ColorSpace.brighter(steelblue, 0.5), {l: 61.46551718768575, a: -4.0774710123572255, b: -32.19186122981343});
    });
    it("can derive a darker color", function(){
      var lightsteelblue = { l: 78.45157936968134, a: -1.2815839134120433, b: -15.210996213841522 };
      assert.deepEqual(ColorSpace.darker(lightsteelblue), {l: 60.45157936968134, a: -1.2815839134120433, b: -15.210996213841522});
      assert.deepEqual(ColorSpace.darker(lightsteelblue, 0.5), {l: 69.45157936968134, a: -1.2815839134120433, b: -15.210996213841522});
    });
  });

});





var assert = require("../lib/d3-assert");

var requirejs, ColorSpace;

function init(asyncReturn) {
  requirejs = require("requirejs");
  requirejs.config({ baseUrl: '.', nodeRequire: require });
    requirejs(['require-config'], function(Config) {
    requirejs.config(Config);
        ColorSpace = requirejs("hsl");
        asyncReturn();
    });
}


describe('Hsl', function(){

  before(function (done){
      init(done);

  });

  describe('type check', function(){
    it("expects rgb", function(){
      var valid = {"h":165,"s":42,"l":42};
      var dummy = {"h":0,"s":0,"l":0};
      assert.deepEqual(ColorSpace.validate(valid), valid);
      assert.deepEqual(ColorSpace.validate(), dummy);
      assert.deepEqual(ColorSpace.validate(""), dummy);
      assert.deepEqual(ColorSpace.validate({}), dummy);
      assert.deepEqual(ColorSpace.validate({h: "x", a: 'b' }), dummy);
    });
  });
  describe('color space conversion', function(){
    it("can convert to RGB", function(){
      var expected, steelblue = { h: 207.27272727272728, s: 0.44, l: 0.4901960784313726 };
      expected = {r: 70, g: 130, b: 180}; // steeblue
      assert.deepEqual(ColorSpace.toRgb(steelblue), expected);
    });
  });

  describe('lightness modification', function(){
    it("can derive a brighter color", function(){
      var steelblue = { h: 207.27272727272728, s: 0.44, l: 0.4901960784313726 };
      assert.deepEqual(ColorSpace.brighter(steelblue), {"h":207.27272727272728,"s":0.44,"l":0.700280112044818});
      assert.deepEqual(ColorSpace.brighter(steelblue, 0.5), {"h":207.27272727272728,"s":0.44,"l":0.5858963771247028});
    });
    it("can derive a darker color", function(){
      var steelblue = { h: 207.27272727272728, s: 0.44, l: 0.4901960784313726 };
      assert.deepEqual(ColorSpace.darker(steelblue), {"h":207.27272727272728,"s":0.44,"l":0.3431372549019608});
      assert.deepEqual(ColorSpace.darker(steelblue, 0.5), {"h":207.27272727272728,"s":0.44,"l":0.410127463987292});
    });
  });

});
/*

    "can derive a brighter color": function(hsl) {
      assert.hslEqual(hsl("steelblue").brighter(), 207.272727, .44, .7002801);
      assert.hslEqual(hsl("steelblue").brighter(.5), 207.272727, .44, .5858964);
      assert.hslEqual(hsl("steelblue").brighter(1), 207.272727, .44, .7002801);
      assert.hslEqual(hsl("steelblue").brighter(2), 207.272727, .44, 1.0004002);
    },
    "can derive a darker color": function(hsl) {
      assert.hslEqual(hsl("lightsteelblue").darker(), 213.913043, .4107143, .5462745);
      assert.hslEqual(hsl("lightsteelblue").darker(.5), 213.913043, .4107143, .6529229);
      assert.hslEqual(hsl("lightsteelblue").darker(1), 213.913043, .4107143, .5462745);
      assert.hslEqual(hsl("lightsteelblue").darker(2), 213.913043, .4107143, .38239216);
    },

*/



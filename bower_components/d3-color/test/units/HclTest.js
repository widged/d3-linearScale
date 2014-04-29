var assert = require("../lib/d3-assert");

var requirejs, ColorSpace;

function init(asyncReturn) {
  requirejs = require("requirejs");
  requirejs.config({ baseUrl: '.', nodeRequire: require });
    requirejs(['require-config'], function(Config) {
    requirejs.config(Config);
        ColorSpace = requirejs("hcl");
        asyncReturn();
    });
}


describe('Hcl', function(){

  before(function (done){
      init(done);

  });

  describe('type check', function(){
    it("expects hcl", function(){
      var valid = {"h":165,"c":42,"l":42};
      var dummy = {"h":0,"c":0,"l":0};
      assert.deepEqual(ColorSpace.validate(valid), valid);
      assert.deepEqual(ColorSpace.validate(), dummy);
      assert.deepEqual(ColorSpace.validate(""), dummy);
      assert.deepEqual(ColorSpace.validate({}), dummy);
      assert.deepEqual(ColorSpace.validate({h: "x", a: 'b' }), dummy);
    });
  });
  describe('color space conversion', function(){
    it("can convert to LAB", function(){
      var expected, steelblue = { h: 207.27272727272728, c: 0.44, l: 0.4901960784313726 };
      expected = {"l":0.4901960784313726,"a":-0.39108759740816634,"b":-0.20161966956006053};
      assert.deepEqual(ColorSpace.toLab(steelblue), expected);
    });
  });

  describe('lightness modification', function(){
    it("can derive a brighter color", function(){
      var steelblue = { h: 207.27272727272728, c: 0.44, l: 0.4901960784313726 };
      assert.deepEqual(ColorSpace.brighter(steelblue), {"h":207.27272727272728,"c":0.44,"l":18.490196078431374});
      assert.deepEqual(ColorSpace.brighter(steelblue, 0.5), {"h":207.27272727272728,"c":0.44,"l":9.490196078431373});
    });
    it("can derive a darker color", function(){
      var steelblue = { h: 207.27272727272728, c: 0.44, l: 0.4901960784313726 };
      assert.deepEqual(ColorSpace.darker(steelblue), {"h":207.27272727272728,"c":0.44,"l":0});
      assert.deepEqual(ColorSpace.darker(steelblue, 0.5), {"h":207.27272727272728,"c":0.44,"l":0});
    });
  });

});

/*
    "can derive a brighter color": function(hcl) {
      assert.hclEqual(hcl("steelblue").brighter(), -97.21873224090723, 32.44906314974561, 70.46551718768575);
      assert.hclEqual(hcl("steelblue").brighter(.5), -97.21873224090723, 32.44906314974561, 61.46551718768575);
    },
    "can derive a darker color": function(hcl) {
      assert.hclEqual(hcl("lightsteelblue").darker(), -94.8160116310511, 15.26488988314746, 60.45157936968134);
      assert.hclEqual(hcl("lightsteelblue").darker(.5), -94.8160116310511, 15.26488988314746, 69.45157936968134);
    },


*/
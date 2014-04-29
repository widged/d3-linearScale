var assert = require("../lib/d3-assert");

var requirejs, ColorSpace;

function init(asyncReturn) {
  requirejs = require("requirejs");
  requirejs.config({ baseUrl: '.', nodeRequire: require });
    requirejs(['require-config'], function(Config) {
    requirejs.config(Config);
        Color = requirejs("color");
        asyncReturn();
    });
}


describe('Color', function(){

  before(function (done){
      init(done);

  });

  describe('one', function(){
    it("single assert", function(){
    });
  });

  describe('constructor', function(){
    it("defaults to black in rgb space", function(){
      var color = new Color();
      assert.deepEqual(color.rgb(), {"r":0,"g":0,"b":0});
    });
  });


  describe('colorspace conversions', function(){
    it("each colorspace converts to itself", function(){
      var red = {"r":255,"g":0,"b":0};
      assert.deepEqual(Color.convert(red, Color.space.RGB, Color.space.RGB), red );
    });
    it("rgb converts to any other space", function(){
      var expected, red = {"r":255,"g":0,"b":0};
      expected = { l: 53.24079414130722, a: 80.09245959641109, b: 67.20319651585301 };
      assert.deepEqual(Color.convert(red, Color.space.RGB, Color.space.LAB), expected );
      expected = {"h":39.99901061253294,"c":104.55176567686985,"l":53.24079414130722};
      assert.deepEqual(Color.convert(red, Color.space.RGB, Color.space.HCL), expected );
      expected = {"h":-89.58282792342067, "c": 16.833655998102003, "l": 12.65624852526134};
      assert.deepEqual(Color.convert({r: 12, g: 34, b: 56}, Color.space.RGB, Color.space.HCL), expected );
      assert.deepEqual(Color.convert(red, Color.space.RGB, Color.space.HSL), {"h":0,"s":1,"l":0.5} );
      assert.deepEqual(Color.convert({r: 12, g: 34, b: 56}, Color.space.RGB, Color.space.HSL), {"h":210,"s":0.6470588235294118,"l":0.13333333333333333} );
    });
    it("lab converts to any other space", function(){
      var expected,  steelblue = { l: 52.46551718768575, a: -4.0774710123572255, b: -32.19186122981343 };
      expected = {"r":70,"g":130,"b":180};
      assert.deepEqual(Color.convert(steelblue, Color.space.LAB, Color.space.RGB), expected );
      expected =  {"h":-97.21873224090723,"c":32.44906314974561,"l":52.46551718768575};
      assert.deepEqual(Color.convert(steelblue, Color.space.LAB, Color.space.HCL), expected );
      expected = {"h":207.27272727272728,"s":0.44,"l":0.4901960784313726};
      assert.deepEqual(Color.convert(steelblue, Color.space.LAB, Color.space.HSL), expected );
    });
    it("hcl converts to any other space", function(){
      var expected,  steelblue = { h: 207.27272727272728, c: 0.44, l: 0.4901960784313726 };
      expected = {"r":70,"g":130,"b":180};
      // assert.deepEqual(Color.convert(steelblue, Color.space.HCL, Color.space.RGB), expected );
      expected =  {"h":180,"s":0.3333333333333333,"l":0.0058823529411764705};
      assert.deepEqual(Color.convert(steelblue, Color.space.HCL, Color.space.HSL), expected );
      expected = {"l":0.4901960784313726,"a":-0.39108759740816634,"b":-0.20161966956006053};
      assert.deepEqual(Color.convert(steelblue, Color.space.HCL, Color.space.LAB), expected );
    });
    it("hsl converts to any other space", function(){
      var expected,  steelblue = { h: 207.27272727272728, s: 0.44, l: 0.4901960784313726 };
      expected = {"r":70,"g":130,"b":180};
      assert.deepEqual(Color.convert(steelblue, Color.space.HSL, Color.space.RGB), expected );
      expected =  {"h":207.27272727272728,"s":0.44,"l":0.4901960784313726};
      assert.deepEqual(Color.convert(steelblue, Color.space.HSL, Color.space.HSL), expected );
      expected = {"h":207.27272727272728,"s":0.44,"l":0.4901960784313726};
      assert.deepEqual(Color.convert(steelblue, Color.space.HSL, Color.space.LAB), expected );
      // assert.deepEqual(Color.parse("hsl(60, 100%, 20%)"), {r: 102, g: 102, b: 0} );
    });
  });




  describe('a colorspace call with 3 parameters', function(){
    it("rgb floors channel values", function(){
      var rgb = (new Color()).rgb(1.2, 2.6, 42.9).rgb();
      assert.deepEqual(rgb, {r: 1, g: 2, b: 42} );
    });
    it("does not clamp channel values", function(){
      assert.deepEqual((new Color()).rgb(-10, -20, -30).rgb(), {r: -10, g: -20, b: -30} );
      assert.deepEqual((new Color()).rgb(300, 400, 500).rgb(), {r: 300, g: 400, b: 500} );
      assert.deepEqual((new Color()).hsl(-100, -1, -2).hsl(), {h: -100, s: -1, l: -2} );
      assert.deepEqual((new Color()).hsl(400, 2, 3).hsl(), {h: 400, s: 2, l: 3} );
    });
    it("converts string channel values to numbers", function(){
      assert.deepEqual((new Color()).rgb("12", "34", "56").rgb(), {r: 12, g: 34, b: 56} );
      assert.deepEqual((new Color()).hcl("50", "-4", "32").hcl(), {h: 50, c: -4, l: 32} );
      assert.deepEqual((new Color()).hsl("180", ".5", ".6").hsl(), {h: 180, s: .5, l: .6} );
      assert.deepEqual((new Color()).lab("50", "-4", "32").lab(), {l: 50, a: -4, b: 32} );
    });
    it("converts null channel values to zero", function(){
      assert.deepEqual((new Color()).rgb(null, null, null).rgb(), {r: 0, g: 0, b: 0} );
      assert.deepEqual((new Color()).hcl(null, null, null).hcl(), {h: 0, c: 0, l: 0} );
      assert.deepEqual((new Color()).hsl(null, null, null).hsl(), {h: 0, s: 0, l: 0} );
      assert.deepEqual((new Color()).lab(null, null, null).lab(), {l: 0, a: 0, b: 0} );
    });
  });


  describe('a colorspace call with 1 parameter', function(){
    it("converts a known color object to the new colorspace", function(){
      assert.deepEqual((new Color()).rgb({r: 171, g: 205, b: 239}).rgb(), {r: 171, g: 205, b: 239} );
      assert.deepEqual((new Color()).rgb({h: 171, s: 1.0, l: 0.5}).rgb(), {"r":0,"g":255,"b":217}  );
    });
    it("resolves a string input with a parse call", function(){
      assert.deepEqual((new Color()).rgb("mocassin").rgb(), Color.parse("mocassin", Color.space.RGB) );
      assert.deepEqual((new Color()).rgb("#abc").rgb(), Color.parse("#abc", Color.space.RGB) );
      assert.deepEqual((new Color()).rgb("rgb(12, 34, 56)").rgb(), Color.parse("rgb(12, 34, 56)", Color.space.RGB) );
      assert.deepEqual((new Color()).rgb("hsl(60, 100%, 20%)").rgb(), Color.parse("hsl(60, 100%, 20%)", Color.space.RGB) );
      assert.deepEqual((new Color()).rgb("invalid").rgb(), Color.parse("invalid", Color.space.RGB) );
      assert.deepEqual((new Color()).hcl("mocassin").hcl(), Color.parse("mocassin", Color.space.HCL) );
      assert.deepEqual((new Color()).hcl("#abc").hcl(), Color.parse("#abc", Color.space.HCL) );
      assert.deepEqual((new Color()).hcl("rgb(12, 34, 56)").hcl(), Color.parse("rgb(12, 34, 56)", Color.space.HCL) );
      assert.deepEqual((new Color()).hcl("hsl(60, 100%, 20%)").hcl(), Color.parse("hsl(60, 100%, 20%)", Color.space.HCL) );
      assert.deepEqual((new Color()).hcl("invalid").hcl(), Color.parse("invalid", Color.space.HCL) );
      assert.deepEqual((new Color()).lab("mocassin").lab(), Color.parse("mocassin", Color.space.LAB) );
      assert.deepEqual((new Color()).lab("#abc").lab(), Color.parse("#abc", Color.space.LAB) );
      assert.deepEqual((new Color()).lab("rgb(12, 34, 56)").lab(), Color.parse("rgb(12, 34, 56)", Color.space.LAB) );
      assert.deepEqual((new Color()).lab("hsl(60, 100%, 20%)").lab(), Color.parse("hsl(60, 100%, 20%)", Color.space.LAB) );
      assert.deepEqual((new Color()).lab("invalid").lab(), Color.parse("invalid", Color.space.LAB) );
      // assert.deepEqual((new Color()).hsl("mocassin").hsl(), Color.parse("mocassin", Color.space.HSL) );
      // assert.deepEqual((new Color()).hsl("#abc").hsl(), Color.parse("#abc", Color.space.HSL) );
      // assert.deepEqual((new Color()).hsl("rgb(12, 34, 56)").hsl(), Color.parse("rgb(12, 34, 56)", Color.space.HSL) );
      // assert.deepEqual((new Color()).hsl("hsl(60, 100%, 20%)").hsl(), Color.parse("hsl(60, 100%, 20%)", Color.space.HSL) );
      // assert.deepEqual((new Color()).hsl("invalid").hsl(), Color.parse("invalid", Color.space.HSL) );
    });
  });


  describe('parse valid color object', function(){
    it("any valid color object gets returned unchanged", function(){
      assert.deepEqual(Color.parse({r: 171, g: 205, b: 239}), {r: 171, g: 205, b: 239} );
      assert.deepEqual(Color.parse({h: 171, s: 205, l: 239}), {h: 171, s: 205, l: 239} );
    });
  });

  describe('parse with 1 parameter', function(){
    it("parses hexadecimal shorthand format (e.g., \"#abc\")", function(){
      assert.deepEqual(Color.parse("#abc"), {r: 170, g: 187, b: 204} );
    });
    it("parses hexadecimal format (e.g., \"#abcdef\")", function(){
      assert.deepEqual(Color.parse("#abcdef"), {r: 171, g: 205, b: 239} );
    });
    it("parses color names (e.g., \"moccasin\")", function(){
      assert.deepEqual(Color.parse("moccasin"), {r: 255, g: 228, b: 181} );
      assert.deepEqual(Color.parse("aliceblue"), {r: 240, g: 248, b: 255} );
      assert.deepEqual(Color.parse("yellow"), {r: 255, g: 255, b: 0} );
    });
    it("parses RGB format (e.g., \"rgb(12, 34, 56)\")", function(){
      assert.deepEqual(Color.parse("rgb(12, 34, 56)"), {r: 12, g: 34, b: 56} );
    });
    it("parses HSL format (e.g., \"hsl(60, 100%, 20%)\")", function(){
      assert.deepEqual(Color.parse("hsl(60, 100%, 20%)"), {"h":60,"s":1,"l":0.2} );
    });

    it("converts invalid string input to black", function(){
      assert.deepEqual(Color.parse("invalid"), {r: 0, g: 0, b: 0} );
      assert.deepEqual(Color.parse(), {r: 0, g: 0, b: 0} );
      assert.deepEqual(Color.parse({a: 1, b: 2, c: 3}), {r: 0, g: 0, b: 0} );
    });
  });

  describe('return values', function(){
    it("rgb() returns an object with color properties", function(){
      assert.deepEqual(Color.parse("#abc"), {r: 170, g: 187, b: 204});
      assert.deepEqual(Color.parse("hcl(50, -4, 32)"), {h: 50, c: -4, l: 32});
      assert.deepEqual(Color.parse("hsl(180, 50%, 60%)"), {h: 180, s: 0.5, l: 0.6});
      assert.deepEqual(Color.parse("lab(50, -4, 32)"), {l: 50, a: -4, b: 32});
    });

    it("string coercion returns hexadecimal format", function() {
      assert.equal((new Color()).any("#abcdef").hex(), "#abcdef");
      assert.equal((new Color()).any("#abcdef").hex(), "#abcdef");
      assert.equal((new Color()).any("moccasin").hex(), "#ffe4b5");
      assert.equal((new Color()).any("hsl(60, 100%, 20%)").hex(), "#666600");
      assert.equal((new Color()).any("rgb(12, 34, 56)").hex(), "#0c2238");
    });
  });

  describe('lightness changes', function(){
    it("can derive a brighter color", function(){
      var hsl = (new Color()).any("steelblue", Color.space.HSL);
      assert.deepEqual(hsl.brighter(0.5), {"h":207.27272727272728,"s":0.44,"l":0.5858963771247028});
    });
    it("can derive a darker color", function(){
      var hsl = (new Color()).any("steelblue", Color.space.HSL);
      assert.deepEqual(hsl.darker(), {"h":207.27272727272728,"s":0.44,"l":0.3431372549019608});
    });
  });

});


/*
roundtrips
    "roundtrip to HSL is idempotent": function(lab) {
      assert.deepEqual(_.hsl(lab("steelblue")), _.hsl("steelblue"));
    },
    "roundtrip to RGB is idempotent": function(lab) {
      assert.deepEqual(_.rgb(lab("steelblue")), _.rgb("steelblue"));
    },
    "roundtrip to HCL is idempotent": function(lab) {
      assert.deepEqual(_.hcl(lab("steelblue")), _.hcl("steelblue"));
    }
*/
/*

rgb
    "changing r, g or b affects the string format": function(rgb) {
      var color = rgb("#abc");
      color.r++;
      color.g++;
      color.b++;
      assert.equal(color + "", "#abbccd");
    },

hcl

    "changing h, c or l affects the string format": function(hcl) {
      var color = hcl(50, -4, 32);
      assert.equal(color + "", "#444d50");
      color.h++;
      assert.equal(color + "", "#444d50");
      color.c++;
      assert.equal(color + "", "#464c4f");
      color.l++;
      assert.equal(color + "", "#494f51");
    },

lab

    "changing l, a or b affects the string format": function(lab) {
      var color = lab(50, -4, -32);
      assert.equal(color + "", "#3f7cad");
      color.l++;
      assert.equal(color + "", "#427eb0");
      color.a++;
      assert.equal(color + "", "#467eb0");
      color.b++;
      assert.equal(color + "", "#487eae");
    },

hsl
    "changing h, s or l affects the string format": function(hsl) {
      var color = hsl("hsl(180, 50%, 60%)");
      color.h++;
      color.s += .1;
      color.l += .1;
      assert.equal(color + "", "#85dfe0");
    },

hsl
    "h is preserved when explicitly specified, even for grayscale colors": function(hsl) {
      assert.hslEqual(hsl(0, 0, 0), 0, 0, 0);
      assert.hslEqual(hsl(42, 0, .5), 42, 0, .5);
      assert.hslEqual(hsl(118, 0, 1), 118, 0, 1);
    },
    "h is undefined when not explicitly specified for grayscale colors": function(hsl) {
      assert.hslEqual(hsl("#000"), NaN, NaN, 0);
      assert.hslEqual(hsl("black"), NaN, NaN, 0);
      assert.hslEqual(hsl(_.rgb("black")), NaN, NaN, 0);
      assert.hslEqual(hsl("#ccc"), NaN, 0, .8);
      assert.hslEqual(hsl("gray"), NaN, 0, .5);
      assert.hslEqual(hsl(_.rgb("gray")), NaN, 0, .5);
      assert.hslEqual(hsl("#fff"), NaN, NaN, 1);
      assert.hslEqual(hsl("white"), NaN, NaN, 1);
      assert.hslEqual(hsl(_.rgb("white")), NaN, NaN, 1);
    },
    "s is preserved when explicitly specified, even for white or black": function(hsl) {
      assert.hslEqual(hsl(0, 0, 0), 0, 0, 0);
      assert.hslEqual(hsl(0, .18, 0), 0, .18, 0);
      assert.hslEqual(hsl(0, .42, 1), 0, .42, 1);
      assert.hslEqual(hsl(0, 1, 1), 0, 1, 1);
    },
    "s is zero for grayscale colors (but not white and black)": function(hsl) {
      assert.hslEqual(hsl("#ccc"), NaN, 0, .8);
      assert.hslEqual(hsl("#777"), NaN, 0, .47);
    },
    "s is undefined when not explicitly specified for white or black": function(hsl) {
      assert.hslEqual(hsl("#000"), NaN, NaN, 0);
      assert.hslEqual(hsl("black"), NaN, NaN, 0);
      assert.hslEqual(hsl(_.rgb("black")), NaN, NaN, 0);
      assert.hslEqual(hsl("#fff"), NaN, NaN, 1);
      assert.hslEqual(hsl("white"), NaN, NaN, 1);
      assert.hslEqual(hsl(_.rgb("white")), NaN, NaN, 1);
    },
    "can convert grayscale colors (with undefined hue) to RGB": function(hsl) {
      assert.strictEqual(hsl(NaN, 0, .2) + "", "#333333");
      assert.strictEqual(hsl(NaN, 0, .6) + "", "#999999");
    },
    "can convert white and black (with undefined hue and saturation) to RGB": function(hsl) {
      assert.strictEqual(hsl(NaN, NaN, 0) + "", "#000000");
      assert.strictEqual(hsl(NaN, NaN, 1) + "", "#ffffff");
    }
  }

hcl
    "h is defined for non-black grayscale colors (because of the color profile)": function(hcl) {
      assert.inDelta(hcl("#ccc").h, 158.1986, 1e-3);
      assert.inDelta(hcl("gray").h, 158.1986, 1e-3);
      assert.inDelta(hcl(_.rgb("gray")).h, 158.1986, 1e-3);
      assert.inDelta(hcl("#fff").h, 158.1986, 1e-3);
      assert.inDelta(hcl("white").h, 158.1986, 1e-3);
      assert.inDelta(hcl(_.rgb("white")).h, 158.1986, 1e-3);
    },
    "h is preserved when explicitly specified, even for black": function(hcl) {
      assert.strictEqual(hcl(0, 0, 0).h, 0);
      assert.strictEqual(hcl(42, 0, 0).h, 42);
      assert.strictEqual(hcl(118, 0, 0).h, 118);
    },
    "h is undefined when not explicitly specified for black": function(hcl) {
      assert.isNaN(hcl("#000").h);
      assert.isNaN(hcl("black").h);
      assert.isNaN(hcl(_.rgb("black")).h);
    },
    "c is preserved when explicitly specified, even for black": function(hcl) {
      assert.strictEqual(hcl(0, 0, 0).c, 0);
      assert.strictEqual(hcl(0, .42, 0).c, .42);
      assert.strictEqual(hcl(0, 1, 0).c, 1);
    },
    "c is undefined when not explicitly specified for black": function(hcl) {
      assert.isNaN(hcl("#000").c);
      assert.isNaN(hcl("black").c);
      assert.isNaN(hcl(_.rgb("black")).c);
    },
    "can convert black (with undefined hue and chroma) to RGB": function(hcl) {
      assert.strictEqual(hcl(NaN, NaN, 0) + "", "#000000");
    }
  }  
*/
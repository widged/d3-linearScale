define(function (require, exports, module) {

  var FN = {};
  var Color = require('color');

  var Class = function Rgb() { };

  Class.validate = function(rgb) {
    var space = Color.getSpace(rgb);
    return (space === Color.space.RGB) ? true : false;
  };

  Class.force = function(rgb) {
    return (Class.validate(rgb)) ? rgb : {r: 0, g: 0, b: 0};
  };

  Class.parse = function(r, g, b) {
    return Color.parse(arguments, Color.space.RGB);
  };


  Class.brighter = function(rgb, k) {
    if(k === undefined) { k = 1; }
    k = Math.pow(0.7, k);
    var r = rgb.r,
        g = rgb.g,
        b = rgb.b,
        i = 30;
    if (!r && !g && !b) return { r: i, g: i, b: i};
    if (r && r < i) r = i;
    if (g && g < i) g = i;
    if (b && b < i) b = i;
    return { r: Math.min(255, ~~(r / k)), g: Math.min(255, ~~(g / k)), b: Math.min(255, ~~(b / k)) };
  };

  Class.darker = function(rgb, k) {
    if(k === undefined) { k = 1; }
    k = Math.pow(0.7, k);
    return { r: ~~(k * rgb.r), g: ~~(k * rgb.g), b: ~~(k * rgb.b) };
  };

  Class.interpolate = function(a, b) {
    if(!Class.validate(a)) { a = Color.parse(a, Color.space.RGB); }
    if(!Class.validate(b)) { b = Color.parse(b, Color.space.RGB); }
    var ar = a.r,
        ag = a.g,
        ab = a.b,
        br = b.r - ar,
        bg = b.g - ag,
        bb = b.b - ab;
    return function(t) {
      return "#" +
        channelHex(Math.round(ar + br * t)) +
        channelHex(Math.round(ag + bg * t)) +
        channelHex(Math.round(ab + bb * t));
    };
  };


  Class.toHsl = function(rgb) {
    if(!rgb) { return; }
    var r = rgb.r, g = rgb.g, b = rgb.b,
        min = Math.min(r /= 255, g /= 255, b /= 255),
        max = Math.max(r, g, b),
        d = max - min,
        h,
        s,
        l = (max + min) / 2;
    if (d) {
      s = l < 0.5 ? d / (max + min) : d / (2 - max - min);
      if (r == max) h = (g - b) / d + (g < b ? 6 : 0);
      else if (g == max) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
    } else {
      h = NaN;
      s = l > 0 && l < 1 ? 0 : h;
    }
    return {h: h, s: s, l: l};
  };
 

  Class.toHcl = function(rgb) {
    if(!rgb) { return; }
    var Lab = require('color.lab');
    return Lab.toHcl(Class.toLab(rgb));
  };


  Class.toLab = function(rgb) {
    if(!rgb) { return; }
    var Xyz = require("color.xyz");
    var xyz = Xyz.fromRgb(rgb);
    var lab = Xyz.toLab(xyz);
    return lab;
  };

  Class.toHex = function(rgb) {
    return "#" + channelHex(rgb.r) + channelHex(rgb.g) + channelHex(rgb.b);
  };


  Class.hex2number = function(value) {
    return {r: value >> 16, g: value >> 8 & 0xff, b: value & 0xff};
  };


  function channelHex(v) {
    return v < 0x10 ? "0" + Math.max(0, v).toString(16) : Math.min(255, v).toString(16);
  }

  function channelString(value) {
    return Class.fromHex(value) + "";
  }



  return Class;

});



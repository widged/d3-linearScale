define(function (require, exports, module) {

  var FN = {};
  var Color = require('color');
  var Class = function Hsl() { };

  var Lmodifier = function(k) {
    return Math.pow(0.7, k);
  };

  Class.validate = function(hsl) {
    var space = Color.getSpace(hsl);
    return (space === Color.space.HSL) ? true : false;
  };

  Class.force = function(hsl) {
    return (Class.validate(hsl)) ? hsl : {h: 0, s: 0, l: 0};
  };

  Class.parse = function(h, s, l) {
    var args = Array.prototype.slice.call(arguments);
    return Color.parse(arguments, Color.space.HSL);
  };

  Class.brighter = function(hsl, k) {
    if(k === undefined) { k = 1;}
    return { h: hsl.h, s: hsl.s, l: hsl.l / Lmodifier(k) };
  };

  Class.darker = function(hsl, k) {
    if(k === undefined) { k = 1;}
    return { h: hsl.h, s: hsl.s, l: hsl.l * Lmodifier(k) };
  };

  Class.interpolate = function(a, b) {
    if(!Class.validate(a)) { a = Color.parse(a, Color.space.HSL); }
    if(!Class.validate(b)) { b = Color.parse(b, Color.space.HSL); }
    var ah = a.h,
        as = a.s,
        al = a.l,
        bh = b.h - ah,
        bs = b.s - as,
        bl = b.l - al;
    if (isNaN(bs)) {bs = 0; as = isNaN(as) ? b.s : as;}
    if (isNaN(bh)) {bh = 0; ah = isNaN(ah) ? b.h : ah;}
    else if (bh > 180) bh -= 360; else if (bh < -180) bh += 360; // shortest path
    return function(t) {
      var rgb = Class.toRgb({h: ah + bh * t, s: as + bs * t, l: al + bl * t});
      return Color.toHex(rgb);
    };
  };

  Class.toRgb = function(hsl) {
    var h = hsl.h, s = hsl.s, l = hsl.l;
    var m1,
        m2;

    /* Some simple corrections for h, s and l. */
    h = isNaN(h) ? 0 : (h %= 360) < 0 ? h + 360 : h;
    s = isNaN(s) ? 0 : s < 0 ? 0 : s > 1 ? 1 : s;
    l = l < 0 ? 0 : l > 1 ? 1 : l;

    /* From FvD 13.37, CSS Color Module Level 3 */
    m2 = l <= 0.5 ? l * (1 + s) : l + s - l * s;
    m1 = 2 * l - m2;

    function vv(h) { return vivi(h, m1, m2); }

    return {r: vv(h + 120), g: vv(h), b: vv(h - 120) };
  };

  function vivi(h, m1, m2) {
      var v = m1;
      if (h > 360) h -= 360;
      else if (h < 0) h += 360;
      if (h < 60) {
        v = m1 + (m2 - m1) * h / 60;
      } else if (h < 180) {
        v = m2;
      } else if (h < 240) {
        v = m1 + (m2 - m1) * (240 - h) / 60;
      }

    return Math.round(v * 255);
  }

  Class.toLab = function(hsl) {
    var Rgb = require('color.rgb');
    return Rgb.toHsl(Class.toRgb(hsl));
  };

  Class.toHcl = function(hsl) {
    return;
  };



  return Class;

});


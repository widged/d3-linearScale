define(function (require, exports, module) {

  var FN = {};
  var Class = function Lab() { };

  // Corresponds roughly to RGB brighter/darker
  var Kmodifier = function(k) {
    return 18 * k;
  };

  Class.Kmodifier = Kmodifier;

  Class.validate = function(lab) {
    var space = Color.getSpace(lab);
    return (space === Color.space.LAB) ? true : false;
  };

  Class.force = function(lab) {
    return (Class.validate(lab)) ? lab : {l: 0, a: 0, b: 0};
  };

  Class.parse = function(l, a, b) {
    return Color.parse([l, a, b], Color.space.LAB);
  };

  Class.brighter = function(lab, k) {
    if(k === undefined) { k = 1;}
    return {l: Math.min(100, lab.l + Kmodifier(k)), a: lab.a, b: lab.b };
  };

  Class.darker = function(lab, k) {
    if(k === undefined) { k = 1;}
    return {l: Math.max(0, lab.l - Kmodifier(k)), a: lab.a, b: lab.b};
  };

  Class.interpolate = function(a, b) {
    if(!Class.validate(a)) { a = Class.parse(a); }
    if(!Class.validate(b)) { b = Class.parse(b); }
    var al = a.l,
        aa = a.a,
        ab = a.b,
        bl = b.l - al,
        ba = b.a - aa,
        bb = b.b - ab;
    return function(t) {
      var rgb = Class.toRgb(al + bl * t, aa + ba * t, ab + bb * t);
      return Color.toHex(rgb);
    };

  };


  Class.toRgb = function(lab) {
    if(!lab) { return; }
    var Xyz = require("color.xyz");
    var xyz = Xyz.fromLab(lab);
    return Xyz.toRgb(xyz);
  };

  Class.toHsl = function(lab) {
    if(!lab) { return; }
    var Rgb = require("color.rgb");
    return Rgb.toHsl(Class.toRgb(lab));
  };

  Class.toHcl = function(lab) {
    if(!lab) { return; }
    var l = lab.l, a = lab.a, b = lab.b;
    var degrees = 180 / Math.PI;
    return l > 0 ? { h: Math.atan2(b, a) * degrees, c: Math.sqrt(a * a + b * b), l: l } : { h: NaN, c: NaN, l: l };
  };




  return Class;
});


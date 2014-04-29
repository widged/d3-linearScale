define(function (require, exports, module) {


  var FN = {};
  var Class = function Hcl() { };

  Class.validate = function(hcl) {
    var space = Color.getSpace(hcl);
    return (space === Color.space.HCL) ? true : false;
  };

  Class.force = function(hcl) {
    return (Class.validate(hcl)) ? hcl : {h: 0, c: 0, l: 0};
  };

  Class.parse = function(h, c, l) {
    return Color.parse([h, c, l], Color.space.HCL);
  };


  Class.brighter = function(hcl, k) {
    var Lab = require("color.lab");
    if(k === undefined) { k = 1;}
    return { h: hcl.h,  c: hcl.c, l: Math.min(100, hcl.l + Lab.Kmodifier(k)) };
  };

  Class.darker = function(hcl, k) {
    var Lab = require("color.lab");
  if(k === undefined) { k = 1; }
    return { h: hcl.h,  c: hcl.c, l: Math.max(0, hcl.l - Lab.Kmodifier(k)) };
  };


  Class.interpolate = function(a, b) {
    if(!Class.validate(a)) { a = Class.parse(a); }
    if(!Class.validate(b)) { b = Class.parse(b); }
    a = d3.hcl(a);
    b = d3.hcl(b);
    var ah = a.h,
        ac = a.c,
        al = a.l,
        bh = b.h - ah,
        bc = b.c - ac,
        bl = b.l - al;
    if (isNaN(bc)) { bc = 0; ac = isNaN(ac) ? b.c : ac; }
    if (isNaN(bh)) { bh = 0; ah = isNaN(ah) ? b.h : ah; }
    else if (bh > 180) bh -= 360; else if (bh < -180) bh += 360; // shortest path
    return function(t) {
      return d3_hcl_lab(ah + bh * t, ac + bc * t, al + bl * t) + "";
    };
  };

  Class.toLab = function(hcl) {
    if(!hcl) { return; }
    var h = hcl.h, c = hcl.c, l = hcl.l;
    if (isNaN(h)) h = 0;
    if (isNaN(c)) c = 0;
    var radians = Math.PI / 180;
    return { l: l, a: Math.cos(h *= radians) * c, b: Math.sin(h) * c };
  };

  Class.toRgb = function(hcl) {
    if(!hcl) { return; }
    var Lab = require('color.lab');
    return Lab.toRgb(Class.toLab(hcl));
  };


  Class.toHsl = function(hcl) {
    if(!hcl) { return; }
    var Lab = require('color.lab');
    return Lab.toHsl(Class.toLab(hcl));
  };

  return Class;

});

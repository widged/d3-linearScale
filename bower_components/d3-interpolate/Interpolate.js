define(function (require, exports, module) {

    var Color      = requirejs("color");
    var ColorNames = requirejs("color.names");

    var Class = function Interpolate() {};

    Class.any = function(a, b) {
      var type = Class.guessDataType(b);
      var fn = Class[type];
      if(!fn) { throw "An interpolator function was not found for data type `"+ type +"`."; }
      return fn(a, b);
    };

    Class.guessDataType = function(b) {
      var out = "number";
      var t = typeof b;

      if(Color.isColor(b)) {
        out = "rgb";
      } else if(t === "string") {
        out = "string";
      } else if(Array.isArray(b)) {
        out = "array";
      } else if(t === "object" && isNaN(b)) {
        out = "object";
      }
      return out;
    };


    Class.number = function(a, b) {
      b -= a = +a;
      return function(t) { return a + b * t; };
    };


    Class.round = function(a, b) {
      b -= a;
      return function(t) { return Math.round(a + b * t); };
    };

    Class.array = function(a, b) {
      var x = [],
          c = [],
          na = a.length,
          nb = b.length,
          n0 = Math.min(a.length, b.length),
          i;
      for (i = 0; i < n0; ++i) x.push(Class.any(a[i], b[i]));
      for (; i < na; ++i) c[i] = a[i];
      for (; i < nb; ++i) c[i] = b[i];
      return function(t) {
        for (i = 0; i < n0; ++i) c[i] = x[i](t);
        return c;
      };
    };

    Class.object = function(a, b) {
      var i = {},
          c = {},
          k;
      for (k in a) {
        if (k in b) {
          i[k] = Class.any(a[k], b[k]);
        } else {
          c[k] = a[k];
        }
      }
      for (k in b) {
        if (!(k in a)) {
          c[k] = b[k];
        }
      }
      return function(t) {
        for (var k in i) c[k] = i[k](t);
        return c;
      };
    };

  Class.string = function(a, b) {
    var d3_interpolate_numberA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
        d3_interpolate_numberB = new RegExp(d3_interpolate_numberA.source, "g");

    var bi = d3_interpolate_numberA.lastIndex = d3_interpolate_numberB.lastIndex = 0, // scan index for next number in b
        am, // current match in a
        bm, // current match in b
        bs, // string preceding current number in b, if any
        i = -1, // index in s
        s = [], // string constants and placeholders
        q = []; // number interpolators

    // Coerce inputs to strings.
    a = a + ""; b = b + "";

    // Interpolate pairs of numbers in a & b.
    while ((am = d3_interpolate_numberA.exec(a)) &&
          (bm = d3_interpolate_numberB.exec(b))) {
      if ((bs = bm.index) > bi) { // a string precedes the next number in b
        bs = b.substring(bi, bs);
        if (s[i]) s[i] += bs; // coalesce with previous string
        else s[++i] = bs;
      }
      if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
        if (s[i]) s[i] += bm; // coalesce with previous string
        else s[++i] = bm;
      } else { // interpolate non-matching numbers
        s[++i] = null;
        q.push({i: i, x: Class.number(am, bm)});
      }
      bi = d3_interpolate_numberB.lastIndex;
    }

    // Add remains of b.
    if (bi < b.length) {
      bs = b.substring(bi);
      if (s[i]) s[i] += bs; // coalesce with previous string
      else s[++i] = bs;
    }

    // Special optimization for only a single match.
    // Otherwise, interpolate each of the numbers and rejoin the string.
    return s.length < 2 ? (q[0] ? (b = q[0].x, function(t) { return b(t) + ""; })
        : function() { return b; })
        : (b = q.length, function(t) {
            for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
            return s.join("");
          });
  };

  Class.hcl = function(a, b) {
    var Hcl = require('color.hcl');
    return Hcl.interpolate(a, b);
  };

  Class.hsl = function(a, b) {
    var Hsl = require('color.hsl');
    return Hsl.interpolate(a, b);
  };


  Class.lab = function(a, b) {
    var Lab = require('color.lab');
    return Lab.interpolate(a, b);
  };

  Class.rgb = function(a, b) {
    var Rgb = require('color.rgb');
    return Rgb.interpolate(a, b);
  };


    return Class;

});




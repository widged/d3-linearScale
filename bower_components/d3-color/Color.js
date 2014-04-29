define(function (require, exports, module) {

	var Map = require('map');
  var ColorRgb = require('color.rgb');
  var Rgb4 = require('color.rgb');
	var ColorNames = require('color.names');

  var Class = function Color() {

    var instance = this,
        state = {color: {r: 0, g: 0, b: 0}, space: Class.space.RGB};

    function update(color, space) {
      if(color) { state.color = color; }
      state.space = Class.getSpace(color);
    }

    instance.brighter = function(k) {
      var Space = require(state.space);
      return Space.brighter(state.color, k);
    };

    instance.darker = function(k) {
      var Space = require(state.space);
      return Space.darker(state.color, k);
    };

    instance.hex = function() {
      var rgb = Class.convert(state.color, state.space, Class.space.RGB);
      return ColorRgb.toHex(rgb);
    };


    // ####################
    // colorspaces
    // ####################
    instance.parse = instance.any = function() {
      var spaceOut = arguments[1] || Class.space.RGB;
      var color = Class.parse([arguments[0]], spaceOut);
      update(color, spaceOut);
      return instance;
    };

    instance.rgb = function() {
      var spaceOut = Class.space.RGB;
      if(arguments.length === 0) { return Class.convert(state.color, state.space, spaceOut);  }
      update(Class.parse(args(arguments), spaceOut));
      return instance;
    };


    instance.hcl = function(h, c, l) {
      var spaceOut = Class.space.HCL;
      if(arguments.length === 0) {  return Class.convert(state.color, state.space, spaceOut);  }
      update(Class.parse(args(arguments), spaceOut));
      return instance;
    };


    instance.hsl = function() {
      var spaceOut = Class.space.HSL;
      if(arguments.length === 0) {  return Class.convert(state.color, state.space, spaceOut);  }
      update(Class.parse(args(arguments), spaceOut));
      return instance;
    };

    instance.lab = function(l, a, b) {
      var spaceOut = Class.space.LAB;
      if(arguments.length === 0) {  return Class.convert(state.color, state.space, spaceOut);  }
      update(Class.parse(args(arguments), spaceOut));
      return instance;
    };


    return instance;
  };

  Class.space = { RGB: "rgb", HCL: "hcl", HSL: "hsl", LAB: "lab" };

  Class.isColor = function(code) {
    var assert = false;
    if(typeof code === "string") {
      assert = (ColorNames.hasOwnProperty(code) || /^(#|rgb\(|hsl\()/.test(code));
    } else if(Class.getSpace(code)) {
      assert = true;
    }
    return assert;
  };

  Class.toHex = function(rgb) {
    var Rgb = require('color.rgb');
    return Rgb.toHex(rgb);
  };

  Class.convert = function(color, spaceIn, spaceOut) {
    var fnOut = {rgb: 'toRgb', lab: 'toLab', hcl: 'toHcl', hsl: 'toHsl'};
    if(spaceIn === spaceOut) { return color; }
    var Space = require('color.' + spaceIn);

    var fn = fnOut[spaceOut];
    return Space[fn](color);
  };

  Class.getSpace = function(code) {
    if(!code) { return; }
    var spaceId;
    Object.keys(Class.space).forEach(function(spaceKey, sid) {
      var space = Class.space[spaceKey];
      var match = true;
      space.split('').forEach(function(k, i) {
        if(!code.hasOwnProperty(k)) { match = false; }
      });
      if(match) { spaceId = space; }
    });
    return spaceId;
  };

  Class.getCode = function(code, space, fn) {
    if(!fn) { fn = function(d) { return +d; }; }
    var o = {};
    if(!space) { space = Class.space.RGB; }
    space.split('').forEach(function(k, i) {
      o[k] = fn(code[i], i);
    });
    return Class.convert(o, space, space);
  };


  Class.parse = function(code, spaceOut) {
    var color;
    if(!code) {
      // default
    } else if(typeof code !== 'string' && code.length === 3) {
      var fns = { rgb: function(d) { return Math.floor(+d); } };
      color = Class.getCode(code, spaceOut, fns[spaceOut]);
    } else {
      if(Array.isArray(code)) { code = code[0]; }
      if(typeof code === "string") {
        if(!color) {
          color = parsePrefixed(code);
          if(color) {
            var spaceIn = Class.getSpace(color) || Class.space.RGB;
            color = Class.convert(color, spaceIn, spaceOut || spaceIn);
          }
        } //
        if(!color) {
          var rgb = parseName(code); 
          if(rgb) { color = Class.convert(rgb, Class.space.RGB, spaceOut || Class.space.RGB);  };
          
        }
        if(!color) { var rgb = parseHex(code); color = Class.convert(rgb, Class.space.RGB, spaceOut || Class.space.RGB); }
      } else if(typeof code === "object") {
        var spaceIn = Class.getSpace(code) || Class.space.RGB;
        if(spaceIn) {
          if(!spaceOut) { spaceOut = spaceIn; }
          color = Class.convert(code, spaceIn, spaceOut);
        }
      }
    }
    /*
    var rgb;
    if(Class.isRgb(r)) {
      rgb = r;
    } else if(arguments.length === 1) {
      rgb = Class.parseRgb("" + r, d3_rgb, d3_hsl_rgb);
    } else {
      return {r: ~~r, g: ~~g, b: ~~b };
    }

    */

    if(!color) { color = {r: 0, g: 0, b: 0}; }
    return color;
  };

    /* Handle hsl, rgb. */
  function parsePrefixed(str) {
    var m1, // CSS color specification match
        m2, // CSS color specification type (e.g., rgb)
        color;
    m1 = /([a-z]+)\((.*)\)/i.exec(str);
    if (m1) {
      m2 = m1[2].split(",");
      var fn;
      switch (m1[1]) {
        case "hsl":
          fn = function(d, i) {
            d = parseFloat(d);
            if(i > 0) { d = d / 100; }
            return d;
          };
          color = Class.getCode(m2, Class.space.HSL, fn);
          break;
        case "hcl":
          fn = function(d, i) { return parseFloat(d); };
          color = Class.getCode(m2, Class.space.HCL, fn);
          break;
        case "lab":
          fn = function(d, i) { return parseFloat(d); };
          color = Class.getCode(m2, Class.space.LAB, fn);
          break;
        case "rgb":
          fn = function(d, i) { return channelParseNumber(d); };
          color = Class.getCode(m2, Class.space.RGB, fn);
          break;
      }
    }
    return color;
  }


    /* Named colors. */
  function parseName(str) {
    var value = ColorNames[str];
    if (value) {
      var ColorRgb = require('color.rgb');
      return ColorRgb.hex2number(value);
    }
  }


  function parseHex(str) {
    var r = 0, // red channel; int in [0, 255]
        g = 0, // green channel; int in [0, 255]
        b = 0; // blue channel; int in [0, 255]

    /* Hexadecimal colors: #rgb and #rrggbb. */
    if (str != null && str.charAt(0) === "#" && !isNaN(color = parseInt(str.substring(1), 16))) {
      if (str.length === 4) {
        r = (color & 0xf00) >> 4; r = (r >> 4) | r;
        g = (color & 0xf0); g = (g >> 4) | g;
        b = (color & 0xf); b = (b << 4) | b;
      } else if (str.length === 7) {
        r = (color & 0xff0000) >> 16;
        g = (color & 0xff00) >> 8;
        b = (color & 0xff);
      }
    }
    return {r: r, g: g, b: b};
  }

  function args(_) {
    return Array.prototype.slice.call(_);
  }



  function channelParseNumber(c) { // either integer or percentage
    var f = parseFloat(c);
    return c.charAt(c.length - 1) === "%" ? Math.round(f * 2.55) : f;
  }


  
  return Class;

});

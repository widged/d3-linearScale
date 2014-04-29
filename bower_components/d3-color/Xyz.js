define(function (require, exports, module) {

  var FN = {};
  var Class = function Xyz() { };

  // D65 standard referent
	var LAB_X = 0.950470,
		LAB_Y = 1,
		LAB_Z = 1.088830;


  Class.fromRgb = function(rgb) {
    if(!rgb) { return; }
    var xyz = {
          x : rgb2xyz(rgb.r),
          y : rgb2xyz(rgb.g),
          z : rgb2xyz(rgb.b)
        };

	return xyz;
  };

  Class.toLab = function(xyz) {
    if(!xyz) { return; }
    var x = xyz.x, y = xyz.y, z = xyz.z;

    var a = xyz2lab((0.4124564 * x + 0.3575761 * y + 0.1804375 * z) / LAB_X),
        b = xyz2lab((0.2126729 * x + 0.7151522 * y + 0.0721750 * z) / LAB_Y),
        c = xyz2lab((0.0193339 * x + 0.1191920 * y + 0.9503041 * z) / LAB_Z);

    return {l : 116 * b - 16, a: 500 * (a - b), b: 200 * (b - c) };

  };


  Class.toRgb = function(xyz) {
    if(!xyz) { return; }
    var x = xyz.x, y = xyz.y, z = xyz.z;
    return {
        r: xyz2rgb( 3.2404542 * x - 1.5371385 * y - 0.4985314 * z),
        g: xyz2rgb(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z),
        b: xyz2rgb( 0.0556434 * x - 0.2040259 * y + 1.0572252 * z)
      };
  };

  Class.fromLab = function(lab) {
    if(!lab) { return; }
    var l = lab.l, a = lab.a, b = lab.b;
    var y = (l + 16) / 116,
        x = y + a / 500,
        z = y - b / 200;
        return {
			x: lab2xyz(x) * LAB_X,
			y: lab2xyz(y) * LAB_Y,
			z: lab2xyz(z) * LAB_Z
        };
  };


  function lab2xyz(x) {
    return x > 0.206893034 ? Math.pow(x, 3) : (x - 4 / 29) / 7.787037;
  }

  function xyz2lab(x) {
    return x > 0.008856 ? Math.pow(x, 1 / 3) : (x + 4 / 29) * 7.787037;
  }

  function rgb2xyz(x) {
    return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  }

  function xyz2rgb(r) {
    return Math.round(255 * (r <= 0.00304 ? 12.92 * r : 1.055 * Math.pow(r, 1 / 2.4) - 0.055));
  }

  return Class;

});

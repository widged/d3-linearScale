define(function (require, exports, module) {

    var ascending = require("compare").ascending;

    var Class = function Bisect() {};
    Class.RIGHT = 0;
    Class.LEFT  = 1;

    Class.bisector = function(compare, direction) {
      var isLower = (direction === Class.LEFT) ?
                    function(a, x, mid) { return compare(a[mid], x) < 0; } :
                    function(a, x, mid) { return compare(a[mid], x) <= 0; };
      return function(a, x, lo, hi) {
          if (arguments.length < 3) lo = 0;
          if (arguments.length < 4) hi = a.length;
          var mid;
          while (lo < hi) {
            mid = lo + hi >>> 1;
            if (isLower(a, x, mid)) {
              lo = mid + 1;
            } else {
              hi = mid;
            }
          }
          return lo;
        };
    };

    Class.bisectLeft = Class.bisector(ascending, Class.LEFT);
    Class.bisectRight = Class.bisector(ascending, Class.RIGHT);

    // used in test only
    /*
    d3.bisector = function(f) {
      return d3_bisector(f.length === 1
          ? function(d, x) { return ascending(f(d), x); }
          : f);
    };
    */


    return Class;

});


define(function (require, exports, module) {

    var AccessMaker   = require('accessmaker');
    var Bisect        = require('bisect');
    var Interpolate   = require('interpolate');
    var Uninterpolate = require('uninterpolate');

    var FN = {};

    var Class = function LinearScale() {

        var instance = this,
            state = {domain: [0, 1], range: [0, 1], interpolate: Interpolate.any, clamp: false},
            scaleFn, invertFn;

        AccessMaker.allKeys(state, instance, [keyChange], reset);
        AccessMaker.addConfig(state, instance);

        function keyChange(key, _) {
            if(key === "domain") { return _.map(Number); }
            return _;
        }


      function reset() {
        var domain = state.domain,
            range = state.range,
            clamp = state.clamp,
            interpolate = state.interpolate;
        var linear = FN.isPoly(domain, range) ? FN.polylinear : FN.bilinear,
            uninterpolate = clamp ? Uninterpolate.clamp : Uninterpolate.number;
        scaleFn  = linear(domain, range, uninterpolate, interpolate);
        invertFn = linear(range, domain, uninterpolate, Interpolate.any);
      }

      instance.get = function(x) {
        return scaleFn(x);
      };

      // Note: requires range is coercible to number!
      instance.invert = function(y) {
        return invertFn(y);
      };

      instance.rangeRound = function(x) {
        return instance.range(x).interpolate(Interpolate.round);
      };


      instance.copy = function() {
        return (new Class()).domain(state.domain).range(state.range).interpolate(state.interpolate).clamp(state.clamp);
      };


      reset();
      return instance;
    };


    FN.isPoly = function(domain, range) {
        return Math.min(domain.length, range.length) > 2;
    };

    FN.bilinear = function(domain, range, uninterpolate, interpolate) {
      var u = uninterpolate(domain[0], domain[1]),
          i = interpolate(range[0], range[1]);
      return function(x) { return i(u(x)); };
    };

    FN.polylinear = function(domain, range, uninterpolate, interpolate) {
      var u = [],
          i = [],
          j = 0,
          k = Math.min(domain.length, range.length) - 1;

      // Handle descending domains.
      if (domain[k] < domain[0]) {
        domain = domain.slice().reverse();
        range = range.slice().reverse();
      }

      while (++j <= k) {
        u.push(uninterpolate(domain[j - 1], domain[j]));
        i.push(interpolate(range[j - 1], range[j]));
      }

      return function(x) {
        var j = Bisect.bisectRight(domain, x, 1, k) - 1;
        return i[j](u[j](x));
      };
    };


    return Class;

});


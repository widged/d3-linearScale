define(function (require, exports, module) {

    var Class = function ScaleUtil() {};

    Class.identity = function(x) { return x; };

    Class.extent = function(arr) { // d3_scaleExtent
      var fst = arr[0], lst = arr[arr.length - 1];
      return fst < lst ? [fst, lst] : [lst, fst];
    };

    Class.range = function(scale) { // d3_scaleRange
      return scale.rangeExtent ? scale.rangeExtent() : Class.extent(scale.range());
    };

    /**
        Extends the domain so that it starts and ends on nice round values. This method typically 
        modifies the scale's domain, and may only extend the bounds to the nearest round value. 
        The precision of the round value is dependent on the extent of the domain dx according to 
        the following formula: exp(round(log(dx)) - 1). Nicing is useful if the domain is computed 
        from data and may be irregular. For example, for a domain of [0.20147987687960267, 0.996679553296417], 
        the nice domain is [0.2, 1]. If the domain has more than two values, nicing the domain only affects the 
        first and last value.

    */

/*

      instance.nice = function(m) {
        var domain = Class.linearNice(state.domain, m);
        instance.domain(domain);
        return instance();
      };

    Class.linearNice = function(domain, m) {
        Scale.nice(domain, Scale.niceStep(LinearTicks.tickRange(domain, m)[2]));
        return domain;
    };

*/




    Class.nice = function(domain, nice) { // d3_scale_nice
      var i0 = 0,
          i1 = domain.length - 1,
          x0 = domain[i0],
          x1 = domain[i1],
          dx;

      if (x1 < x0) {
        dx = i0; i0 = i1;  i1 = dx;
        dx = x0;  x0 = x1;  x1 = dx;
      }

      domain[i0] = nice.floor(x0);
      domain[i1] = nice.ceil(x1);
      return domain;
    };

    var niceIdentity = {
      floor: Class.identity,
      ceil: Class.identity
    };

    Class.niceStep = function(step) { // d3_scale_niceStep
      return step ? {
        floor: function(x) { return Math.floor(x / step) * step; },
        ceil: function(x) { return Math.ceil(x / step) * step; }
      } : niceIdentity;
    };

    return Class;

});


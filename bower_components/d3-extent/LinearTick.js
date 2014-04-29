define(function (require, exports, module) {

    var AccessMaker = require('accessmaker');
    var Scale = require('scale');

    var Class = function LinearTick() {

/*
      instance.ticks = function(m) {
        return LinearTicks.mark(state.domain, m);
      };

      instance.tickFormat = function(m, format) {
        return LinearTicks.markFormat(state.domain, m, format);
      };
*/
    };



    Class.linearTicks = function(domain, m) {
      return d3.range.apply(d3, Class.linearTickRange(domain, m));
    };

    Class.linearTickRange = function(domain, m) {
      if (m === null) m = 10;

      var extent = Scale.extent(domain),
          span = extent[1] - extent[0],
          step = Math.pow(10, Math.floor(Math.log(span / m) / Math.LN10)),
          err = m / span * step;

      // Filter ticks to get closer to the desired count.
      if (err <= 0.15) step *= 10;
      else if (err <= 0.35) step *= 5;
      else if (err <= 0.75) step *= 2;

      // Round start and stop values to step interval.
      extent[0] = Math.ceil(extent[0] / step) * step;
      extent[1] = Math.floor(extent[1] / step) * step + step * 0.5; // inclusive
      extent[2] = step;
      return extent;
    };

    Class.linearTickFormat = function(domain, m, format) {
      var range = Class.linearTickRange(domain, m);
      if (format) {
        var match = d3_format_re.exec(format);
        match.shift();
        if (match[8] === "s") {
          var prefix = d3.formatPrefix(Math.max(abs(range[0]), abs(range[1])));
          if (!match[7]) match[7] = "." + linearPrecision(prefix.scale(range[2]));
          match[8] = "f";
          format = d3.format(match.join(""));
          return function(d) {
            return format(prefix.scale(d)) + prefix.symbol;
          };
        }
        if (!match[7]) match[7] = "." + Class.linearFormatPrecision(match[8], range);
        format = match.join("");
      } else {
        format = ",." + linearPrecision(range[2]) + "f";
      }
      return d3.format(format);
    };


    // Returns the number of significant digits after the decimal point.
    function linearPrecision(value) {
      return -Math.floor(Math.log(value) / Math.LN10 + 0.01);
    }

    // For some format types, the precision specifies the number of significant
    // digits; for others, it specifies the number of digits after the decimal
    // point. For significant format types, the desired precision equals one plus
    // the difference between the decimal precision of the range’s maximum absolute
    // value and the tick step’s decimal precision. For format "e", the digit before
    // the decimal point counts as one.
    function linearFormatPrecision(type, range) {
      var p = linearPrecision(range[2]);
      return ("sgpre".indexOf(type) !== -1) ? Math.abs(p - linearPrecision(Math.max(abs(range[0]), abs(range[1])))) + +(type !== "e")
          : p - (type === "%") * 2;
    }


    return Class;

});


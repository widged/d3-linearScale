/* Under development. Not tested */
define(function (require, exports, module) {

    var AccessMaker = require('accessmaker');
    var Range = require('range');
    var Util = require('scale.util');
    var Map = require('map');

    var FN = {};
    var Class = function OrdinalScale() {

        var instance = this,
            state = { domain: [], rangeType: "range", rangeArgs: [[]] };

		var index, range, rangeBand;

        AccessMaker.allKeys(state, instance, [keyChange], reset);
        AccessMaker.addConfig(state, instance);


        function keyChange(key, _) {
            if(key === "domain") { return _.map(Number); }
            return _;
        }

        function init() {
			instance.domain(state.domain);
        }

		function reset() { }

		instance.get = function(x) {
			var type = state.rangeType;
			var domain = state.domain;
			return range[((index.get(x) || (type === "range" ? index.set(x, domain.push(x)) : NaN)) - 1) % range.length];
		};

		instance.domain = function(x) {
			if (!arguments.length) return domain;
			domain = [];
			index = new Map();
			var i = -1, n = x.length, xi;
			while (++i < n) if (!index.has(xi = x[i])) index.set(xi, domain.push(xi));
			scale[ranger.t].apply(null, rangeArgs);
		};

		instance.range = function(x) {
			if (!arguments.length) return range;
			range = x;
			rangeBand = 0;
			rangeType = "range";
			rangeArgs = arguments;
		};

		instance.rangePoints = function(x, padding) {
			if (arguments.length < 2) padding = 0;
			var start = x[0],
				stop = x[1],
				step = (stop - start) / (Math.max(1, domain.length - 1) + padding);
			range = steps(domain.length < 2 ? (start + stop) / 2 : start + step * padding / 2, step);
			rangeBand = 0;
			rangeType = "rangePoints";
			rangeArgs = arguments;

			ranger = {t: "rangePoints", a: arguments};
		};

		instance.rangeBands = function(x, padding, outerPadding) {
			if (arguments.length < 2) padding = 0;
			if (arguments.length < 3) outerPadding = padding;
			var reverse = x[1] < x[0],
				start = x[reverse - 0],
				stop = x[1 - reverse],
				step = (stop - start) / (domain.length - padding + 2 * outerPadding);
			range = steps(start + step * outerPadding, step);
			if (reverse) range.reverse();
			rangeBand = step * (1 - padding);
			rangeType = "rangeBands";
			rangeArgs = arguments;
		};

		instance.rangeRoundBands = function(x, padding, outerPadding) {
			if (arguments.length < 2) padding = 0;
			if (arguments.length < 3) outerPadding = padding;
			var reverse = x[1] < x[0],
				start = x[reverse - 0],
				stop = x[1 - reverse],
				step = Math.floor((stop - start) / (domain.length - padding + 2 * outerPadding)),
				error = stop - start - (domain.length - padding) * step;
			range = steps(start + Math.round(error / 2), step);
			if (reverse) range.reverse();
			rangeBand = Math.round(step * (1 - padding));
			rangeType = "rangeRoundBands";
			rangeArgs = arguments;
		};

		instance.rangeBand = function() {
			return rangeBand;
		};

		instance.rangeExtent = function() {
			return Util.extent(ranger.a[0]);
		};

		instance.copy = function() {
			return new Class().domain(domain).ranger(ranger);
		};

		init();
		return instance;

    };

    Class.range = { RANGE: "range", POINTS: "rangePoints", BANDS: "rangeBands", ROUND_BANDS: "rangeRoundBands" };

	FN.steps = function(start, step) {
		return Range.list(domain.length).map(function(i) { return start + step * i; });
	};

	return Class;

});

/*

function d3_instance.ordinal(domain, ranger) {





  return instance.domain(domain);


*/
define(function (require, exports, module) {

    var Class = function Uninterpolate() {};

	Class.number = function(a, b) {
		a = +a;
		var diff = b - a;
		b = diff ? 1 / diff : 0;
		return function(x) { return (x - a) * b; };
	};

	Class.clamp = function(a, b) {
		b = b - (a = +a) ? 1 / (b - a) : 0;
		return function(x) { return Math.max(0, Math.min(1, (x - a) * b)); };
	};

    return Class;

});




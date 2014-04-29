define(function (require, exports, module) {

	var FN = {};
	var Class = function Map() {
		var instance = this;
		return instance;
	};

	Class.list = function(start, stop, step) {
		if (arguments.length < 3) {
			step = 1;
			if (arguments.length < 2) {
				stop = start;
				start = 0;
			}
		}
		if ((stop - start) / step === Infinity) throw new Error("infinite range");
		var range = [],
			k = FN.integerScale(Math.abs(step)),
			i = -1,
			j;
		start *= k; stop *= k; step *= k;
		if (step < 0) while ((j = start + step * ++i) > stop) range.push(j / k);
		else while ((j = start + step * ++i) < stop) range.push(j / k);
		return range;
	};

	FN.integerScale = function(x) {
		var k = 1;
		while (x * k % 1) k *= 10;
		return k;
	};

	return Class;

});

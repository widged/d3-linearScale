define(function (require, exports, module) {
    var Class = function Category() {};

    var Categories = require('colorcategories');
    var Ordinal    = require('ordinal');

	Class.category10 = function() {
		return (new Ordinal()).range(Categories.category10);
	};

	Class.category20 = function() {
		return (new Ordinal()).range(Categories.category20);
	};

	Class.category20b = function() {
		return (new Ordinal()).range(Categories.category20b);
	};

	Class.category20c = function() {
		return (new Ordinal()).range(Categories.category20c);
	};

    return Class;

});


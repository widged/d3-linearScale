define(function (require, exports, module) {

	var d3_map_prefix = "\0", // prevent collision with built-ins
		d3_map_prefixCode = d3_map_prefix.charCodeAt(0);

	var Class = function Map() {
		var instance = this;
		var hash = {};

		instance.source = function(object) {
			if (object instanceof Map) object.forEach(function(key, value) { instance.set(key, value); });
			else for (var key in object) instance.set(key, object[key]);
			return instance;
		};

		instance.has = function(key) { return Class.hasKey(hash, key); };
		instance.get = function(key) { return Class.getKey(hash, key); };
		instance.set = function(key, _) { return Class.setKey(hash, key); };
		instance.remove = function(key) { return Class.removeKey(hash, key); };
		instance.keys = function() { return Class.listKeys(hash); };
		instance.values = function() { return Class.listValues(hash); };
		instance.entries = function() { return hash; };
		instance.size = function() { return Class.size(hash); };
		instance.empty = function() { return Class.isEmpty(hash); };
		instance.forEach = function(f) { return Class.forEach(hash, f); };

		return instance;
	};


	Class.hasKey = function(hash, key) {
		return d3_map_prefix + key in hash;
	};

	Class.getKey = function(hash, key) {
		return hash[d3_map_prefix + key];
	};
	Class.setKey = function(hash, key, value) {
		hash[d3_map_prefix + key] = value;
		return value;
	};

	Class.removeKey = function(hash, key, value) {
		key = d3_map_prefix + key;
		return key in hash && delete hash[key];
	};


	Class.listKeys = function(hash) {
		var keys = [];
		hash.forEach(function(key) { keys.push(key); });
		return keys;
	};

	Class.listValues = function(hash) {
		var values = [];
		hash.forEach(function(key, value) { values.push(value); });
		return values;
	};

	Class.listEntries = function(hash) {
		return hash;
	};

	Class.size = function(hash) {
		var size = 0;
		for (var key in hash) if (key.charCodeAt(0) === d3_map_prefixCode) ++size;
		return size;
	};

	Class.isEmpty = function(hash) {
		for (var key in hash) if (key.charCodeAt(0) === d3_map_prefixCode) return false;
		return true;
	};

	Class.forEach = function(hash, fn) {
		for (var key in hash) if (key.charCodeAt(0) === d3_map_prefixCode) fn.call(hash, key.substring(1), hash[key]);
	};



  return Class;

});


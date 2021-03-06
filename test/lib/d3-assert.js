var assert = require("assert");

assert = module.exports = Object.create(assert);

assert.requirejs = function(config, asyncReturn) {
  var requirejs = require("requirejs");
  requirejs.config({ baseUrl: '.', nodeRequire: require });
    requirejs([config], function(Config) {
    requirejs.config(Config);
    asyncReturn(requirejs);
  });
  
};



assert.isArray = function(actual, message) {
  if (!Array.isArray(actual)) {
    assert.fail(actual, null, message || "expected {actual} to be an Array", null, assert.isArray);
  }
};

assert.inDelta = function(actual, expected, delta, message) {
  if (!inDelta(actual, expected, delta)) {
    assert.fail(actual, expected, message || "expected {actual} to be in within *" + delta + "* of {expected}", null, assert.inDelta);
  }
};

assert.domNull = function(actual, message) {
  if (actual != null) {
    assert.fail(actual+"", null, message || "expected null, got {actual}", "===", assert.domNull);
  }
};

assert.domEqual = function(actual, expected, message) {
  if (actual !== expected) {
    assert.fail(actual+"", expected+"", message || "expected {expected}, got {actual}", "===", assert.domEqual);
  }
};

assert.rgbEqual = function(actual, r, g, b, message) {
  var ar = Math.round(actual.r),
      ag = Math.round(actual.g),
      ab = Math.round(actual.b),
      er = Math.round(r),
      eg = Math.round(g),
      eb = Math.round(b);
  if (ar !== er || ag !== eg || ab !== eb) {
    assert.fail(
      "rgb(" + ar + "," + ag + "," + ab + ")",
      "rgb(" + er + ", " + eg + ", " + eb + ")",
      message || "expected {expected}, got {actual}", "===", assert.rgbEqual);
  }
};

assert.hslEqual = function(actual, h, s, l, message) {
  var ah = roundAt(actual.h, 2),
      as = roundAt(actual.s, 2),
      al = roundAt(actual.l, 2),
      eh = roundAt(h, 2),
      es = roundAt(s, 2),
      el = roundAt(l, 2);
  if ((!(isNaN(ah) && isNaN(eh)) && ah !== eh) || (!(isNaN(as) && isNaN(es)) && as !== es) || al !== el) {
    assert.fail(
      "hsl(" + ah + "," + as + "," + al + ")",
      "hsl(" + eh + "," + es + "," + el + ")",
      message || "expected {expected}, got {actual}", null, assert.hslEqual);
  }
};

assert.hclEqual = function(actual, h, c, l, message) {
  var ah = roundAt(actual.h, 2),
      ac = roundAt(actual.c, 2),
      al = roundAt(actual.l, 2),
      eh = roundAt(h, 2),
      ec = roundAt(c, 2),
      el = roundAt(l, 2);
  if ((!(isNaN(ah) && isNaN(eh)) && ah !== eh) || ac !== ec || al !== el) {
    assert.fail(
      "hcl(" + ah + "," + ac + "," + al + ")",
      "hcl(" + eh + "," + ec + "," + el + ")",
      message || "expected {expected}, got {actual}", null, assert.hclEqual);
  }
};

assert.labEqual = function(actual, l, a, b, message) {
  var al = roundAt(actual.l, 2),
      aa = roundAt(actual.a, 2),
      ab = roundAt(actual.b, 2),
      el = roundAt(l, 2),
      ea = roundAt(a, 2),
      eb = roundAt(b, 2);
  if (al !== el || aa !== ea || ab !== eb) {
    assert.fail(
      "lab(" + al + ", " + aa + ", " + ab + ")",
      "lab(" + el + ", " + ea + ", " + eb + ")",
      message || "expected {expected}, got {actual}", null, assert.labEqual);
  }
};

assert.pathEqual = function(actual, expected, message) {
  if (!pathEqual(actual, expected)) {
    assert.fail(formatPath(actual), formatPath(expected), message || "expected {expected}, got {actual}", null, assert.pathEqual);
  }
};

function inDelta(actual, expected, delta) {
  return (Array.isArray(expected) ? inDeltaArray : inDeltaNumber)(actual, expected, delta);
}

function inDeltaArray(actual, expected, delta) {
  var n = expected.length, i = -1;
  if (actual.length !== n) return false;
  while (++i < n) if (!inDelta(actual[i], expected[i], delta)) return false;
  return true;
}

function inDeltaNumber(actual, expected, delta) {
  return actual >= expected - delta && actual <= expected + delta;
}

function pathEqual(a, b) {
  a = parsePath(a);
  b = parsePath(b);
  var n = a.length, i = -1, x, y;
  if (n !== b.length) return false;
  while (++i < n) {
    x = a[i];
    y = b[i];
    if (typeof x === "string") {
      if (x !== y) return false;
    } else if (typeof y !== "number") {
      return false;
    } else if (Math.abs(x - y) > 1e-6) {
      return false;
    }
  }
  return true;
}

var reNumber = /[-+]?(?:\d+\.\d+|\d+\.|\.\d+|\d+)(?:[eE][-]?\d+)?/g;

function parsePath(path) {
  var parts = [];
  reNumber.lastIndex = 0;
  for (var i = 0, s0 = 0, s1, m; m = reNumber.exec(path); ++i) {
    if (m.index) {
      var part = path.substring(s0, s1 = m.index);
      if (!/^[, ]$/.test(part)) parts.push(part);
    }
    parts.push(parseFloat(m[0]));
    s0 = reNumber.lastIndex;
  }
  if (s0 < path.length) parts.push(path.substring(s0));
  return parts;
}

function formatPath(path) {
  return path.replace(reNumber, formatNumber);
}

function formatNumber(s) {
  return Math.abs((s = +s) - Math.floor(s)) < 1e-6 ? Math.floor(s) : s.toFixed(6);
}

function roundAt(x, n) {
    return n ? Math.round(x * (n = Math.pow(10, n))) / n : Math.round(x);
}
  

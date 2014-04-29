var assert = require("../lib/d3-assert");

var requirejs, Linear;

describe('Linear', function(){

  before(function (asyncReturn){
    assert.requirejs('require-config', function(_requirejs) {
      requirejs = _requirejs;
      Linear = requirejs("scale.linear");
      asyncReturn();
    });
  });

  describe('constructor', function(){
    it('creates an instance with default domain and range', function(){
      var scale = Linear();
      assert.deepEqual(scale.domain(), [0,1]);
      assert.deepEqual(scale.range(), [0,1]);
      assert.equal(scale.get(0.5), 0.5);
    });
    it('can set a new domain', function(){
      var scale = Linear().domain([0, 5]);
      assert.deepEqual(scale.domain(), [0,5]);
      assert.deepEqual(scale.range(), [0,1]);
      assert.equal(scale.get(0.5), 0.1);
    });
    it('can set a new range', function(){
      var scale = Linear().range([0, 5]);
      assert.deepEqual(scale.domain(), [0,1]);
      assert.deepEqual(scale.range(), [0,5]);
      assert.equal(scale.get(0.5), 2.5);
    });
  });


/*
*/
});


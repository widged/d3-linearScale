var assert = require("assert");

var requirejs, Util;

function init(asyncReturn) {
  requirejs = require("requirejs");
  requirejs.config({ baseUrl: '.', nodeRequire: require });
    requirejs(['require-config'], function(Config) {
    requirejs.config(Config);
        Util = requirejs("util");
        asyncReturn();
    });
}

describe('Util', function(){

    before(function (done){
        init(done);
    });

  describe('extent', function(){
    it('is the first and last number of an array', function(){
        var actual = Util.extent([0,1,2,4]);
        assert.deepEqual(actual, [0,4]);
    });
    it('puts the smallest number first', function(){
        var actual = Util.extent([4,2,1,0]);
        assert.deepEqual(actual, [0,4]);
    });
    it('doesn\'t care about intermediary values', function(){
        var actual = Util.extent([0,"a",{b: 1},4]);
        assert.deepEqual(actual, [0,4]);
    });

  });
});


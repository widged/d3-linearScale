var assert = require("../lib/d3-assert");

var requirejs, Interpolate;

function init(asyncReturn) {
  requirejs = require("requirejs");
  requirejs.config({ baseUrl: '.', nodeRequire: require });
    requirejs(['require-config'], function(Config) {
    requirejs.config(Config);
        Interpolate = requirejs("interpolate");
        asyncReturn();
    });
}


describe('Interpolate', function(){

  before(function (done){
      init(done);

  });

  describe('one', function(){
    it("single assert", function(){
      assert.equal(2, 2);
    });
  });



});


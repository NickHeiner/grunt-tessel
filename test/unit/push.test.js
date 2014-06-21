'use strict';

var expect = require('chai').expect,
    gruntTessel = require('../..');

describe('push', function() {

    it('should be exported as a function', function() {
        expect(gruntTessel.push).to.be.a('function');
    });

});

'use strict';

var chai = require('chai'),
    expect = chai.expect,
    gruntTessel = require('../..'),
    sinon = require('sinon'),
    path = require('path'),
    _ = require('lodash'),
    proxyquire = require('proxyquire');

chai.use(require('sinon-chai'));

describe('push', function() {

    it('should be exported as a function', function() {
        expect(gruntTessel.push).to.be.a('function');
    });

    it('should pass the right argument to spawn', function() {
        var childProcess = {
                spawn: sinon.spy(function() {

                    function makeFakeStream() {
                        return {
                            pipe: _.noop
                        };
                    }

                    return {
                        stdout: makeFakeStream(),
                        stderr: makeFakeStream(),
                        on: function(event, cb) {
                            if (event === 'close') {
                                process.nextTick(_.partial(cb, 0));
                            }
                        }
                    };
                })
            },
            push = proxyquire('../../lib/push', {
                'child_process': childProcess
            });

        return push().then(function() {
            expect(childProcess.spawn).to.have.been.calledWith(path.resolve('node_modules/tessel/bin/tessel.js'));
        });
    });

});

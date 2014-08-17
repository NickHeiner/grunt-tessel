'use strict';

var _ = require('lodash');

module.exports = function(grunt) {

    grunt.registerMultiTask('tessel-push', function() {
        var done = this.async(),
            options = this.options({
                log: grunt.log.ok,
                verboseLog: grunt.verbose.ok
            }),
            push = require('..').push;

        push(options).then(done, function(err) {
            done(util.isError(err) ? err : new Error(err));
        });
    });

    grunt.registerMultiTask('tessel-run', function() {
        var done = this.async(),
            options = this.options({
                log: grunt.log.ok,
                verboseLog: grunt.verbose.ok,
            }),
            push = require('..').push;

        push(_.merge(options, {run: true})).then(done, function(err) {
            done(util.isError(err) ? err : new Error(err));
        });
    });

};

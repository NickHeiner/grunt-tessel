'use strict';

var _ = require('lodash');

module.exports = function(grunt) {

    grunt.registerMultiTask('tessel-push', 'Runs `tessel push` to deploy to tessel. ' +
        'The code will be written into flash memory. This memory will wear out after ' +
        'many uses, so you should use `tessel-run` instead during development, and only ' +
        'run this when you want to deploy more permanently.', function() {
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

    grunt.registerMultiTask('tessel-run', 'Runs `tessel run` to deploy to tessel. ' +
        'The script will be run but not written into flash memory. ' +
        'This should be your default while developing.', function() {
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

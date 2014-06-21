'use strict';

module.exports = function(grunt) {

    grunt.registerTask('tessel-push', function() {
        var done = this.async(),
            push = require('..').push;

        push().then(done, function(err) {
            done(util.isError(err) ? err : new Error(err));
        });
    });

};

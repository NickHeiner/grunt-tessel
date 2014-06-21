'use strict';

module.exports = function(grunt) {

    grunt.registerTask(
        'blacklist-dev-deps', 
        'Automatically copies all dev dependencies into the tessel push blacklist', 
        function() {
            var blacklistDevDeps = require('..').blacklistDevDeps,
                done = this.async();

            blacklistDevDeps().then(done, function(err) {
                done(util.isError(err) ? err : new Error(err));
            });
        }
    );
    
};

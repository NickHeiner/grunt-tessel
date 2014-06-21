'use strict';

module.exports = function(grunt) {

    grunt.registerMultiTask(
        'blacklist-dev-deps', 
        'Automatically copies all dev dependencies into the tessel push blacklist', 
        function() {
            var blacklistDevDeps = require('..').blacklistDevDeps,
                options = this.options({
                    log: grunt.log.ok
                }),
                done = this.async();

            blacklistDevDeps(options).then(done, function(err) {
                done(util.isError(err) ? err : new Error(err));
            });
        }
    );
    
};

module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);
    grunt.task.loadTasks('./tasks');

    grunt.initConfig({

        jshint: {
            options: {
                node: true
            },   
            lib: {
                src: ['lib/**/*.js'],
            },
            grunt: {
                src: ['Gruntfile.js']
            }
        },

        mochaTest: {
            e2e: {
                src: ['test/e2e/**/*.js']
            }
        }
    });

    grunt.registerTask('test', 'jshint');
};

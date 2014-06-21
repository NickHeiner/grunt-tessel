module.exports = function(grunt) {

    var path = require('path');

    require('load-grunt-tasks')(grunt);
    grunt.task.loadTasks('./tasks');

    grunt.initConfig({

        directories: {
            fixtures: path.join('test', 'fixtures'),
            sandbox: path.join('test', 'sandbox')
        },

        clean: {
            sandbox: '<%= directories.sandbox %>'
        },

        mkdir: {
            sandbox: {
                options: {
                    create: ['<%= directories.sandbox %>']
                }
            }
        },

        jshint: {
            options: {
                node: true
            },   
            lib: {
                src: [path.join('lib', '**', '*.js')],
            },
            grunt: {
                src: ['Gruntfile.js']
            }
        },

        mochaTest: {
            e2e: {
                src: [path.join('test', 'e2e', '**', '*.js')]
            }
        },

        'blacklist-dev-deps': {
            'test-dev-deps': {
                options: {
                    packageJsonFilePath: path.join('<%= directories.fixtures %>', 'package-dev-deps.json'),
                    outputPackageJsonFilePath: path.join('<%= directories.sandbox %>', 'package-dev-deps.json')
                }
            },
            'test-existing-hardware-entries': {
                options: {
                    packageJsonFilePath: path.join('<%= directories.fixtures %>', 'package-existing-hardware-entries.json'),
                    outputPackageJsonFilePath: path.join('<%= directories.sandbox %>', 'package-existing-hardware-entries.json')
                }
            },
            'test-no-dev-deps': {
                options: {
                    packageJsonFilePath: path.join('<%= directories.fixtures %>', 'package-no-dev-deps.json'),
                    outputPackageJsonFilePath: path.join('<%= directories.sandbox %>', 'package-no-dev-deps.json')
                }
            }
        }
    });

    grunt.registerTask('default', 'test');
    grunt.registerTask('test', [
        'jshint',
        'clean:sandbox',
        'mkdir:sandbox',
        'blacklist-dev-deps',
        'mochaTest:e2e'
    ]);
};

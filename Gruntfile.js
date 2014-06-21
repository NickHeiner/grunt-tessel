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
                node: true,
                expr: true
            },   
            lib: {
                src: [path.join('lib', '**', '*.js')],
            },
            grunt: {
                src: ['Gruntfile.js']
            },
            test: {
                src: [path.join('test', 'e2e')],
                options: {
                    globals: {
                        describe: true,
                        it: true
                    }
                }
            }
        },

        mochaTest: {
            e2e: {
                src: [path.join('test', 'e2e', '**', '*.js')]
            },
            unit: {
                src: [path.join('test', 'unit', '**', '*.js')]
            }
        },

        'tessel-push': {
            options: {
                fileToPush: path.join('<%= directories.fixtures %>', 'blinky.js'),
                additionalArgs: ['-s']
            },
            keepalive: {
                options: {
                    keepalive: true
                }
            },
            'fire-and-forget': {
                options: {
                    keepalive: false
                }
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
            },
            default: {}
        }
    });

    grunt.registerTask('default', 'test');
    grunt.registerTask('lint', 'jshint');
    grunt.registerTask('unit', 'mochaTest:unit');

    // Actually plug the tessel in and see that it blinks.
    grunt.registerTask('manual-e2e-test', [
        'lint',
        'unit',
        'blacklist-dev-deps:default',
        'tessel-push:fire-and-forget',
        'tessel-push:keepalive'
    ]);
    
    grunt.registerTask('e2e', [
        'clean:sandbox',
        'mkdir:sandbox',
        'blacklist-dev-deps',
        'mochaTest:e2e'
    ]);

    grunt.registerTask('test', [
        'lint',
        'unit',
        'e2e' 
    ]);
};

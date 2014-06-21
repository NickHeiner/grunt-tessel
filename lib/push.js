'use strict';

var spawn = require('child_process').spawn,
    path = require('path'),
    _ = require('lodash'),
    q = require('q'),
    qResolve = q.denodeify(require('resolve')),
    qFs = require('q-io/fs');

function push(rawOpts) {
    var opts = _.merge({
            log: _.noop,
            verboseLog: _.noop,
            keepalive: true,
            packageJsonFilePath: 'package.json',
            fileToPush: null,
            additionalArgs: []
        }, rawOpts),

        getTesselBinPath = qResolve('tessel', {
            basedir: __dirname,
            packageFilter: function(packageJsonContents) {
                // resolve will give us the script in the `main` field.
                // We would like to use the `bin` field instead, so we 
                // will transform the package.json so the `bin` field
                // overwrites the `main` field.
                return _(packageJsonContents)
                    .omit('main')
                    .merge({
                        main: packageJsonContents.bin.tessel
                    })
                    .valueOf();
            }
        }).spread(function(filePath, fileExports) {
            return filePath;
        }),

        getFileToPush = opts.fileToPush ? 
            q(opts.fileToPush) : 
            qFs.read(opts.packageJsonFilePath).then(function(packageJsonContents) {
                return JSON.parse(packageJsonContents).main;
            });

    return q.all([
        getFileToPush, 
        getTesselBinPath
    ]).spread(function(fileToPush, tesselPath) {
        var deferred = q.defer(),
            spawnArgs = ['push', fileToPush, opts.keepalive ? '-l' : ''].concat(opts.additionalArgs),
            push;

        opts.log('Pushing `' + fileToPush + '`');
        opts.verboseLog('Spawning `' + [tesselPath].concat(spawnArgs).join(' ') + '`');
        push = spawn(tesselPath, spawnArgs);

        push.stdout.pipe(process.stdout);
        push.stderr.pipe(process.stderr);

        push.on('close', function(code, signal) {
            if (code !== 0) {
                deferred.reject(
                    new Error('tessel push exited with code `' + code + '` and signal `' + signal +'`')
                );
                return;
            }
            opts.log('Pushed `' + fileToPush + '`');
            deferred.resolve();
        });

        return deferred.promise;
    });
}

module.exports = push;

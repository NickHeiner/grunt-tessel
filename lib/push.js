'use strict';

var spawn = require('child_process').spawn,
    path = require('path'),
    _ = require('lodash'),
    q = require('q'),
    qResolve = q.denodeify(require('resolve')),
    qFs = require('q-io/fs');

function push(rawOpts) {
    var opts = _.merge({
            log: _.noop
        }, rawOpts),
        pkgJsonFilePath = path.join(__dirname, 'package.json'),
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
        });

    return q.all([
        qFs.read(pkgJsonFilePath), 
        getTesselBinPath
    ]).spread(function(packageJsonContents, tesselPath) {
        var packageJson = JSON.parse(packageJsonContents),
            deferred = q.defer(),
            push;

        opts.log('Pushing `' + packageJson.main);
        // TODO don't rely on tessel being installed globally - find it in node_modules
        push = spawn(tesselPath, ['push', packageJson.main, '-l']);

        push.stdout.pipe(process.stdout);
        push.stderr.pipe(process.stderr);

        push.on('close', function(code, signal) {
            if (code !== 0) {
                deferred.reject(
                    new Error('tessel push exited with code `' + code + '` and signal `' + signal +'`')
                );
                return;
            }
            opts.log('Pushed `' + packageJson.main + '`');
            deferred.resolve();
        });

        return deferred.promise;
    });
}

module.exports = push;

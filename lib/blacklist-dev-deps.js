'use strict';

var path = require('path'),
    _ = require('lodash'),
    qFs = require('q-io/fs');

function blacklistDevDeps(rawOpts) {
    var opts = _.merge({
            log: _.noop,
            jsonSpacing: 2,
            packageJsonFilePath: 'package.json',
        }, rawOpts);

    if (!opts.outputPackageJsonFilePath) {
        opts.outputPackageJsonFilePath = opts.packageJsonFilePath;
    }

    return qFs.read(opts.packageJsonFilePath).then(function(packageJsonContents) {
        var packageJson = JSON.parse(packageJsonContents),
            blacklistEntries = _.mapValues(packageJson.devDependencies, _.constant(false)),
            withBlacklist = _.merge({}, packageJson, {
                hardware: blacklistEntries
            });

        _(blacklistEntries).keys().forEach(function(blacklistEntry) {
            opts.log('Blacklisting `' + blacklistEntry + '`');
        });

        opts.log('Writing `' + opts.outputPackageJsonFilePath + '`');
        return qFs.write(opts.outputPackageJsonFilePath, JSON.stringify(withBlacklist, null, opts.jsonSpacing));
    });
}

module.exports = blacklistDevDeps;

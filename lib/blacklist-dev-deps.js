'use strict';

var path = require('path'),
    _ = require('lodash'),
    qFs = require('q-io/fs');

function blacklistDevDeps(rawOpts) {
    var opts = _.merge({
            log: _.noop,
            jsonSpacing: 2
        }, rawOpts),
        pkgJsonFilePath = path.join(__dirname, 'package.json');

    return qFs.read(pkgJsonFilePath).then(function(packageJsonContents) {
        var packageJson = JSON.parse(packageJsonContents),
            blacklistEntries = _.mapValues(packageJson.devDependencies, _.constant(false)),
            withBlacklist = _.merge({}, packageJson, {
                hardware: blacklistEntries
            });

        _(blacklistEntries).keys().forEach(function(blacklistEntry) {
            opts.log('Blacklisting `' + blacklistEntry + '`');
        });

        opts.log('Writing `' + pkgJsonFilePath + '`');
        return qFs.write(pkgJsonFilePath, JSON.stringify(withBlacklist, null, opts.jsonSpacing));
    });
}

module.exports = blacklistDevDeps;

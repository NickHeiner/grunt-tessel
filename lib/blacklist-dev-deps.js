'use strict';

var path = require('path'),
    _ = require('lodash'),
    qFs = require('q-io/fs');

function blacklistDevDeps(rawOpts) {
    var pkgJsonFilePath = path.join(__dirname, 'package.json');

    return qFs.read(pkgJsonFilePath).then(function(packageJsonContents) {
        var packageJson = JSON.parse(packageJsonContents),
            blacklistEntries = _.mapValues(packageJson.devDependencies, _.constant(false)),
            withBlacklist = _.merge({}, packageJson, {
                hardware: blacklistEntries
            });

        _(blacklistEntries).keys().forEach(function(blacklistEntry) {
            grunt.log.ok('Blacklisting `' + blacklistEntry + '`');
        });

        grunt.log.ok('Writing `' + pkgJsonFilePath + '`');
        return qFs.write(pkgJsonFilePath, JSON.stringify(withBlacklist, null, 2));
    }).then(done, function(err) {
        done(util.isError(err) ? err : new Error(err));
    });
}

module.exports = blacklistDevDeps;

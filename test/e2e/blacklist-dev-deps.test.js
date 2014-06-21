'use strict';

var grunt = require('grunt'),
    chai = require('chai'),
    expect = chai.expect,
    q = require('q'),
    _ = require('lodash'),
    qFs = require('q-io/fs');

chai.use(require('chai-fs'));

describe('blacklist dev deps', function() {

    function getBlacklistOption(optionName, target) {
        return grunt.config(['blacklist-dev-deps', target, 'options', optionName]);
    }

    var getBlacklistFileContents = _.curry(function getBlacklistFileContents(optionName, target) {
            return qFs.read(getBlacklistOption(optionName, target)).then(JSON.parse);
        }),
        getInputPackageJsonFilePath = getBlacklistFileContents('packageJsonFilePath'),
        getOutputPackageJsonFilePath = getBlacklistFileContents('outputPackageJsonFilePath');

    it('should not change package.json when there are no dev deps', function() {
        expect(getBlacklistOption('outputPackageJsonFilePath', 'test-no-dev-deps')).to.not.be.a.path();
    });

    it('should blacklist all dev deps when there are no existing blacklisted items', function() {
        return getOutputPackageJsonFilePath('test-dev-deps').then(function(newPackageJson) {
            expect(newPackageJson.hardware).to.deep.equal({
                'grunt': false,
                'grunt-cli': false,
                'grunt-contrib-jshint': false,
                'grunt-mocha-test': false,
                'load-grunt-tasks': false
            });
        });
    });

    it('should respect existing entries for the "hardware" field', function() {
        return getOutputPackageJsonFilePath('test-existing-hardware-entries').then(function(newPackageJson) {
            expect(newPackageJson.hardware).to.deep.equal({
                './test': false,
                'grunt': false,
                'grunt-cli': false,
                'grunt-contrib-jshint': false,
                'grunt-mocha-test': false,
                'load-grunt-tasks': false
            });
        });
    });
});

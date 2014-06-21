'use strict';

describe('blacklist dev deps', function() {
    it('should not change package.json when there are no dev deps');
    it('should blacklist all dev deps when there are no existing blacklisted items');
    it('should respect existing entries for the "hardware" field');
});

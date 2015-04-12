var FilterCreator = require('../lib/filter-creator').FilterCreator;
var GaussianFilterCreator = require('../lib/gaussian-filter-creator').GaussianFilterCreator;

describe('The Gaussian filter creator', function () {
    var width;
    var sigma;
    var gaussianFilterCreator;

    beforeEach(function () {
	width = 3;
	sigma = 2.0;
	gaussianFilterCreator = new GaussianFilterCreator(new FilterCreator());
    });
    
    it('should provide Guassian filters', function () {
	var expected = new Float32Array([
	    0.10186807066202164,
	    0.11543163657188416,
	    0.10186807066202164,
	    0.11543163657188416,
	    0.13080118596553802,
	    0.11543163657188416,
	    0.10186807066202164,
	    0.11543163657188416,
	    0.10186807066202164
	]);
	expect(gaussianFilterCreator.create({
	    width: width,
	    sigma: sigma
	})).toEqual(expected);
    });
});

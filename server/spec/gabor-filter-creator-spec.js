var FilterCreator = require('../lib/filter-creator').FilterCreator;
var GaborFilterCreator = require('../lib/gabor-filter-creator').GaborFilterCreator;

describe('The Gabor filter creator', function () {
    var width;
    var lambda;
    var theta;
    var sigma;
    var gamma;
    var gaborFilterCreator;

    beforeEach(function () {
	width = 5;
	lambda = 2.05 * Math.PI;
	theta = 2 * Math.PI / 4;
	sigma = 2.0;
	gamma = 1.0;
	gaborFilterCreator = new GaborFilterCreator(new FilterCreator());
    });

    it('should provide Gabor filters', function () {
	var expected = new Float32Array([
	    -0.13659857213497162,
	    -0.19874976575374603,
	    -0.2252129763364792,
	    -0.19874976575374603,
	    -0.13659857213497162,
	    0.3001013994216919,
	    0.436644971370697,
	    0.49478358030319214,
	    0.436644971370697,
	    0.3001013994216919,
	    0.6065306663513184,
	    0.8824968934059143,
	    1,
	    0.8824968934059143,
	    0.6065306663513184,
	    0.3001013994216919,
	    0.436644971370697,
	    0.49478358030319214,
	    0.436644971370697,
	    0.3001013994216919,
	    -0.13659857213497162,
	    -0.19874976575374603,
	    -0.2252129763364792,
	    -0.19874976575374603,
	    -0.13659857213497162
	]);
	expect(gaborFilterCreator.create({
	    width: width,
	    lambda: lambda,
	    theta: theta,
	    sigma: sigma,
	    gamma: gamma
	})).toEqual(expected);
    });
});

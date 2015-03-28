var Canvas = require('canvas');
var ImageCreator = require('../lib/image-creator').ImageCreator;
var ImageFilterer = require('../lib/image-filterer').ImageFilterer;

describe('The image filterer', function () {
    var imageCreator;
    var imageFilterer;

    beforeEach(function () {
	imageCreator = new ImageCreator(new Canvas());
	imageFilterer = new ImageFilterer(imageCreator);
    });

    it('should provide Guassian filters', function () {
	var width = 3;
	var sigma = 2.0;
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
	expect(imageFilterer.gaussianFilter(width, sigma)).toEqual(expected);
    });

    it('should provide Gabor filters', function () {
	var width = 5;
	var lambda = 2.05 * Math.PI;
	var theta = 2 * Math.PI / 4;
	var sigma = 2.0;
	var gamma = 1.0;
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
	expect(imageFilterer.gaborFilter(width, lambda, theta, sigma, gamma)).toEqual(expected);
    });

    describe('when provided image data', function () {
	var width;
	var height;
	var imageData;

	beforeEach(function () {
	    width = 3;
	    height = 3;
	    inputData = imageCreator.createImageData(width, height);

	    var i = 1;
	    
	    for (var y = 0; y < height; ++y) {
		for (var x = 0; x < width; ++x) {
		    var offset = (y * width + x) * 4;
		    inputData.data[offset + 0] = i;
		    inputData.data[offset + 1] = i;
		    inputData.data[offset + 2] = i;
		    inputData.data[offset + 3] = 255;
		    ++i;
		}
	    }
	});

	it('should convolve images', function () {
	    var weights = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
	    var outputData = imageFilterer.convolve(inputData, weights, 1, true);
	    var expected = new Float32Array([
		    -13, -13, -13, 255,
		    -20, -20, -20, 255,
		    -17, -17, -17, 255,
		    -18, -18, -18, 255,
		    -24, -24, -24, 255,
		    -18, -18, -18, 255,
		     13,  13,  13, 255,
		     20,  20,  20, 255,
		     17,  17,  17, 255
	    ]);
	    expect(outputData.data).toEqual(expected);
	});
    });
});

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
	    var params = {
		opaque: true,
		allowNegatives: true
	    };
	    var outputData = imageFilterer.convolve(
		inputData,
		weights,
		null,
		params);
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

	it('should not create an output image if one is provided', function () {
	    var weights = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
	    var params = {
		opaque: true,
		allowNegatives: true
	    };
	    var providedOutput = imageCreator.createImageData(
		inputData.width,
		inputData.height,
		params.allowNegatives);
	    spyOn(imageCreator, 'createImageData').andCallThrough();
	    imageFilterer.convolve(
		inputData,
		weights,
		providedOutput,
		params);
	    expect(imageCreator.createImageData).not.toHaveBeenCalled();
	});

	it('should convolve images when an output image is provided', function () {
	    var weights = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
	    var params = {
		opaque: true,
		allowNegatives: true
	    };
	    var providedOutput = imageCreator.createImageData(
		inputData.width,
		inputData.height,
		params.allowNegatives);
	    imageFilterer.convolve(
		inputData,
		weights,
		providedOutput,
		params);
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
	    expect(providedOutput.data).toEqual(expected);
	});
    });
});

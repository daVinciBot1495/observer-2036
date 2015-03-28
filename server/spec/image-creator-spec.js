var Canvas = require('canvas');
var ImageCreator = require('../lib/image-creator').ImageCreator;

describe('The image creator', function () {
    var rgba;
    var width;
    var height;
    var imageCreator;

    beforeEach(function () {
	rgba = 4;
	width = 30;
	height = 70;
	imageCreator = new ImageCreator(new Canvas());
    });

    it('should create image data objects with the provided width', function () {
	var imageData = imageCreator.createImageData(width, height);
	expect(imageData.width).toEqual(width);
    });

    it('should create image data objects with the provided height', function () {
	var imageData = imageCreator.createImageData(width, height);
	expect(imageData.height).toEqual(height);
    });    

    it('should create image data objects with the expected number of pixels', function () {
	var imageData = imageCreator.createImageData(width, height);
	expect(imageData.data.length / rgba).toEqual(width * height);
    });

    it('should not allow negative pixel values unless specified', function () {
	var imageData = imageCreator.createImageData(width, height);
	imageData.data[0] = -1;
	expect(imageData.data[0]).toEqual(0);	
    });

    it('should allow negative pixel values when specified', function () {
	var imageData = imageCreator.createImageData(width, height, true);
	imageData.data[0] = -1;
	expect(imageData.data[0]).toEqual(-1);
    });
});

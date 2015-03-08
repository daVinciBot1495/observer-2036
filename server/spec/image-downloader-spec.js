var ImageDownloader = require('../lib/image-downloader').ImageDownloader;

describe('The image downloader', function () {
    var mockCanvas;
    var mockRequest;
    var imageDownloader;

    beforeEach(function () {
	// Mock canvas
	mockCanvas = jasmine.createSpyObj('canvas', ['Image']);
	mockCanvas.Image.andReturn({});

	// Mock request
	mockRequest = jasmine.createSpyObj('request', ['get']);

	// Create an object of the class being tested
	imageDownloader = new ImageDownloader(mockCanvas, mockRequest);
    });

    describe('when there is an error downloading the image', function () {
	var errMsg = "I've made a huge mistake";
	
	beforeEach(function () {
	    mockRequest.get.andCallFake(function (url, func) {
		func(errMsg, null, null);
	    });
	});
	
	it('should reject the promise', function (done) {
	    imageDownloader.get('url').then(function (image) {
		expect('Promise').toBe('rejected');
		done();
	    }).catch(function (err) {
		expect(err).toEqual(errMsg);
		done();
	    });
	});
    });

    describe('when there is not an error downloading the image', function () {
	var img = new Buffer([1, 2, 3, 4]);
	
	beforeEach(function () {
	    mockRequest.get.andCallFake(function (url, func) {
		func(null, null, img);
	    });
	});

	it('should resolve the image data', function (done) {
	    imageDownloader.get('url').then(function (image) {
		expect(image.src.equals(img)).toEqual(true);
		done();
	    }).catch(function (err) {
		expect('Promise').toBe('resolved');
		done();
	    });
	});
    });
});

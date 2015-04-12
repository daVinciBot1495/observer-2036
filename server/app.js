var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Development Settings
if (app.get('env') === 'development') {
    // This will change in production since we'll be using the dist folder
    app.use(express.static(path.join(__dirname, '../client')));
    
    // This covers serving up the index page
    app.use(express.static(path.join(__dirname, '../client/.tmp')));
    app.use(express.static(path.join(__dirname, '../client/app')));
    
    // Error Handling
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// Production Settings
if (app.get('env') === 'production') {
    // Changes it to use the optimized version for production
    app.use(express.static(path.join(__dirname, '/dist')));

    // Production error handler: no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
}

var Canvas = require('canvas');
var request = require('request');
var ImageCreator = require('./lib/image-creator').ImageCreator;
var ImageFilterer = require('./lib/image-filterer').ImageFilterer;
var ImageDownloader = require('./lib/image-downloader').ImageDownloader;
var GaussianFilter = require('./lib/gaussian-filter').GaussianFilter;
var GaborFilter = require('./lib/gabor-filter').GaborFilter;
var GrayscaleFilter = require('./lib/grayscale-filter').GrayscaleFilter;
var CannyFilter = require('./lib/canny-filter').CannyFilter;

var FilterCreator = require('./lib/filter-creator').FilterCreator;
var GaussianFilterCreator = require('./lib/gaussian-filter-creator').GaussianFilterCreator;
var GaborFilterCreator = require('./lib/gabor-filter-creator').GaborFilterCreator;

var filterCreator = new FilterCreator();
var gaussianFilterCreator = new GaussianFilterCreator(filterCreator);
var gaborFilterCreator = new GaborFilterCreator(filterCreator);

var imageCreator = new ImageCreator(new Canvas());
var imageFilterer = new ImageFilterer(imageCreator);
var grayscaleFilter = new GrayscaleFilter(imageCreator);
var gaussianFilter = new GaussianFilter(
    gaussianFilterCreator,
    imageFilterer);
var gaborFilter = new GaborFilter(
    gaborFilterCreator,
    grayscaleFilter,
    imageFilterer);
var cannyFilter = new CannyFilter(grayscaleFilter, imageFilterer);

var filterMap = {
    grayscale: grayscaleFilter,
    gaussian: gaussianFilter,
    gabor: gaborFilter,
    canny: cannyFilter
};

var filterParamsMap = {
    gaussian: {
	width: 9,
	sigma: 2.0
    },
    gabor: {
	width: 9,
	lambda: 1.5 * Math.PI,
	theta: 2 * Math.PI / 4,
	sigma: 2.0,
	gamma: 1.0
    }
};

function sendError(res, status, message) {
    res.status(status).json({
	message: message
    });
}

/**
 * An API that applies a filter to an image. Currently, this API just downloads
 * the specified image, converts it to a data URL, and returns it.
 *
 * TODO: Pass filter params to API.
 *
 * @param req.body.url {String} The url of the image to be filtered.
 * @return {String} The data URL representation of the filtered image.
 */
app.post('/api/filter', function (req, res) {
    if (!req.body.url) {
	sendError(res, 400, 'No image URL provided');
    } else if (!req.body.filter) {
	sendError(res, 400, 'No filter provided');
    } else if (!filterMap[req.body.filter]) {
	sendError(res, 400, 'Unsupported filter provided');
    } else {
	var imageDownloader = new ImageDownloader(Canvas, request);
	imageDownloader.get(req.body.url).then(function (img) {
	    var canvas = new Canvas(img.width, img.height);
	    var context = canvas.getContext('2d');

	    context.drawImage(img, 0, 0);

	    var filter = req.body.filter;
	    var imgData = context.getImageData(0, 0, img.width, img.height);
	    
	    filterMap[filter].apply(imgData, filterParamsMap[filter], imgData);
	    context.putImageData(imgData, 0, 0);

	    res.send(canvas.toDataURL());
	}).catch(function (err) {
	    if ('ENOTFOUND' == err.code) {
		sendError(res, 404, 'The provided image was not found');
	    } else {
		sendError(res, 500, 'Error converting provided resource to image');
	    }
	});
    }
});

module.exports = app;

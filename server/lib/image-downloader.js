var Promise = require('bluebird');

/**
 * A class for downloading images.
 */
function ImageDownloader (Canvas, request) {
    return {
	/**
	 * Downloads the provided image and returns a promise to the result.
	 *
	 * @param url {String} The url of the image to be downloaded.
	 * @return {Promise} A promise to a canvas Image object.
	 */
	get: function (url) {
	    return new Promise(function (resolve, reject) {
		console.log('Downloading ' + url);
		var req = {url: url, encoding: null};
		request.get(req, function (err, res, body) {
		    if (err) {
			console.error(JSON.stringify(err, null, 2));
		    	reject(err);
		    } else {
		    	var img = new Canvas.Image();
		    	img.src = body;
			console.log('Image size: (' + img.width + ', ' + img.height + ')');
		    	resolve(img);			    
		    }
		});
	    });
	}
    };
}

module.exports.ImageDownloader = ImageDownloader;

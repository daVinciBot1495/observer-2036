/**
 * A class for filtering images.
 */
function ImageFilterer (imageCreator) {
    function offset (x, y, width) {
	return (y * width + x);
    }

    function offset4 (x, y, width) {
	return offset(x, y, width) * 4;
    }

    function normalize (filter) {
	var sum = 0.0;
	    
	for (var i = 0; i < filter.length; ++i) {
	    sum += filter[i];
	}
	    
	for (var i = 0; i < filter.length; ++i) {
	    filter[i] /= sum;
	}
    }

    function gaussian (x, y, params) {
	var sigma = params.sigma;
	var twoSigma2 = 2 * sigma * sigma;
	var k = 1.0 / (Math.PI * twoSigma2);
	return k * Math.exp(-(x * x + y * y) / twoSigma2);
    }

    function gabor (x, y, params) {
	var theta = params.theta;
	var lambda = params.lambda;
	var gamma2 = params.gamma * params.gamma;
	var twoSigma2 = 2 * params.sigma * params.sigma;

	/*
	 * Rotate the point (x, y) by theta. This has the effect of rotating the
	 * 2D sinusoid.
	 */
	var xPrime = x * Math.cos(theta) + y * Math.sin(theta);
	var yPrime = -x * Math.sin(theta) + y * Math.cos(theta);

	// Compute the Gaussian component
	var gauss = Math.exp(-(xPrime * xPrime + gamma2 * yPrime * yPrime) / twoSigma2);

	// Compute the sinusoid component
	var sinusoid = Math.cos(2 * Math.PI * xPrime / lambda);
	return gauss * sinusoid;
    }

    function genericFilter (func, params) {
	var width = params.width;
	var halfWidth = Math.floor(width / 2.0);
	var filter = new Float32Array(width * width);
	
	for (var x = 0; x < width; ++x) {
	    for (var y = 0; y < width; ++y) {
		var xTrans = x - halfWidth;
		var yTrans = y - halfWidth;
		filter[offset(x, y, width)] = func(xTrans, yTrans, params);
	    }
	}

	return filter;
    }
    
    return {
	/**
	 * Returns a new Gaussian filter with the provided width and standard
	 * deviation.
	 *
	 * @param width {Integer} The width of the filter, preferably an odd
	 * number.
	 * @param sigma {Float} The standard deviation of the Gaussian.
	 * @return {Float32Array} A filter of length width * width.
	 */
	gaussianFilter: function (width, sigma) {
	    var filter = genericFilter(gaussian, {
		width: width,
		sigma: sigma
	    });

	    /*
	     * Ensure the filter sums to one so the overall brightness of the
	     * image is not changed.
	     */
	    normalize(filter);

	    return filter;
	},

	gaborFilter: function (width, lambda, theta, sigma, gamma) {
	    return genericFilter(gabor, {
		width: width,
		lambda: lambda,
		theta: theta,
		sigma: sigma,
		gamma: gamma
	    });
	},
	
	/**
	 * Convolves the provided image data with the provided weight matrix.
	 *
	 * Note that the form of imageData is as follows: {
	 *     data: {Array}
	 *     width: {Integer}
	 *     height: {Integer}
	 * }
	 *
	 * @param imageData {Object} An image data object.
	 * @param weights {Array} An array of weights to be convolved with the image.
	 * @param opaque {Boolean} Whether or not to flip the convolved alpha value for each pixel.
	 * @param allowNegatives {Boolean} Whether or not negative pixel values are allowed.
	 * @return {Object} An image data object that consists of the convolved image.
	 */
	convolve: function (imageData, weights, opaque, allowNegatives) {
	    var src = imageData.data;
	    var srcWidth = imageData.width;
	    var srcHeight = imageData.height;
	    
	    var side = Math.round(Math.sqrt(weights.length));
	    var halfSide = Math.floor(side / 2.0);
	    
	    var alphaFac = opaque ? 1 : 0;

	    var output = imageCreator.createImageData(srcWidth, srcHeight, allowNegatives);
	    var dst = output.data;

	    // Iterate over every pixel location
	    for (var y = 0; y < srcHeight; ++y) {
		for (var x = 0; x < srcWidth; ++x) {
		    var r = 0;
		    var g = 0;
		    var b = 0;
		    var a = 0;

		    // Iterate over every element of the weight matrix
		    for (var wy = 0; wy < side; ++wy) {
			for (var wx = 0; wx < side; ++wx) {
			    /*
			     * Compute the pixel location that should be
			     * convolved with the current element of the weight
			     * matrix.
			     */
			    var swy = y + wy - halfSide;
			    var swx = x + wx - halfSide;

			    // If swy and swx are within the image bounds
			    if (swy >= 0 && swy < srcHeight && swx >= 0 && swx < srcWidth) {
				/*
				 * By convention the weight matrix is flipped
				 * vertically and horizontally.
				 */
				var fwy = side - 1 - wy; 
				var fwx = side - 1 - wx;

				/*
				 * Compute the weight to be convolved with the
				 * pixel location.
				 */
				var srcOffset = offset4(swx, swy, srcWidth);
				var w = weights[offset(fwx, fwy, side)];

				r += (src[srcOffset + 0] * w);
				g += (src[srcOffset + 1] * w);
				b += (src[srcOffset + 2] * w);
				a += (src[srcOffset + 3] * w);
			    }
			}
		    }

		    var dstOffset = offset4(x, y, srcWidth);
		    dst[dstOffset + 0] = r;
		    dst[dstOffset + 1] = g;
		    dst[dstOffset + 2] = b;
		    dst[dstOffset + 3] = a + alphaFac * (255 - a);
		}
	    }

	    return output;
	}
    };
}

module.exports.ImageFilterer = ImageFilterer;

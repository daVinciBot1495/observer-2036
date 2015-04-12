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
    
    return {
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
	convolve: function (imageData, weights, providedOutput, params) {
	    var src = imageData.data;
	    var srcWidth = imageData.width;
	    var srcHeight = imageData.height;
	    
	    var side = Math.round(Math.sqrt(weights.length));
	    var halfSide = Math.floor(side / 2.0);
	    
	    var alphaFac = (params && params.opaque) ? 1 : 0;

	    var output = providedOutput || imageCreator.createImageData(
		srcWidth,
		srcHeight,
		(params && params.allowNegatives));
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

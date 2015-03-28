/**
 * A class for creating images.
 */
function ImageCreator (canvas) {
    var context = canvas.getContext('2d');
    
    return {
	/**
	 * Creates an image data object with the following form: {
	 *     data: {Array}
	 *     width: {Integer}
	 *     height: {Integer}
	 * }
	 *
	 * Note that the data array has a length of width * height * 4. The
	 * multiplication by 4 captures the RGBA representation of each pixel.
	 *
	 * @param width {Integer} The width of the image data object to be created.
	 * @param height {Integer} The height of the image data object to be created.
	 * @param allowNegatives {Boolean} Whether or not negative pixel values are allowed.
	 * @return {ImageData} An image data object.
	 */
	createImageData: function (width, height, allowNegatives) {
	    var imageData;

	    if (allowNegatives) {
		imageData = {};
		imageData.data = new Float32Array(width * height * 4);
	    } else {
		imageData = context.createImageData(width, height);
	    }
	    
	    imageData.width = width;
	    imageData.height = height;
	    
	    return imageData;
	}
    };
}

module.exports.ImageCreator = ImageCreator;

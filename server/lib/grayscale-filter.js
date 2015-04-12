function GrayscaleFilter (imageCreator) {
    return {
	apply: function (imgData, params, providedOutput) {
	    var src = imgData.data;
	    var srcWidth = imgData.width;
	    var srcHeight = imgData.height;
	    var output = providedOutput || imageCreator.createImageData(
		srcWidth,
		srcHeight,
		false);
	    var dst = output.data;

	    for (var i = 0; i < src.length; i += 4) {
		var r = src[i + 0];
		var g = src[i + 1];
		var b = src[i + 2];
		var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;

		dst[i + 0] = v;
		dst[i + 1] = v;
		dst[i + 2] = v;
		dst[i + 3] = src[i + 3];
	    }
	    
	    return output;
	}
    };
}

module.exports.GrayscaleFilter = GrayscaleFilter;

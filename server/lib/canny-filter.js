function CannyFilter (grayscaleFilter, imageFilterer) {
    var xFilter = [1.0, 0.0, -1.0, 1.0, 0.0, -1.0, 1.0, 0.0, -1.0];
    var yFilter = [1.0, 1.0, 1.0, 0.0, 0.0, 0.0, -1.0, -1.0, -1.0];
    var prewitParams = {
	allowNegatives: true
    };
    
    return {
	apply: function (imgData, params, providedOutput) {
	    var imgGrayscale = grayscaleFilter.apply(imgData, null, providedOutput);
	    var xImgData = imageFilterer.convolve(
		imgGrayscale,
		xFilter,
		null,
		prewitParams);
	    var yImgData = imageFilterer.convolve(
		imgGrayscale,
		yFilter,
		null,
		prewitParams);
	    var output = imgGrayscale;
	    var dst = output.data;

	    for (var i = 0; i < dst.length; i += 4) {
		var deltaX = xImgData.data[i];
		var deltaY = yImgData.data[i];
		var v = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
		
		dst[i + 0] = v;
		dst[i + 1] = v;
		dst[i + 2] = v;
		dst[i + 3] = 255.0;
	    }

	    return output;
	}
    };
}

module.exports.CannyFilter = CannyFilter;

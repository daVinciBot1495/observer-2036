function GaborFilter (gaborFilterCreator, grayscaleFilter, imageFilterer) {
    var convolutionParams = {
	allowNegatives: true
    };
    
    return {
	apply: function (imgData, params, providedOutput) {
	    var imgGrayscale = grayscaleFilter.apply(imgData);
	    return imageFilterer.convolve(
		imgGrayscale,
		gaborFilterCreator.create(params),
		providedOutput,
		convolutionParams);
	}
    };
}

module.exports.GaborFilter = GaborFilter;

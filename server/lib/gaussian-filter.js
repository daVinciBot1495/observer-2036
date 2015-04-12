function GaussianFilter (gaussianFilterCreator, imageFilterer) {
    return {
	apply: function (imgData, params, providedOutput) {
	    return imageFilterer.convolve(
		imgData,
		gaussianFilterCreator.create(params),
		providedOutput);
	}
    };
}

module.exports.GaussianFilter = GaussianFilter;

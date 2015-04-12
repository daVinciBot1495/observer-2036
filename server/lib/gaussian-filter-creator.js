function GaussianFilterCreator (filterCreator) {
    function gaussian (x, y, params) {
	var sigma = params.sigma;
	var twoSigma2 = 2 * sigma * sigma;
	var k = 1.0 / (Math.PI * twoSigma2);
	return k * Math.exp(-(x * x + y * y) / twoSigma2);
    }
    
    return {
	create: function (params) {
	    var filter = filterCreator.create(gaussian, params);
	    filterCreator.normalize(filter);
	    return filter;
	}
    };
}

module.exports.GaussianFilterCreator = GaussianFilterCreator;

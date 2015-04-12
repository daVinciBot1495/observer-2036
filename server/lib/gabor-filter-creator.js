function GaborFilterCreator (filterCreator) {
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

    
    return {
	create: function (params) {
	    return filterCreator.create(gabor, params);
	}
    };
}

module.exports.GaborFilterCreator = GaborFilterCreator;

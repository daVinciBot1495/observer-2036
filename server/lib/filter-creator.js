function FilterCreator () {
    function offset (x, y, width) {
	return (y * width + x);
    }
    
    return {
	/**
	 * Creates a filter using the provided filter function and parameters.
	 *
	 * @param func {Function} A filter function (e.g., 2D Gaussian). The
	 * filter function is expected to have the following signature:
	 * 
	 * function (x, y, params) { }
	 * 
	 * @param params {Object} The parameters to be passed to the provided
	 * filter function. This object must contain a width property, which
	 * defines the width of the filter to be created. For example, the
	 * params object for a Gaussian filter might look like:
	 *
	 * {
	 *     width: 3,
	 *     sigma: 1.0
	 * }
	 *
	 * @return {Float32Array} The filter.
	 */
	create: function (func, params) {
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
	},

	/**
	 * Normalizes the provided filter such that it sums to 1.0.
	 *
	 * @param filter {Array} The filter to be normalized.
	 */
	normalize: function (filter) {
	    var sum = 0.0;
	    
	    for (var i = 0; i < filter.length; ++i) {
		sum += filter[i];
	    }
	    
	    for (var i = 0; i < filter.length; ++i) {
		filter[i] /= sum;
	    }
	}
    };
}

module.exports.FilterCreator = FilterCreator;

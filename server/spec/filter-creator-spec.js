var FilterCreator = require('../lib/filter-creator').FilterCreator;

describe('The filter creator', function () {
    var width;
    var spyObj;
    var params;
    var filterCreator;

    beforeEach(function () {
	width = 3;
	filterCreator = new FilterCreator();
	spyObj = jasmine.createSpyObj('spyObj', ['spyFunc']);
	params = {
	    width: width
	};
    });

    describe('when creating filters', function () {
	var filter;

	beforeEach(function () {
	    filter = filterCreator.create(spyObj.spyFunc, params);
	});
	
	it('should size them correctly', function () {
	    expect(filter.length).toEqual(width * width);
	});

	it('should evaluate the provided function at each filter position', function () {
	    expect(spyObj.spyFunc).toHaveBeenCalledWith(-1, -1, params);
	    expect(spyObj.spyFunc).toHaveBeenCalledWith(-1, 0, params);
	    expect(spyObj.spyFunc).toHaveBeenCalledWith(-1, 1, params);

	    expect(spyObj.spyFunc).toHaveBeenCalledWith(0, -1, params);
	    expect(spyObj.spyFunc).toHaveBeenCalledWith(0, 0, params);
	    expect(spyObj.spyFunc).toHaveBeenCalledWith(0, -1, params);

	    expect(spyObj.spyFunc).toHaveBeenCalledWith(1, -1, params);
	    expect(spyObj.spyFunc).toHaveBeenCalledWith(1, 0, params);
	    expect(spyObj.spyFunc).toHaveBeenCalledWith(1, -1, params);
	});
    });

    it('should normalize filters', function () {
	var filter = [1.0, 1.0, 1.0, 1.0];
	filterCreator.normalize(filter);
	
	expect(filter[0]).toEqual(0.25);
	expect(filter[1]).toEqual(0.25);
	expect(filter[2]).toEqual(0.25);
	expect(filter[3]).toEqual(0.25);
    });
});

'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
var clientApp = angular.module('clientApp');

clientApp.controller('MainCtrl', ['$log', '$scope', '$http', function ($log, $scope, $http) {
    angular.extend($scope, {
	imgUrl: '',
	filteredImgData: '',
	filterImg: function () {
	    $http.post('api/filter', {
		url: $scope.imgUrl,
		filter: 'canny'
	    }).success(function (data, status, headers, config) {
		$log.debug('Successfully filtered image');
		$scope.filteredImgData = data;
	    }).error(function (data, status, headers, config) {
		$log.error(data.message);
		$scope.filteredImgData = '';
	    });
	}
    });
}]);

'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
var clientApp = angular.module('clientApp');

clientApp.controller('MainCtrl', ['$scope', function ($scope) {
    angular.extend($scope, {
	imgUrl: ''
    });
}]);

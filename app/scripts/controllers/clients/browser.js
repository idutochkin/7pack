'use strict';

/**
 * @ngdoc function
 * @name erp7App.controller:ClientsBrowserCtrl
 * @description
 * # ClientsBrowserCtrl
 * Controller of the erp7App
 */
angular.module('erp7App')
  .controller('ClientsBrowserCtrl', function ($scope, api) {
		$scope.sortType     = 'ID'; // set the default sort type
		$scope.sortReverse  = false;  // set the default sort order
		$scope.searchFish   = '';     // set the default search/filter term*/

		api.Customer.listCompany(this, function(controller, response) {	
			controller.clientsCompany = response.data;
		});
	
    api.Customer.listPersonal(this, function(controller, response) {	
			controller.clientsPersonal = response.data;
		});
});
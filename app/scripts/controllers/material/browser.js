'use strict';

/**
 * @ngdoc function
 * @name erp7App.controller:MaterialBrowserCtrl
 * @description
 * # MaterialBrowserCtrl
 * Controller of the erp7App
 */
angular.module('erp7App')
	.controller('MaterialBrowserCtrl', function (api, $scope, $q) {
		var PAGE_SIZE = 30;

		var loadAll = function (page) {
			var filter = null;
			if (page) {
				filter = {};
				filter.from = (page - 1) * PAGE_SIZE;
				filter.qty = PAGE_SIZE;
			}
			api.material.all(filter, function (err, res) {
				$scope.materials = res.data;
			});
			
			if(page > 1)
				document.querySelector('.pagination').querySelectorAll('button')[0].removeAttribute("disabled");
			document.querySelector('.pagination').querySelectorAll('button')[1].removeAttribute("disabled");
		};
		
		$scope.search = function (input) {
			if (!input) 
				return loadAll($scope.CURRENT_PAGE);
			
			if (input.length > 0) {
				api.material.search(input, function (err, res) {
					if (err) return console.log(err);
					
					$scope.materials = res.data;
			  
					document.querySelector('.pagination').querySelectorAll('button')[0].setAttribute("disabled", "true");
					document.querySelector('.pagination').querySelectorAll('button')[1].setAttribute("disabled", "true");
				})
			}
		};
		
		$scope.input = '';
		
		$scope.cleanSearch = function () {
			$scope.input = '';
			loadAll($scope.CURRENT_PAGE);
		}
		
		$scope.CURRENT_PAGE = 0;
		$scope.nextPage = function () {
			$scope.CURRENT_PAGE++;
			loadAll($scope.CURRENT_PAGE);
		}
		
		$scope.prevPage = function () {
			$scope.CURRENT_PAGE--;
			loadAll($scope.CURRENT_PAGE);
		}
		
		$scope.nextPage();
	});
'use strict';

/**
 * @ngdoc function
 * @name erp7App.controller:SalesBrowserCtrl
 * @description
 * # SalesBrowserCtrl
 * Controller of the erp7App
 */
angular.module('erp7App')
  .controller('SalesBrowserCtrl', function ( $scope) {
    $scope.filter = {
      enable : false,
      crt : {
        dateFrom : null,
        dateTo: null,
      },
      toggle : function(){
        $scope.filter.enable = !$scope.filter.enable; 
      }
    }
  });

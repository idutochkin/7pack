'use strict';

/**
 * @ngdoc function
 * @name erp7App.controller:SalesAddproductCtrl
 * @description
 * # SalesAddproductCtrl
 * Controller of the erp7App
 */
angular.module('erp7App')
  .controller('SalesAddproductCtrl', function ($scope, $mdDialog) {
    $scope.close = function () {
      $mdDialog.hide();
    }

    $scope.select = false;
    $scope.change = function(){
      $scope.select = true;
    }

    $scope.categoryMenu = [
      {
        icon : 'favorite',
        name : 'Popular',
        sref : ''
      },
      {
        icon : 'menu',
        name : 'Produktai',
        sref : ''
      },
      {
        icon : 'supervisor_account',
        name : 'Paslaugos',
        sref : ''
      },
      {
        icon : 'inbox',
        name : 'Taros',
        sref : ''
      }
    ] 
  });

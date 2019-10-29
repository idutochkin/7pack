'use strict';

/**
 * @ngdoc function
 * @name erp7App.controller:ClientsNewCtrl
 * @description
 * # ClientsNewCtrl
 * Controller of the erp7App
 */
angular.module('erp7App')
  .controller('ClientsNewCtrl', function ($scope, $mdDialog) {
    $scope.client = {
      type: 'phy'
    };
    $scope.closeDialog = function () {
      $mdDialog.hide();
    };
  });

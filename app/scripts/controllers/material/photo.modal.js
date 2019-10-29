'use strict';

/**
 * @ngdoc function
 * @name erp7App.controller:MaterialPhotoModalCtrl
 * @description
 * # MaterialPhotoModalCtrl
 * Controller of the erp7App
 */
angular.module('erp7App')
  .controller('MaterialPhotoModalCtrl', function (images, $scope) {
    $scope.images = images;
    $scope.current = 0;

    $scope.change = function (value){
      $scope.current += value;
    }
  });

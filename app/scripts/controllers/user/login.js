'use strict';

/**
 * @ngdoc function
 * @name erp7App.controller:UserLoginCtrl
 * @description
 * # UserLoginCtrl
 * Controller of the erp7App
 */
angular.module('erp7App')
  .controller('UserLoginCtrl', function (auth, $scope, $state) {
    $scope.loading = false;
    $scope.error = {
      show : false,
      message : 'Blogas prisijungimo vardas arba slaptažodis'
    };
    $scope.login = function(username, password){
      $scope.error.show = false;
      $scope.loading = true;
      auth.login(username, password, function(success){
        if(success) {
          $scope.loading = false;
          $state.go('dashboard.personal')
        }
        else{
          $scope.loading = false;
          $scope.error.show = true;
        }
      })
    }
  });

'use strict';

/**
 * @ngdoc function
 * @name erp7App.controller:CommBodyCtrl
 * @description
 * # CommBodyCtrl
 * Controller of the erp7App
 */
angular.module('erp7App')
  .controller('BodyCtrl', function ($transitions, api, $state) {
    $transitions.onStart({}, function() {
      api.user.isAuthenticated(function(res){
        if (res == false && $state.current.name != 'terminal.main') {
          $state.go('user.login');
        }
      });
    });
  });

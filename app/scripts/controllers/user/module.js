'use strict';

/**
 * @ngdoc function
 * @name erp7App.controller:DashboardsModuleCtrl
 * @description
 * # DashboardsModuleCtrl
 * Controller of the erp7App
 */

var config = function ($stateProvider) {
  $stateProvider
    .state('user', {
      url : '',
      templateUrl : 'views/comm/empty-frame.html',
      abstract : true
    })
    .state('user.login', {
      url : '/user/login',
      templateUrl : 'views/user/login.html',
      controller : 'UserLoginCtrl'
    })
};

angular
  .module('erp7App.user', [])
  .config([
    '$stateProvider',
    config
  ]);


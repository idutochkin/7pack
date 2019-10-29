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
    .state('timetracking', {
      url : '',
      templateUrl : 'views/comm/empty-frame.html',
      abstract : true
    })
    .state('timetracking.registration', {
      url : '/timetracking/terminal',
      templateUrl : 'views/timetracking/registration.html',
      controller : 'TimetrackingRegistrationCtrl'
    })
};

angular
  .module('erp7App.timetracking', [])
  .config([
    '$stateProvider',
    config
  ]);


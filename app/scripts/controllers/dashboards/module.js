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
    .state('dashboard', {
      url : '',
      templateUrl : 'views/comm/full-frame.html',
      abstract : true
    })
    .state('dashboard.personal', {
      url : '/dashboard/p',
      templateUrl : 'views/dashboards/personal.html',
      controller : 'PersonalDashboardCtrl',
      params : {
        path : [
          'dashboard',
          'personal'
        ]
      }
    })
};

angular
  .module('erp7App.dashboard', [])
  .config([
    '$stateProvider',
    config
  ]);


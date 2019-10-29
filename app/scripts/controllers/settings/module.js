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
    .state('settings', {
      url : '',
      templateUrl : 'views/comm/full-frame.html',
      abstract : true
    })
    .state('settings.menu', {
      url : '/settings/menu',
      templateUrl : 'views/settings/menu.html',
      controller : 'SettingsMenuCtrl'
    })
    .state('settings.employees', {
      url : '/settings/employees',
      templateUrl : 'views/settings/employees-browser.html',
      controller : 'SettingsEmployeesBrowserCtrl'
    })
    .state('settings.employees.new', {
      url : '/new',
      templateUrl : 'views/settings/employees-new.html',
      controller : 'SettingsEmployeesNewCtrl'
    })
    .state('settings.employees.details', {
      url : '/details/:id',
      templateUrl : 'views/settings/employees-details.html',
      controller : 'SettingsEmployeesDetailsCtrl'
    })
};

angular
  .module('erp7App.settings', [])
  .config([
    '$stateProvider',
    config
  ]);


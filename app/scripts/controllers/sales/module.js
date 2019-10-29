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
    .state('sales', {
      url : '',
      templateUrl : 'views/comm/full-frame.html',
      abstract : true
    })
    .state('salesData', {
      url : '',
      templateUrl : 'views/comm/empty-frame.html',
      abstract : true
    })
    .state('salesData.orderConfirmation', {
      url : '/sales-data/confirmation/:id',
      templateUrl : 'views/sales/confirmation.html',
      controller : 'SalesConfirmationCtrl'
    })
    .state('sales.browser', {
      url : '/sales/browser',
      templateUrl : 'views/sales/browser.html',
      controller : 'SalesBrowserCtrl'
    })
    .state('sales.details', {
      url : '/sale/:id',
      templateUrl : 'views/sales/details.html',
      controller : 'SalesDetailsCtrl'
    })
    .state('sales.create', {
      url : '/sales/create',
      templateUrl : 'views/sales/new.html',
      controller : 'SalesNewCtrl'
    })
};

angular
  .module('erp7App.sales', [])
  .config([
    '$stateProvider',
    config
  ]);


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
    .state('clients', {
      url: '',
      templateUrl: 'views/comm/full-frame.html',
      abstract: true
    })
    .state('clients.browser', {
      url: '/clients/browser',
      templateUrl: 'views/clients/browser.html',
      controller: 'ClientsBrowserCtrl',
      params: {
        path: [
          'clients'
        ]
      }
    })
    .state('clients.new', {
      url: '/clients/create',
      templateUrl: 'views/clients/new.html',
      controller: 'ClientsNewCtrl',
      params: {
        path: [
          'clients',
          'new'
        ]
      }
    })
    .state('clients.edit', {
      url: '/clients/edit/:id',
      templateUrl: 'views/clients/edit.html',
      controller: 'ClientsEditCtrl',
      params: {
        id: ":id",
        path: [
          'client',
          'client edit'
        ]
      }
    })
    .state('clients.browser.details', {
      url: '/client/:id',
      templateUrl: 'views/clients/details.html',
      controller: 'ClientsDetailsCtrl',
      params: {
        id: ":id",
        path: [
          'client',
          'client name'
        ]
      }
    })
};

angular
  .module('erp7App.clients', [])
  .config([
    '$stateProvider',
    config
  ]);

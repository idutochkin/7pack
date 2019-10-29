'use strict';

/**
 * @ngdoc function
 * @name erp7App.controller:RecipiesModuleCtrl
 * @description
 * # RecipiesModuleCtrl
 * Controller of the erp7App
 */
var config = function ($stateProvider) {

  $stateProvider
    .state('recipies', {
      url: '',
      templateUrl: 'views/comm/full-frame.html',
      abstract: true
    })
    .state('recipieData', {
      url: '',
      templateUrl: 'views/comm/empty-frame.html',
      abstract: true
    })
    .state('recipieData.dataSheet', {
      url: '/recipie-data-sheet/:id',
      templateUrl: 'views/recipies/datasheet.html',
      controller: 'RecipiesDatasheetCtrl'
    })
    .state('recipies.browser', {
      url: '/recipies/browser',
      templateUrl: 'views/recipies/browser.html',
      controller: 'RecipiesBrowserCtrl'
    })
    .state('recipies.browser.selected', {
      url: '/recipie/:id',
      templateUrl: 'views/recipies/details.html',
      controller: 'RecipiesSelectedCtrl'
    })
    .state('recipies.browser.material', {
      url: '/material/:id',
      templateUrl: 'views/material/details.html',
      controller: 'MaterialDetailsCtrl'
    })
    .state('recipies.browser.modify', {
      url: '/material/:id/modify',
      templateUrl: 'views/material/new.html',
      controller: 'MaterialNewCtrl'
    })
};

angular
  .module('erp7App.recipies', [])
  .config([
    '$stateProvider',
    config
  ]);

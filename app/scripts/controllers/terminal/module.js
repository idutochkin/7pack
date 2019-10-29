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
    .state('terminal', {
      url : '',
      templateUrl : 'views/comm/empty-frame.html',
      abstract : true
    })
    .state('terminal.main', {
      url : '/terminal/main',
      templateUrl : 'views/terminal/main.html',
      controller : 'TerminalMainCtrl'
    })
    .state('terminal.bagLabelPrint', {
      url : '/terminal/label-print/:date',
      templateUrl : 'views/production/bag-label-print.html',
      controller : 'ProducionBagLabelPrintCtrl'
    })
    .state('terminal.printHandout', {
      url : '/terminal/handout-print/:date/:driver/:jobType',
      templateUrl : 'views/production/driver-handout-print.html',
      controller : 'ProductionDriverHandoutCtrl'
    })
    .state('terminal.stickerPrint', {
      url : '/task/sticker-printing/:date',
      templateUrl : 'views/sticker-printing.html',
      controller : 'StickerPrintingCtrl'
    })
};

angular
  .module('erp7App.terminal', [])
  .config([
    '$stateProvider',
    config
  ]);


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
    .state('production', {
      url : '',
      templateUrl : 'views/comm/full-frame.html',
      abstract : true
    })
    .state('production.bagsTracking', {
      url : '/production/bags-tracking',
      templateUrl : 'views/production/bags-tracking.html',
      controller : 'BagsTrackingCtrl',
      params : {
        path : [
          'production',
          'bags tracking'
        ]
      }
    })
    .state('production.planningEdit', {
      url: '/planning/edit/:id',
      templateUrl: 'views/production/planning-edit.html',
      controller: 'PlanningEditCtrl',
      params: {
        id: ":id",
        path: [
          'production',
          'planning edit'
        ]
      }
    })
    .state('production.menuPlaningBrowser', {
      url : '/production/menu-planing',
      templateUrl : 'views/production/menu-planing-browser.html',
      controller : 'ProductionMenuplaningbrowserCtrl',
      params : {
        path : [
          'production',
          'menuPlaning'
        ]
      }
    })
    .state('production.menuPlaningBrowser.menuPlaning', {
      url : '/set/:id',
      templateUrl : 'views/production/menu-planing.html',
      controller : 'ProductionMenuPlaningCtrl',
      params : {
        path : [
          'production',
          'menu planing'
        ]
      }
    })
    .state('production.planning', {
      url : '/planning',
      templateUrl : 'views/production/planning.html',
      controller : 'ProductionPlanningCtrl',
      params : {
        path : [
          'production',
          'planning'
        ]
      }
    })
    .state('production.classficators', {
      url : '/production/classificator/:type',
      templateUrl : 'views/production/classificators.html',
      controller : 'ProductionClassificatorsCtrl',
      params : {
        path : [
          'production',
          'menu planing'
        ]
      }
    })
    .state('production.materialSummary', {
      url : '/production/material-summary',
      templateUrl : 'views/production/material-summary.html',
      controller : 'ProductionMaterialSummaryCtrl',
      params : {
        path : [
          'production',
          'material summary'
        ]
      }
    })
    .state('production.stickerReport', {
      url : '/production/sticker-report',
      templateUrl : 'views/production/sticker-report.html',
      controller : 'ProductionStickerReportCtrl',
      params : {
        path : [
          'production',
          'stickers'
        ]
      }
    })
    .state('production.bagComplete', {
      url : '/production/complete-bag',
      templateUrl : 'views/production/bag-complete.html',
      controller : 'ProductionBagCompleteCtrl',
      params : {
        path : [
          'production',
          'bag complete'
        ]
      }
    })
    .state('production.quality', {
      url : '/production/quality-contol',
      templateUrl : 'views/production/quality.html',
      controller : 'ProductionQualityCtrl',
      params : {
        path : [
          'production',
          'bag complete'
        ]
      }
    })
    .state('production.report', {
      url : '/production/report',
      templateUrl : 'views/production/report.html',
      controller : 'ProductionReportCtrl',
      controllerAs: 'report',
      // params : {
      //   path : [
      //     'production',
      //     'bag complete'
      //   ]
      // }
    })
};

angular
  .module('erp7App.production', [])
  .config([
    '$stateProvider',
    config
  ]);


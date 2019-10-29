'use strict';

/**
 * @ngdoc function
 * @name erp7App.controller:SettingsMenuCtrl
 * @description
 * # SettingsMenuCtrl
 * Controller of the erp7App
 */
angular.module('erp7App')
  .controller('SettingsMenuCtrl', function ($scope) {
    $scope.settingMenu = [
      {
        icon : 'view_quilt',
        name : 'UI',
        sref : 'settings.employees'
      },
      {
        icon : 'menu',
        name : 'Klasifikatoriai',
        sref : 'production.classficators({type:\'main\'})'
      },
      {
        icon : 'supervisor_account',
        name : 'Darbuotojai',
        sref : 'settings.employees'
      },
      {
        icon : 'visibility',
        name : 'Rolės',
        sref : 'settings.employees'
      },
      {
        icon : 'settings',
        name : 'Kiti',
        sref : 'settings.employees'
      }
    ]
  });

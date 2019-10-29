'use strict';

/**
 * @ngdoc function
 * @name erp7App.controller:ProductionClassificatorsCtrl
 * @description
 * # ProductionClassificatorsCtrl
 * Controller of the erp7App
 */
angular.module('erp7App')
  .controller('ProductionClassificatorsCtrl', function (Notificator, $scope) {
    $scope.delete = function (id) {
      Notificator.confirm(
        'Trinti Klasifikatorių',
        'Ar tikrai norite trinti klasifikatorių ' + id,
        'Trinti',
        function(){
          Notificator.toast("Klasifikatorius ištrintas");
        },
        null
      )
    };
    $scope.edit = function (id) {
      Notificator.prompt(
      'Redaguoti',
      '',
      'pavadinimas',
      'Klasifikatorius' + id,
      'Išsaugoti',
      function(){
        Notificator.toast("Klasifikatorius išsaugotas");
      },
      null)
    }
  });

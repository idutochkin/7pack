'use strict';

/**
 * @ngdoc function
 * @name erp7App.controller:ProductionMaterialSummaryCtrl
 * @description
 * # ProductionMaterialSummaryCtrl
 * Controller of the erp7App
 */
angular.module('erp7App')
  .controller('ProductionMaterialSummaryCtrl', function ($scope) {
    $scope.calendarFrom = {
      date: moment(),
      go: function (dir) {
        if (dir == 'next') {
          $scope.calendarFrom.date = moment($scope.calendarFrom.date).add(1, 'day');
        } else {
          $scope.calendarFrom.date = moment($scope.calendarFrom.date).subtract(1, 'day');
        }
      }
    };

    $scope.calendarTo = {
      date: moment().add(1, 'day'),
      go: function (dir) {
        if (dir == 'next') {
          $scope.calendarTo.date = moment($scope.calendarTo.date).add(1, 'day');
        } else {
          $scope.calendarTo.date = moment($scope.calendarTo.date).subtract(1, 'day');
        }
      }
    };
  });

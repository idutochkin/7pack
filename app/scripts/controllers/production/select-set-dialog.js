'use strict';

/**
 * @ngdoc function
 * @name erp7App.controller:SelectSetCtrl
 * @description
 * # SelectSetCtrl
 * Controller of the erp7App
 */
angular.module('erp7App')
    .controller('SelectSetCtrl', function ($scope, api, $mdDialog, date, customerId, holidays) {
        $scope.closeDialog = function () {
            $mdDialog.hide();
        };

        $scope.filterDates = function (date) {
            return !((date.getDay() === 6)
                || (date.getDay() === 0)
                || holidays.includes(moment(date).format('YYYY-MM-DD'))
                || moment(date).isBefore(moment().format('YYYY-MM-DD')));
        };

        $scope.date = new Date(date);
        api.sets.active(function (err, sets) {
            if (err) return console.error(err);
            $scope.sets = sets.data;
        });

        $scope.addCalendarEntries = function () {
            if ($scope.selectedSet && Number($scope.daysAmount)) {
                api.calendar.add(customerId, $scope.selectedSet.ID, Number($scope.daysAmount), $scope.date, function (err, res) {
                    if (err) return Notificator.alert("Klaida " + err.status, err.data);
                    $mdDialog.hide();
                });
            } else {
                alert('Fill the fields in correct form');
            }
        }
    });

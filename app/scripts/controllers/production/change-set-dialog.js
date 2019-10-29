'use strict';

/**
 * @ngdoc function
 * @name erp7App.controller:ChangeSetCtrl
 * @description
 * # ChangeSetCtrl
 * Controller of the erp7App
 */
angular.module('erp7App')
    .controller('ChangeSetCtrl', function ($scope, api, $mdDialog, entryId, setId) {
        $scope.closeDialog = function () {
            $mdDialog.hide();
        };
        api.sets.active(function (err, sets) {
            if (err) return console.error(err);
            $scope.sets = sets.data;
            $scope.selectedSet = $scope.sets.find(function (set) {
                return set.ID === setId;
            });
        });

        $scope.updateCalendarEntries = function () {
            if (confirm('Ar tikrai norite atnaujinti įrašą')) {
                api.calendar.update(entryId, $scope.selectedSet.ID, function (err, res) {
                    if (err) return Notificator.alert("Klaida " + err.status, err.data);
                    $scope.closeDialog();
                });
            }
        };

        $scope.deleteCalendarEntries = function () {
            if (confirm('Ar tikrai norite ištrinti įrašą')) {
                api.calendar.delete(entryId, function (err, res) {
                    if (err) return Notificator.alert("Klaida " + err.status, err.data);
                    $scope.closeDialog();
                });
            }
        }
    });

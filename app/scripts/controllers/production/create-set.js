'use strict';

/**
 * @ngdoc function
 * @name erp7App.controller:ProductionCreateSetCtrl
 * @description
 * # ProductionCreateSetCtrl
 * Controller of the erp7App
 */
angular.module('erp7App')
    .controller('ProductionCreateSetCtrl', function ($scope, api, $mdDialog, Notificator) {
        $scope.statuses = [];
        $scope.set = {
            Pavadinimas: '',
            Sablono_ID: 1,
            Statusas: 1
        };

        var init = function () {
            api.sets.statuses(function (err, res) {
                if (err) return Notificator.toast("Klaida gaunant statusus " + err.status);
                $scope.statuses = res.data;
                // console.log(res)
            })
            api.sets.images(function (err, res) {
                if (err) return Notificator.toast("Klaida gaunant statusus " + err.status);
                $scope.images = res.data;
            })
        }

        $scope.close = function () {
            $mdDialog.hide({ id: null });
        }

        $scope.create = function (set) {
            api.sets.create(set,
                function (err, res) {
                    if (err) return Notificator.alert('Klaida ' + err.status, err.data || 'unknown');
                    console.log(res);
                    $mdDialog.hide({ id: res.data })
                }
            )
        }

        init();
    });

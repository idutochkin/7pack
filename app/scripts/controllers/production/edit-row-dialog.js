'use strict';

/**
 * @ngdoc function
 * @name erp7App.controller:EditRowCtrl
 * @description
 * # EditRowCtrl
 * Controller of the erp7App
 */
angular.module('erp7App')
    .controller('EditRowCtrl', function ($scope, api, $mdDialog, customer, timeFrom, timeTo, codes, Notificator, hasNotValue, convertLocalTimeToUTC) {
        // console.log(customer, timeFrom, timeTo, codes, hasNotValue)
        $scope.closeDialog = function () {
            $mdDialog.hide();
        };

        $scope.customer = customer;
        $scope.deliveryTimeFrom = timeFrom;
        $scope.deliveryTimeTo = timeTo;
        $scope.cityCodes = codes;

        $scope.getTimeTo = function (from, customer) {
            var laikasIki = "";

            if (Number(from[1]) !== 9) {
                laikasIki = from[0] + Number(Number(from[1]) + 1) + from[2] + from[3] + from[4];
            } else {
                laikasIki = Number(from[0] + 1) + '0' + from[2] + from[3] + from[4];
            }

            if (Number(laikasIki.substr(0, 2) + laikasIki.substr(3, 2)) > Number(customer.Laikas_Iki.substr(0, 2) + customer.Laikas_Iki.substr(3, 2)))
                customer.Laikas_Iki = laikasIki;

            customer.deliveryTimeToTemp = $scope.deliveryTimeTo.filter(function (time) {
                return Number(laikasIki.substr(0, 2) + laikasIki.substr(3, 2)) -
                    Number(time.substr(0, 2) + time.substr(3, 2)) <= 0;
            });
        };

        $scope.updateCustomer = function () {
            if (confirm('Ar tikrai norite atnaujinti įrašą')) {
                if (
                    hasNotValue($scope.customer.Vardas) ||
                    hasNotValue($scope.customer.Pavarde) ||
                    hasNotValue($scope.customer.Laikas_Iki) ||
                    hasNotValue($scope.customer.Laikas_Nuo) ||
                    hasNotValue($scope.customer.Adresas) ||
                    hasNotValue($scope.customer.Miestas) ||
                    hasNotValue($scope.customer.Aukstas) ||
                    hasNotValue($scope.customer.Telefonas) ||
                    hasNotValue($scope.customer.Email)
                ) {
                    return alert("Klaida: there are fill required fields.");
                }
                var data = {
                    Adresas: $scope.customer.Adresas,
                    Aukstas: $scope.customer.Aukstas,
                    Email: $scope.customer.Email,
                    ID: $scope.customer.ID,
                    Kodas: $scope.customer.Kodas,
                    Laikas_Iki: convertLocalTimeToUTC($scope.customer.Laikas_Iki),
                    Laikas_Nuo: convertLocalTimeToUTC($scope.customer.Laikas_Nuo),
                    Miestas: $scope.customer.Miestas,
                    PPD: $scope.customer.PPD ? 1 : 0,
                    Pastabos_Gamybai: $scope.customer.Pastabos_Gamybai,
                    Pastabos_Kurjeriui: $scope.customer.Pastabos_Kurjeriui,
                    Pavarde: $scope.customer.Pavarde,
                    Telefonas: $scope.customer.Telefonas,
                    Vardas: $scope.customer.Vardas
                };
                api.Customer.updateTemp(customer.ID, data, function (err) {
                    if (err) return alert("Klaida " + err.status, err.data);
                    $scope.closeDialog();
                });
            }
        };
    });
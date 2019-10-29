'use strict';

/**
 * @ngdoc function
 * @name erp7App.controller:RecipiesSelectedCtrl
 * @description
 * # RecipiesSelectedCtrl
 * Controller of the erp7App
 */
angular.module('erp7App')
    .controller('RecipiesSelectedCtrl', function ($scope, $mdDialog, Notificator, $stateParams, api, $q, $filter, $state, $rootScope) {
        $scope.chartData = {
            type: 'pie',
            backgroundColor: 'none',
            series: [{
                values: [12.53],
                text: 'Angliavandeniai'
            },
            {
                values: [15.53],
                text: 'Baltymai'
            },
            {
                values: [9.53],
                text: 'Riebalai'
            },
            ],
            plot: {
                valueBox: {
                    placement: 'in',
                    text: '%t\n%npv% | %v',
                    fontFamily: 'Open Sans'
                }
            }
        }

        $scope.showLogModal = function () {
            $mdDialog.show({
                templateUrl: 'views/recipies/log-modal.html',
                clickOutsideToClose: true,
            })
        };

        $scope.showTareModal = function () {
            $mdDialog.show({
                templateUrl: 'views/recipies/tare-modal.html',
                clickOutsideToClose: true,
            })
        };

        $scope.openGallery = function () {
            $mdDialog.show({
                controller: 'MaterialPhotoModalCtrl',
                templateUrl: 'views/material/photo.modal.html',
                clickOutsideToClose: true,
                locals: {
                    images: $scope.product.images
                }
            })
        };

        $scope.openTechnology = function () {
            $mdDialog.show({
                templateUrl: 'views/recipies/technology-modal.html',
                clickOutsideToClose: true,
            })
        };

        $scope.openFileUploader = function () {
            $mdDialog.show({
                templateUrl: 'views/recipies/photo-upload.html',
                controller: 'RecipiesPhotoUploadCtrl',
                clickOutsideToClose: true,
                locals: {
                    productId: $scope.product.ID
                }
            }).then(function () {
                init()
            })
        };

        $scope.addMaterial = function () {
            $mdDialog.show({
                templateUrl: 'views/recipies/material-add-modal.html',
                controller: 'RecepiesMaterialAddCtrl',
                clickOutsideToClose: true,
            }).then(function (materialModel) {
                if (materialModel) {
					materialModel.RawMaterialType = materialModel.Tipas == "Pusgaminis" ? 2 : 1
                    var match = _.find($scope.product.calculation, function (c) {
                        return (materialModel.ID === c.ZaliavosID && materialModel.RawMaterialType === c.Tipas)
                    })
                    if (!match) {
                        api.product.createCalculation(
                            $scope.product.ID, {
                                "RawMaterialID": materialModel.ID,
                                "Drifting": 0,
                                "Netto": 0,
                                "RawMaterialType": materialModel.RawMaterialType,
                                "DriftingKcal": 0,
                                "UOM": 1
                            },
                            function (err, res) {
                                if (err) return console.error(err);
                                init();
                            }
                        )
                    } else {
                        Notificator.alert("Klaida", "Tokia žaliava jau yra.");
                    }
                }

            })
        };

        // $scope.recipieSlider = 4;

        $scope.openMaterial = function (material) {
            // if(material.ZaliavosTipoPavad == 'Pusgaminis'){
            //   var link = $state.href('recipies.browser.selected', {id: material.ZaliavosID});
            //   window.open(link, '_blank');
            // } else {
            //   var link = $state.href('material.browser.selected', {id: material.ZaliavosID});
            //   window.open(link, '_blank');
            // }
            $rootScope.$broadcast('openNewTab', [material])
        }

        $scope.$m = {
            editable: false,
            toggleEdit: function () {
                $scope.$m.editable = !$scope.$m.editable;
            },
            save: function () {
                $scope.loading = true;

                var _function = {
                    product: function () {
                        var defer = $q.defer();
                        var _updateModel = {
                            MatavimoVntID: $scope.product.MatavimoVntID,
                            Pavadinimas: $scope.product.Pavadinimas,
                            Statusas: $scope.product.Statusas,
                            Sudetingumas: $scope.product.Sudetingumas,
                            Tipas: $scope.product.Tipas,
                            Foto: 1
                        };
                        api.product.update($scope.product.ID, _updateModel,
                            function (err, res) {
                                if (err) return Notificator.alert("API Klaida", "Klaida atnaujinant produktą")
                                defer.resolve(res);
                            })
                        return defer.promise;
                    },
                    storage: function () {
                        var defer = $q.defer();
                        if ($scope.product.storage.ID) {
                            api.product.updateStorage($scope.product.storage.ID, $scope.product.storage,
                                function (err, res) {
                                    if (err) return Notificator.alert("API Klaida", "Klaida atnaujinant laikymo sąlygas")
                                    defer.resolve(res);
                                })
                        } else {
                            $scope.product.storage.PatiekaloID = $scope.product.ID;
                            api.product.createStorage($scope.product.ID, $scope.product.storage,
                                function (err, res) {
                                    if (err) return Notificator.alert("API Klaida", "Klaida kuriant laikymo sąlygas")
                                    defer.resolve(res);
                                }
                            )
                        }
                        return defer.promise;
                    },
                    sticker: function () {
                        var defer = $q.defer();
                        $scope.product.sticker.Patiekalo_ID = $scope.product.ID;
                        _.each(_.keys($scope.product.sticker), function (key) {
                            if (key != 'Patiekalo_ID' && key != 'Aprasymas') {
                                $scope.product.sticker[key] = $scope.product.sticker[key] === true || $scope.product.sticker[key] === 1 ? 1 : 0
                            }
                        });
                        api.product.updateSticker($scope.product.ID, $scope.product.sticker,
                            function (err, res) {
                                if (err) return Notificator.alert("API Klaida " + err.status, "Klaida atnaujinant lipduką")
                                defer.resolve(res);
                            })

                        return defer.promise;
                    }
                }

                $q.all([
                    _function.product(),
                    _function.storage(),
                    _function.sticker()
                ]).then(
                    function (result) {
                        $scope.$m.toggleEdit();
                        Notificator.toast('Pakeitimai išsaugoti');
                        init();
                    }
                )
            },
            cancelEdit: function () {
                $scope.$m.toggleEdit();
            }
        };



        var init = function () {
            $scope.loading = true;
            api.product.one($stateParams.id, function (err, res) {
                if (err) console.error(err);

                $scope.product = res;
                api.other.mu(function (err, res) {
                    if (err) console.error(err);
                    $scope.units = res.data;
                    $scope.product.unit = _.find(res.data, function (unit) {
                        return unit.ID === $scope.product.MatavimoVntID
                    })
                    $scope.calculations.run($scope.product.calculation);
                    api.product.types(function (err, res) {
                        if (err) console.error(err);
                        $scope.types = res;
                        $scope.product.type = _.find(res, function (type) {
                            return type.ID === $scope.product.Tipas
                        })
                        api.product.statuses(function (err, res) {
                            if (err) console.error(err);
                            $scope.statuses = res;
                            $scope.product.status = _.find(res, function (stat) {
                                return stat.ID === $scope.product.Statusas
                            })
                            __convertBools();
                            $scope.technology.reorder();
                            $scope.loading = false;
                        })
                    })
                })

            })
        }

        $scope.calculations = {
            zerofy: function () {
                $scope.calculations.rieb = 0;
                $scope.calculations.balt = 0;
                $scope.calculations.angl = 0;
                $scope.calculations.skaid = 0;
                $scope.calculations.druska = 0;
                $scope.calculations.cukrus = 0;
                $scope.calculations.gyv = 0;
                $scope.calculations.aug = 0;
                $scope.calculations.brutto = 0;
                $scope.calculations.kcal = 0;
            },
            run: function (array) {
                $scope.calculations.zerofy();
                _.each(array, function (_c) {
                    $scope.calculations.rieb += _c.Riebalai;
                    $scope.calculations.balt += _c.Baltymai;
                    $scope.calculations.angl += _c.Angliavandeniai;
                    $scope.calculations.skaid += _c.Skaidulos;
                    $scope.calculations.druska += _c.Druskos;
                    $scope.calculations.cukrus += _c.Cukrus;
                    $scope.calculations.gyv += _c.Gyvuline;
                    $scope.calculations.aug += _c.Augaline;
                    $scope.calculations.brutto += _c.Netto;
                    $scope.calculations.kcal += _c.Kcal;
                })

                _.each(_.keys($scope.calculations), function (key) {
                    if (typeof $scope.calculations[key] != 'function') {
                        $scope.calculations[key] = Number($scope.calculations[key].toFixed(2));
                    }
                })
                $scope.calculations.gyv = Math.floor($scope.calculations.gyv / $scope.product.calculation.length);
                $scope.calculations.aug = Math.floor($scope.calculations.aug / $scope.product.calculation.length);

                $scope.chartData.series[0].values[0] = $scope.calculations.angl;
                $scope.chartData.series[1].values[0] = $scope.calculations.balt;
                $scope.chartData.series[2].values[0] = $scope.calculations.rieb;
            }
        }

        $scope.currentTabId = 0;
        // $scope.saveEdit = function () {

        var __convertBools = function () {
            _.each(_.keys($scope.product.sticker), function (key) {
                if (key != 'Patiekalo_ID' && key != 'Aprasymas') {
                    $scope.product.sticker[key] = $scope.product.sticker[key] === true || $scope.product.sticker[key] === 1 ? true : false
                }
            })

            _.each($scope.product.calculation, function (c) {
                c.Max1 = c.Max1 === 1 || c.Max1 === true ? true : false;
                c.NuvirimasKcal = c.NuvirimasKcal === 1 || c.NuvirimasKcal === true ? true : false;
            })
        }

        $scope.technology = {
            editable: false,
            edit: function () {
                $scope.technology.editable = !$scope.technology.editable
            },
            add: function () {
                $scope.technology.editable = true;
                var template = {
                    Aprasymas: "",
                    BaroID: 1,
                    Eiliskumas: $scope.product.technology.length + 1,
                    PatiekaloID: $scope.product.ID,
                    new: true
                };
                $scope.product.technology.push(template);
            },
            delete: function (id) {
                api.product.technology.delete(id,
                    function (err, res) {
                        console.warn(err);
                        if (err) return Notificator.toast("Klaida");
						
                        var __IDS = _.pluck($scope.product.technology, 'ID');
                        var __IDX = __IDS.indexOf(id);
                        $scope.product.technology.splice(__IDX, 1);
                        __convertBools();
                        $scope.calculations.run($scope.product.calculation);
                    }
                )
            },
            reorder: function () {
                $scope.product.technology = $filter('orderBy')($scope.product.technology, 'Eiliskumas', false);
            },
            save: function () {
                var _toCreate = _.filter($scope.product.technology, function (t) {
                    return t.new
                });
                var _toUpdate = _.filter($scope.product.technology, function (t) {
                    return !t.new
                });

                var _stack = [];
                _.each(_toCreate, function (NEW_TECH) {
                    var pushPromise = function () {
                        var defer = $q.defer();
                        NEW_TECH.new = undefined;
                        api.product.technology.create($scope.product.ID, NEW_TECH,
                            function (err, res) {
                                if (err) console.error(err);
                                defer.resolve(res);
                            }
                        )
                        return defer.promise;
                    }
                    _stack.push(pushPromise());
                })
                _.each(_toUpdate, function (UPDATE_TECH) {
                    var pushPromise = function () {
                        var defer = $q.defer();
                        UPDATE_TECH.new = undefined;
                        api.product.technology.update(UPDATE_TECH.ID, UPDATE_TECH,
                            function (err, res) {
                                if (err) console.error(err);
                                defer.resolve(res);
                            }
                        )
                        return defer.promise;
                    }
                    _stack.push(pushPromise());
                });
                $q.all(_stack)
                    .then(function (result) {
                        $scope.technology.editable = false;
                        $scope.technology.reorder();
                        Notificator.toast("Technologijos atnaujintos")
                    })
            }
        }
        // }

        $scope.calcEdit = {
            enabled: true,
            toggle: function () {
                $scope.calcEdit.enabled = !$scope.calcEdit.enabled;
            },
            delete: function (ID) {
                api.product.deleteCalculation(ID,
                    function (err, res) {
                        if (err) console.error(err);
                        if (err) return Notificator.toast("Klaida")
                        var __IDS = _.pluck($scope.product.calculation, 'ID');
                        var __IDX = __IDS.indexOf(ID);
                        $scope.product.calculation.splice(__IDX, 1);
                        __convertBools();
                        $scope.calculations.run($scope.product.calculation);
                    }
                )
            },
            change: function (calcItem) {
                var __mapModel = {
                    "RawMaterialID": calcItem.ZaliavosID,
                    "Drifting": calcItem.Nuvirimas,
                    "Netto": calcItem.Brutto,
                    "RawMaterialType": calcItem.ZaliavosTipas,
                    "UOM": calcItem.MatavimoVntID,
                    "Max1": calcItem.Max1 ? 1 : 0,
                    "DriftingKcal": calcItem.NuvirimasKcal ? 1 : 0
                }

                api.product.updateCalculation(
                    calcItem.ID,
                    __mapModel,
                    function (err, res) {
                        console.warn(err);
                        if (err) return Notificator.toast("Klaida.")
							
                        var __IDS = _.pluck($scope.product.calculation, 'ID');
                        var __IDX = __IDS.indexOf(calcItem.ID);
                        $scope.product.calculation[__IDX] = res.data[0];
                        __convertBools();
                        $scope.calculations.run($scope.product.calculation);
                    }
                )
            }
        }

        api.other.bars(function (err, res) {
            if (err) return console.error(err);
            $scope.bars = res.data;
        })

        $scope.getBarName = function (barID) {
            var __thisBar = _.find($scope.bars, function (x) {
                return x.ID === barID
            });
            if (__thisBar) {
                return __thisBar.Kodas
            } else {
                return barID;
            }
        }

        init();
    });

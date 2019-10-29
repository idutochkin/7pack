'use strict';

/**
 * @ngdoc function
 * @name erp7App.controller:ProductionMenuPlaningCtrl
 * @description
 * # ProductionMenuPlaningCtrl
 * Controller of the erp7App
 */
angular.module('erp7App')
    .controller('ProductionMenuPlaningCtrl', function ($scope, $mdDialog, charts, $stateParams, api, Notificator, $q) {
        var rCanv = {
            canv: document.getElementById('rightCanvas'),
            ctx: document.getElementById('rightCanvas').getContext('2d')
        };
        var lCanv = {
            canv: document.getElementById('leftCanvas'),
            ctx: document.getElementById('leftCanvas').getContext('2d')
        };
        $scope.calendar = {
            date: moment(),
            change: function () {
                init($scope.calendar.date);
            },
            go: function (_dir) {
                console.info(_dir);
                switch (_dir) {
                    case 'next':
                        $scope.calendar.date = moment($scope.calendar.date).add(1, 'day');
                        init($scope.calendar.date);
                        break;
                    case 'prev':
                        $scope.calendar.date = moment($scope.calendar.date).subtract(1, 'day');
                        init($scope.calendar.date);
                        break;
                };

            }
        }
        $scope.props = {
            name: 'Grožio',
            status: 1,
            res: [{
                st: 1,
                name: 'Aktyvus'
            },
            {
                st: 0,
                name: 'Neaktyvus'
            }
            ]
        }
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

        $scope.edit = {
            enabled: false,
            enable: function () {
                $scope.edit.enabled = true;
            },
            cancel: function () {
                $scope.edit.enabled = false;
                init($scope.calendar.date)
            },
            save: function () {
                api.sets.update(
                    $scope.set.ID,
                    $scope.set.Pavadinimas,
                    $scope.set.Statusas,
                    $scope.set.Sablono_ID,
                    function (err, res) {
                        if (err) return Notificator.alert("Klaida " + err.status, err.data.Message);
                        init($scope.calendar.date)
                    }
                )
            }
        }

        $scope.getStatusName = function (id) {
            var statusModel = _.find($scope.statuses, function (x) {
                return x.ID === id
            })
            if (statusModel) {
                return statusModel.Pavadinimas;
            } else {
                return 'statusas ' + id
            }
        }

        $scope.getImageName = function (id) {
            var image = _.find($scope.images, function (x) {
                return x.ID === id
            });

            return image ? image.Failo_Pavadinimas : 'image ' + id;
        }

        var init = function (date) {
            $scope.loading = true;
            api.sets.one(
                $stateParams.id,
                moment(date).format("YYYY-MM-DD"),
                function (err, res) {
                    if (err) return Notificator.alert("Klaida " + err.status, err.data.Message)
                    $scope.set = res;
                    // console.log($scope.set);
                    recalculate();
                    api.other.mu(function (err, res) {
                        $scope.units = res.data;
                        $scope.loading = false;
                    })
                    api.sets.statuses(function (err, res) {
                        if (err) return Notificator.toast("Klaida gaunant statusus " + err.status);
                        $scope.statuses = res.data;
                    })
                    api.sets.images(function (err, res) {
                        if (err) return Notificator.toast("Klaida gaunant statusus " + err.status);
                        $scope.images = res.data;
                    })
                }
            )
        }

        init(moment());

        var recalculate = function () {
            $scope.calculations = {};
            if ($scope.set.menu) {
                _.each($scope.set.menu, function (menuItem) {
                    _.each(_.keys(menuItem), function (key) {
                        if (typeof menuItem[key] === "number") {
                            var temp = menuItem[key].toFixed(2);
                            menuItem[key] = Number(temp);
                            if (!$scope.calculations[key]) $scope.calculations[key] = 0;
                            $scope.calculations[key] += Number(temp)
                        }
                    })
                })
                _.each(_.keys($scope.calculations), function (key) {
                    var temp = $scope.calculations[key].toFixed(2);
                    $scope.calculations[key] = Number(temp);
                })
                $scope.chartData.series[0].values[0] = $scope.calculations.Angliavandeniai;
                $scope.chartData.series[1].values[0] = $scope.calculations.Baltymai;
                $scope.chartData.series[2].values[0] = $scope.calculations.Riebalai;

                var aug = $scope.calculations.Augaline / $scope.set.menu.length;
                var gyv = $scope.calculations.Gyvuline / $scope.set.menu.length;
                $scope.calculations.Augaline = aug.toFixed(0);
                $scope.calculations.Gyvuline = gyv.toFixed(0);

                var macroelements = {
                    Angliavandeniai: $scope.calculations.Angliavandeniai,
                    Baltymai: $scope.calculations.Baltymai,
                    Riebalai: $scope.calculations.Riebalai
                };
                var ag = {
                    Augaline: $scope.calculations.Augaline,
                    Gyvuline: $scope.calculations.Gyvuline
                };

                charts.drawLeftChart(lCanv.ctx, lCanv.canv, macroelements);
                charts.drawRightChart(rCanv.ctx, rCanv.canv, ag);

                // console.log($scope.calculations)

            }
        }

        $scope.copy = function () {
            $mdDialog.show({
                controller: 'MenuCopyCtrl',
                templateUrl: 'views/production/menu-copy.html',
                clickOutsideToClose: true,
            });
        }

        $scope.addItem = function () {
            $mdDialog.show({
                controller: 'ProductionAddMenuItemCtrl',
                templateUrl: 'views/production/add-menu-item-modal.html',
                clickOutsideToClose: true,
            }).then(function (selectedItem) {
                if (!selectedItem) return;
                api.sets.menu.add(
                    $scope.set.ID, {
                        "Data": moment($scope.calendar.date).format("YYYY-MM-DD"),
                        "Rinkinys": $scope.set.ID,
                        "Patiekalas": selectedItem.ID,
                        "Limitaskcal": 10,
                        "ValgymoEtapas": 1,
                        "MatavimoVnt": 1
                    },
                    function (err, res) {
                        if (err) {
                            Notificator.toast("Klaida");
                            init(moment($scope.calendar.date).format("YYYY-MM-DD"));
                        }
                        // console.log(res);
                        Notificator.toast("Patiekalas pridėtas");
                        init(moment($scope.calendar.date).format("YYYY-MM-DD"));
                    }
                )
            });
        };

        $scope.updateOnEnter = function (event, item) {
            if (event.keyCode == 13) {
                $scope.updateMenuItem(item);
            }
        };

        $scope.updateMenuItem = function (item) {
            if (!item.ID) return;
            // console.log('item', item);
            var itemID = item.ID;
            api.sets.menu.update(
                item.ID,
                item,
                function (err, res) {
                    if (err) return Notificator.alert("Klaida " + err.status, err.data.Message);
                    init($scope.calendar.date);
                    // console.log(res);
                    var _ids = _.pluck($scope.set.menu, 'ID');
                    var _idx = _ids.indexOf(itemID);
                    // console.log(_ids, _idx)
                    $scope.set.menu[_idx] = res.data[0];
                    Notificator.toast("Išsaugota");
                    recalculate();
                }
            )
        };

        $scope.deleteMenuItems = function () {
            var itemsToDelte = _.filter($scope.set.menu, function (menuItem) {
                return menuItem.selected
            });
            var functionStack = [];
            _.each(itemsToDelte, function (item) {
                var tempFunction = function () {
                    var defer = $q.defer();
                    api.sets.menu.delete(item.ID, function (err, res) {
                        if (err) return defer.reject(err);
                        defer.resolve(res);
                    })
                    return defer.promise
                }
                functionStack.push(tempFunction())
            });
            $q.all(functionStack)
                .then(function (result) {
                    // console.log(result);
                    var toastText = itemsToDelte.length === 1 ? 'Patiekalas ištrintas' : 'Patiekalai ištrinti';
                    Notificator.toast(toastText);
                    init($scope.calendar.date);
                })
        }

        $scope.checkBox = {
            all: false,
            selectAll: function () {
                var state = $scope.checkBox.all;
                _.each($scope.set.menu, function (menuItem) {
                    menuItem.selected = state;
                })
            },
            select: function () {
                $scope.checkBox.all = false;
            },
            isAnySelected: function () {
                if (!$scope.set) return false;
                if (!$scope.set.menu[0]) return false;
                var is = false;
                _.each($scope.set.menu, function (item) {
                    if (item.selected) is = true;
                });
                return is;
            }
        }
    })
    .controller('MenuCopyCtrl', function ($scope) {
        $scope.date = moment();
    });

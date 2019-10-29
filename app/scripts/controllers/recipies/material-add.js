'use strict';

/**
 * @ngdoc function
 * @name erp7App.controller:RecepiesMaterialAddCtrl
 * @description
 * # RecepiesMaterialAddCtrl
 * Controller of the erp7App
 */
angular.module('erp7App')
    .controller('RecepiesMaterialAddCtrl', function ($scope, $q, $mdDialog, api) {
        $scope.close = function (item) {
            $mdDialog.hide(item);
        };

        $scope.limit = 6;

        var materials, products,
            materialsSelected = true,
            productsSelected = false;

        $q.all([fetchAllMaterials(), fetchAllSemiFinished()])
            .then(function (mat) {
                materials = mat[0];
                products = mat[1];
                $scope.materials = materials;
                init();
            })
            .catch(function (err) {
                console.error(err);
            });

        $scope.search = function (text) {
            var collection = materialsSelected ? materials : products;

            if (text) {
                $scope.materials = _.filter(collection, function (mat) {
                    return mat.Pavadinimas.toLowerCase().includes(text.trim().toLowerCase())
                });
            } else {
                $scope.materials = collection;
            }
            init();
        }

        $scope.move = function (dir) {
            switch (dir.toLowerCase()) {
                case 'forward':
                    if ($scope.start < $scope.materials.length) {
                        $scope.start += $scope.limit;
                        if (!$scope.canGoBack) {
                            $scope.canGoBack = true;
                        }
                        if ($scope.start + $scope.limit >= $scope.materials.length) {
                            $scope.canGoForward = false;
                        }
                    }
                    break;
                case 'back':
                    if ($scope.start > 0) {
                        $scope.start -= $scope.limit;
                        if (!$scope.canGoForward) {
                            $scope.canGoForward = true;
                        }
                        if ($scope.start <= 0) {
                            $scope.canGoBack = false;
                        }
                    }
                    break;

                default:
                    break;
            }
        }

        $scope.selectType = function (type) {
            switch (type.toLowerCase()) {
                case 'materials':
                    materialsSelected = true;
                    productsSelected = false;
                    $scope.search($scope.searchText);
                    break;
                case 'products':
                    materialsSelected = false;
                    productsSelected = true;
                    $scope.search($scope.searchText);
                    break;
            }
            init();
        };

        function fetchAllMaterials() {
            return $q(function (resolve, reject) {
                api.material.all(undefined, function (err, res) {
                    if (err) reject(err);

                    res.data.map(function (x) {
                        if (!(x.Angliavandeniai && x.Baltymai && x.Riebalai)) {
                            x.Angliavandeniai = 0;
                            x.Baltymai = 0;
                            x.Riebalai = 0;
                            x.Macroelements = 0;
                        } else {
                            x.Macroelements = x.Angliavandeniai + x.Baltymai + x.Riebalai;
                        }

                        if (!(x.Augaline && x.Gyvuline)) {
                            x.Augaline = 0;
                            x.Gyvuline = 0;
                            x.Ag = 0;
                        } else {
                            x.Ag = x.Augaline + x.Gyvuline;
                        }

                        x.leftChartData = {
                            rie: {
                                "left": "0",
                                "width": x.Macroelements !== 0 ? x.Riebalai * 100 / x.Macroelements + "%" : "33%"
                            },
                            ang: {
                                "left": x.Macroelements !== 0 ? x.Riebalai * 100 / x.Macroelements + "%" : "33%",
                                "width": x.Macroelements !== 0 ? x.Angliavandeniai * 100 / x.Macroelements + "%" : "33%"
                            },
                            bal: {
                                "left": x.Macroelements !== 0 ? x.Angliavandeniai * 100 / x.Macroelements + x.Riebalai * 100 / x.Macroelements + "%" : "66%",
                                "width": x.Macroelements !== 0 ? x.Baltymai * 100 / x.Macroelements + "%" : "34%"
                            }
                        };

                        x.rightChartData = {
                            aug: {
                                "left": "0",
                                "width": x.Ag !== 0 ? x.Augaline * 100 / x.Ag + "%" : "50%"
                            },
                            gyv: {
                                "left": x.Ag !== 0 ? x.Augaline * 100 / x.Ag + "%" : "50%",
                                "width": x.Ag !== 0 ? x.Gyvuline * 100 / x.Ag + "%" : "50%"
                            }
                        };
                        x.Tipas = 'Žaliavos';
                    });
                    return resolve(res.data);
                })
            });
        }

        function fetchAllSemiFinished() {
            return $q(function (resolve, reject) {
                api.product.semiFinished(function (err, res) {
                    if (err) return reject(err);

                    res.data.map(function (x) {
                        if (!(x.Angliavandeniai && x.Baltymai && x.Riebalai)) {
                            x.Angliavandeniai = 0;
                            x.Baltymai = 0;
                            x.Riebalai = 0;
                            x.Macroelements = 0;
                        } else {
                            x.Macroelements = x.Angliavandeniai + x.Baltymai + x.Riebalai;
                        }

                        if (!(x.Augaline && x.Gyvuline)) {
                            x.Augaline = 0;
                            x.Gyvuline = 0;
                            x.Ag = 0;
                        } else {
                            x.Ag = x.Augaline + x.Gyvuline;
                        }

                        x.leftChartData = {
                            rie: {
                                "left": "0",
                                "width": x.Macroelements !== 0 ? x.Riebalai * 100 / x.Macroelements + "%" : "33%"
                            },
                            ang: {
                                "left": x.Macroelements !== 0 ? x.Riebalai * 100 / x.Macroelements + "%" : "33%",
                                "width": x.Macroelements !== 0 ? x.Angliavandeniai * 100 / x.Macroelements + "%" : "33%"
                            },
                            bal: {
                                "left": x.Macroelements !== 0 ? x.Angliavandeniai * 100 / x.Macroelements + x.Riebalai * 100 / x.Macroelements + "%" : "66%",
                                "width": x.Macroelements !== 0 ? x.Baltymai * 100 / x.Macroelements + "%" : "34%"
                            }
                        };

                        x.rightChartData = {
                            aug: {
                                "left": "0",
                                "width": x.Ag !== 0 ? x.Augaline * 100 / x.Ag + "%" : "50%"
                            },
                            gyv: {
                                "left": x.Ag !== 0 ? x.Augaline * 100 / x.Ag + "%" : "50%",
                                "width": x.Ag !== 0 ? x.Gyvuline * 100 / x.Ag + "%" : "50%"
                            }
                        };
                    });
                    return resolve(res.data);
                })
            });
        }

        function init() {
            $scope.canGoForward = true;
            $scope.canGoBack = false;
            $scope.start = 0;
            if ($scope.materials && $scope.start + $scope.limit >= $scope.materials.length) {
                $scope.canGoForward = false;
            }
        }
    });

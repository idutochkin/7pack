'use strict';

/**
 * @ngdoc function
 * @name erp7App.controller:RecipiesBrowserCtrl
 * @description
 * # RecipiesBrowserCtrl
 * Controller of the erp7App
 */
angular.module('erp7App.recipies')
    .controller('RecipiesBrowserCtrl', function ($scope, $timeout, $state, api, recipesTabs, $mdDialog, $rootScope) {
        $scope.$browser = {
            expanded: true,
            currentClass: 'browser_wrap_expanded',
            classes: {
                default: 'browser_wrap_expanded',
                mini: 'browser_wrap_mini'
            },
            toggle: function () {
                if ($scope.$browser.expanded) {
                    $scope.$browser.currentClass = $scope.$browser.classes.mini;
                } else {
                    $scope.$browser.currentClass = $scope.$browser.classes.default;
                }
                $scope.$browser.expanded = !$scope.$browser.expanded;
            },
            minimise: function () {
                $timeout(function () {
                    $scope.$browser.currentClass = $scope.$browser.classes.mini;
                    $scope.$browser.expanded = false;
                }, 0);
            },
            uiViewActive: true,
            openChild: function (id) {
                $scope.$browser.uiViewActive = false;
                $scope.$browser.minimise();
                $timeout(function () {
                    $state.go('recipies.browser.selected', ({
                        id: id
                    }));
                    $scope.$browser.uiViewActive = true;
                }, 500);

            }
        }

        var PAGE_SIZE = 30;

        var loadAll = function (page) {
            var filter = {};
            filter.from = page * PAGE_SIZE;
            filter.qty = PAGE_SIZE;

            // Solution for now. When 'Finished' api will be finihsed, change it
            api.product.all(filter, function (err, res) {
                if (err) return console.error(err);
                $scope.products = res.data.filter(function (x) {
                    return x.Tipas == "Patiekalas";
                });
            });
        };
        $scope.search = function (input) {
            if (!input) return loadAll($scope.CURRENT_PAGE);
            if (input.length > 2) {
                api.product.search(input, function (err, res) {
                    if (err) return console.log(err);
                    $scope.products = res.data;
                    console.log(res.data);
                })
            }
        };
        $scope.input = '';
        $scope.cleanSearch = function () {
            $scope.input = '';
            loadAll($scope.CURRENT_PAGE);
        }
        $scope.CURRENT_PAGE = -1;
        $scope.nextPage = function () {
            $scope.CURRENT_PAGE++;
            loadAll($scope.CURRENT_PAGE);
        }
        $scope.prevPage = function () {
            $scope.CURRENT_PAGE--;
            loadAll($scope.CURRENT_PAGE);
        }
        $scope.nextPage();

        $scope.createProduct = function () {
            $mdDialog.show({
                templateUrl: 'views/recipies/create-product.html',
                controller: 'RecipiesCreateProductCtrl',
                clickOutsideToClose: false,
            }).then(function (data) {
                if (data.id) {
                    $state.go('recipies.browser.selected', {
                        id: data.id
                    })
                }
            })
        };

        var loadSemi = function () {
            api.product.semiFinished(function (err, prod) {
                if (err) return console.error(err);
                $scope.semiFin = prod.data;
            })
        }

        loadSemi();

        $scope.tabs = {
            limit: 7,
            data: recipesTabs.tabs,
            add: function (content) {
                if (content.ZaliavosID) content.ID = content.ZaliavosID
                var _match = _.find(recipesTabs.tabs, function (t) {
                    return t.ID === content.ID
                });
                if (!_match) {
                    recipesTabs.tabs.push(content);
                    if (recipesTabs.tabs.length > $scope.tabs.limit) recipesTabs.tabs.splice(0, 1);
                }
            },
            remove: function (ID) {
                var _IDS = _.pluck(recipesTabs.tabs, 'ID');
                recipesTabs.tabs.splice(_IDS.indexOf(ID), 1);
            },
            isSelected: function (id) {
                // console.log(id, $stateParams)
                // if(id == Number($stateParams.id)){
                //   return 'tabs-selected';
                // } else  {
                //   return '';
                // }

            },
            go: function (item) {
                console.log(item)
                if (item.ZaliavosTipas) {
                    switch (item.ZaliavosTipas) {
                        case 1:
                            $state.go('recipies.browser.material', {
                                id: item.ZaliavosID
                            })
                            break;
                        case 2:
                            $state.go('recipies.browser.selected', {
                                id: item.ZaliavosID
                            })
                            break;
                    }
                } else {
                    $state.go('recipies.browser.selected', {
                        id: item.ID
                    })
                }
            }
        }

        $rootScope.$on('openNewTab', function (event, content) {
            console.log(content)
            $scope.tabs.add(content[0]);
            $scope.tabs.go(content[0])
        })
    });

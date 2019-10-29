'use strict';

/**
 * @ngdoc function
 * @name erp7App.controller:ProductionAddMenuItemCtrl
 * @description
 * # ProductionAddMenuItemCtrl
 * Controller of the erp7App
 */
angular.module('erp7App')
  .controller('ProductionAddMenuItemCtrl', function (api, $scope, $mdDialog, $timeout, Notificator) {
    $scope.loading = true;
    $scope.searchInput = '';
    var init = function () {
      api.sets.materials(function (err, res){
        if(err) return Notificator.alert("Klaida " + err.status || 'x01', err.data || 'unknown')
        $scope.results = res.data;
        console.log(res);
        $scope.loading = false;
      })
    }

    $scope.clean = function () {
      $scope.searchInput = '';
      // init();
    }

    $scope.search = function (input) {
      if(!input) return init();
      if(input.length < 2) return;
      $scope.loading = true;
      $timeout(
        function() {
          if(input === $scope.searchInput){
            api.product.search(input, function (err, res){
              console.log(res);
              $scope.results = res.data;
              $scope.loading = false;
            }, 650)
          }
        }
      )
    };

    $scope.select = function (item) {
      $mdDialog.hide(item);
    }

    init();
  });

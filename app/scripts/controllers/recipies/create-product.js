'use strict';

/**
 * @ngdoc function
 * @name erp7App.controller:RecipiesCreateProductCtrl
 * @description
 * # RecipiesCreateProductCtrl
 * Controller of the erp7App
 */
angular.module('erp7App')
  .controller('RecipiesCreateProductCtrl', function (api, $scope, $mdDialog, Notificator) {
    $scope.product = {
      MatavimoVntID : 0,
      Pavadinimas : '',
      Statusas : 0,
      Sudetingumas : 1,
      Tipas : 0,
      Foto : 1
    };
    api.product.types(function(err, res){
      if(err) console.log(err);
      $scope.types = res;
      api.product.statuses(function(err, res){
        if(err) console.log(err);
        $scope.statuses = res;
        api.other.mu(function(err, res){
          if(err) console.log(err);
          $scope.units = res.data;
          console.log($scope);
        })
        
      })
    });
    $scope.create = function (product){
      api.product.create(product, function(err, res){
        if(err) return Notificator.toast("Klaida");
        Notificator.toast("Receptas sukurtas");
        $mdDialog.hide({id:res.data});
      })
    };
    $scope.close = function(){
      $mdDialog.hide({});
    }
  });

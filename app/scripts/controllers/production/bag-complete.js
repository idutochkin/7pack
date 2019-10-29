'use strict';

/**
 * @ngdoc function
 * @name erp7App.controller:ProductionBagCompleteCtrl
 * @description
 * # ProductionBagCompleteCtrl
 * Controller of the erp7App
 */
angular.module('erp7App')
  .controller('ProductionBagCompleteCtrl', function (api, $scope, Notificator) {
    $scope.barcodeInput = "";
    $scope.tableData = [];
    $scope.complete = function(barcode){
      if(!barcode) return;
      api.orders.completeBag(barcode,
        function (err, res){
          console.log(err, res)
          $scope.barcodeInput = "";
          if(err) return Notificator.toast("Klaida " + err.status || 'x01');
          console.log(res);
          $scope.sum = {
            Viso : 0,
            Sukomplektuota : 0
          }
          $scope.tableData = res.data;
          _.each($scope.tableData, function (data){
            $scope.sum.Viso += data.Viso;
            $scope.sum.Sukomplektuota += data.Sukomplektuota
          })
          Notificator.toast("Sukomplektuota");
        }
      )
    }
  });

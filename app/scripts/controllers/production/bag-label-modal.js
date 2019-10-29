'use strict';

/**
 * @ngdoc function
 * @name erp7App.controller:ProducionBagLabelModalCtrl
 * @description
 * # ProducionBagLabelModalCtrl
 * Controller of the erp7App
 */
angular.module('erp7App')
  .controller('ProductionBagLabelModalCtrl', function ($scope, $mdDialog, api, $state, dateSelected) {
    $scope.date = null;
    $scope.text = "Pasirinkite dieną";
    $scope.next = false;
    $scope.cancel = function () {
      $mdDialog.hide();
    }
    $scope.goNext = function() {
      var url = $state.href('terminal.bagLabelPrint', {date : moment($scope.date).format("YYYY-MM-DD")});
      window.open(url, '_blank');
    }
    $scope.change = function () {
      var _formated = moment($scope.date).format("YYYY-MM-DD");
      api.orders.getAll (_formated, function(err, res){
        console.log(res);
        if (err) {
          $scope.text = "Pasirinktą dieną krepšių nėra";
          $scope.next = false;
        }
        else {
          var _bags = res.data;
          if(_bags && _bags.length > 0){
            $scope.text = "Pasirinktą dieną yra " + _bags.length + " krepšių(-iai)." ;
            $scope.next = true;
          }
          else{
            $scope.text = "Pasirinktą dieną krepšių nėra";
            $scope.next = false;
          }
        }
      })
    }
    if(dateSelected){
      $scope.date = dateSelected;
    }
  });

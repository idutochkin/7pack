'use strict';

/**
 * @ngdoc function
 * @name erp7App.controller:ProductionQualityCtrl
 * @description
 * # ProductionQualityCtrl
 * Controller of the erp7App
 */
angular.module('erp7App')
  .controller('ProductionQualityCtrl', function ($scope, api, $timeout, Notificator) {
    $scope.input = {
      text : '',
      go : function (input){
        var _currentInput = input;
        console.info(_currentInput, $scope.input.text);
        $timeout(function () {
          if(_currentInput === $scope.input.text){
            api.user.getUserData(function(userData){
              var __user = userData[0];
              console.log(userData);
              api.drivers.quality(_currentInput, __user.ID, function (err, res){
                $scope.input.text = '';
                if(err) return Notificator.toast("Klaida");
                Notificator.toast("OK")
              })
            })
          }
        }, 0)
        
      }
    }
  });

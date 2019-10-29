'use strict';

/**
 * @ngdoc function
 * @name erp7App.controller:ProductionBagCheckCtrl
 * @description
 * # ProductionBagCheckCtrl
 * Controller of the erp7App
 */
angular.module('erp7App')
  .controller('ProductionBagCheckCtrl', function ($scope, orders, driver, Notificator, api, $interval, $mdDialog, currentDay, $timeout) {
    $scope.playSound = function (barcode) {
      //console.debug("PLAY SOUND")
      var _audio_ok = document.getElementById("audio_ok");
      var _audio_err = document.getElementById("audio_err");

      var finishKey = "APPFINISH";
      if (barcode == finishKey) {
        return $mdDialog.hide();
      }

      var bag = _.find($scope.orders, function (o) {
        return o.Barcode == barcode;
      })

      if (bag && !bag.checked) {

        api.drivers.take(driver.ID, bag.Barcode,
          function (err, res) {
            if (!err) {
              bag.checked = true;
              _audio_ok.play();
              countLeft();
            }
            else {
              console.log(err)
              Notificator.toast("Klaida: " + err.data.Message);
              _audio_err.play();
            }
          })
      }
      else {
        Notificator.toast("Nėra tokio krepšio, arba jis jau paimtas");
        _audio_err.play();
      }
      $scope.bInput = '';
    }

    $scope.inputChange = function (textInput) {
      $timeout(
        function () {
          // console.log(textInput + " vs " + $scope.scan.input)
          // console.log(textInput == $scope.scan.input)
          if (textInput == $scope.bInput) {
            // $scope.scan.go($scope.scan.input);
            // $scope.scan.input = "";
            $scope.playSound(textInput);
          }
        }, 800)
    }

    var countLeft = function () {
      console.log(currentDay);
      api.drivers.bagsByDate($scope.driver.ID, moment(currentDay.Einamoji_Diena),
        function (err, res) {
          $scope.orders = res.data;
          var _notTaken = _.filter($scope.orders, function (_ord) {
            return _ord.Isvezta ? false : true;
          })
          if (_notTaken) {
            $scope.count = _notTaken.length;
          }
          else {
            $scope.count = 0;
          }

        })
    }

    console.log(orders);
    //$scope.orders = orders;
    $scope.driver = driver;
    // $scope.count = $scope.orders.length;

    countLeft();

    $interval(
      function () {
        var __target = document.getElementById("barcodeInput");
        if (__target) {
          __target.focus();
        }
        else {
          $interval.cancel();
        }

      }, 1000
    );

  });

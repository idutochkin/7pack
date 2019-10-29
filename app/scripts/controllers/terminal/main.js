'use strict';

/**
 * @ngdoc function
 * @name erp7App.controller:TerminalMainCtrl
 * @description
 * # TerminalMainCtrl
 * Controller of the erp7App
 */
angular.module('erp7App')
  .controller('TerminalMainCtrl', function ($scope, $timeout, md5, api, $mdDialog, $interval) {
    $scope.scan = {
      input : '',
      go : function (input) {
        $scope.state.validateInput(input);
      },
      change : function (input) {
        console.log("change detected " + input);
        $timeout(
          function () {
            console.log(input + " vs " + $scope.scan.input)
            console.log(input == $scope.scan.input)
            if(input == $scope.scan.input){
              $scope.scan.go($scope.scan.input);
              $scope.scan.input = "";
            }
          }, 800
        )
      }
    };

    $scope.state = {
      text : 'skanuokite aplikacijos barcode (1)',
      current : 'home', // home, app_bagReturn, app_timeTrack
      warning : '',
      showtable : false,
      set : function (stateId, text){
        $scope.state.current = stateId;
        $scope.state.text = text;
      },
      validateInput : function (input) {
        switch ($scope.state.current) {
          case 'home' :
            _inputInterface(input, 
              function(result, isApp){
                console.log(result);
                if(isApp){
                  $scope.state.set(result.state, result.text)
                }
                else{
                  $scope.state.warning = "neteisingas barcode"
                  $timeout(
                    function () {
                      $scope.state.warning = "";
                    }, 3500
                  )
                }
              }
            )
          break;
          case 'app_timeTrack' :
            _inputInterface(input,
              function (result, isApp) {
                if(isApp){
                  $scope.state.set(result.state, result.text);
                }
                else{
                  api.timeTracking.register(result.value, function(err, res){
                    console.log(res)
                    if(err) {
                      $scope.state.warning = "neteisingas id"
                      $timeout(
                        function () {
                          $scope.state.warning = "";
                        }, 3500
                      )
                    }
                    else {
                      $scope.state.warning = res.data[0].FirstName + ' ' + res.data[0].LastName + ' : ' + res.data[0].Type;  
                      $timeout(
                        function () {
                          $scope.state.warning = "";
                        }, 3500
                      )
                    }
                  })
                }
              }
            )
          break;
          case 'app_bagReturn':
            _inputInterface(input,
              function(result, isApp){
                if(isApp){
                  $scope.state.set(result.state, result.text);
                }
                else {
                  __driverBags(result.value);
                }
              }
            )
          break;
        }
      }
    }

    var _inputInterface = function (text, cb){
      var _match = _.find(_lib, function (li) {
        return li.text == text;
      })
      if (_match) {
        cb(_match.action, true);
      }
      else {
        cb({state : 'input', value : text}, false);
      }
    }

    var _lib = [
      {text : "APPSELECT1", action : {state : 'app_bagReturn', value : 1, text :'skanuokite vairuotojo barcode'}}, //6b80567025277d6699e57a1c6010d899
      {text : "APPSELECT2", action : {state : 'app_timeTrack', value : 2, text : 'skanuokite savo id'}}, //a9a1e5de61ff07be92130880f926a704
      {text : "APPFINISH", action : {state : 'home', value : 'return_home', text : 'skanuokite aplikacijos barcode (1)'}} //710b3f50f96e3457cf24a41d048b78e9
    ]

    // var takeBag = function (barcode) {
    //   if(barcode){

    //   }
    //   else {
    //     return;
    //   }
    // }

    var isModalOpen = false;
    var __driverSelected = false;
    var __driverBags = function (input) {
      if(__driverSelected){

      }
      else {
        api.drivers.bags(input,
          function(err, res){
            if(err) return __warn("Blogas vairuotojo ID");
            //if(res.data.length < 1)  return __warn("Vairuotojas neturi krepšių");
            console.log(res);
            var __orders = res.data;
            api.drivers.active(
              function(err, res) {
                var __allDrivers = res.data;
                var thatDriver = _.find(__allDrivers, function(drv){
                  return input == drv.ID
                });
                if(!thatDriver) return __warn("Blogas vairuotojo ID");
                console.log(__allDrivers);
                console.log(thatDriver);
                isModalOpen = true;
                $mdDialog.show({
                  controller : 'ProductionBagCheckCtrl',
                  templateUrl: 'views/production/bag-check-modal.html',
                  clickOutsideToClose:true,
                  locals : {
                    orders : __orders,
                    driver : thatDriver
                  }}
                ).then(
                  function(){
                    isModalOpen = false;
                    $scope.state.set('home', 'skanuokite aplikacijos barcode (1)')
                  }
                    
                  
                )

              }
            )


            
          }
        )
      }
    }

    var __warn = function (text){
      $scope.state.warning = text;
      $timeout(
        function () {
          $scope.state.warning = "";
        }, 3500
      )
    }

    $interval(
      function() {
        if(!isModalOpen){
          var __target = document.getElementById("terminal_input");
          if(__target){
            __target.focus();
          }
          else {
            $interval.cancel();
          }
        }
        
        
      }, 1000
    );
  });

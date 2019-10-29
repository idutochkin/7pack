'use strict';

/**
 * @ngdoc function
 * @name erp7App.controller:TimetrackingRegistrationCtrl
 * @description
 * # TimetrackingRegistrationCtrl
 * Controller of the erp7App
 */
angular.module('erp7App')
  .controller('TimetrackingRegistrationCtrl', function ($scope, $interval, api, Notificator, $timeout) {
    $scope._time = moment().format("HH:mm");
    document.getElementById("idInput").focus();
    $scope.goBack = function() {
      window.history.back();
    };
    $interval(function(){
      $scope._time = moment().format("HH:mm");
      document.getElementById("idInput").focus();
    }, 5000); 

    var _loadEvents = function () {
      api.timeTracking.find(null, null, function(err, res){
        $scope.events = res.data;
        console.log(res)
      })
    }

    $scope.reg = {
      input : '',
      view : {
        show : false,
        name : null,
        type : null,
        time : null
      },
      write : function (id) {
        api.timeTracking.register(id, function(err, res){
          console.log(res);
          $scope.reg.input = '';
          _loadEvents();
          if(err) {
            Notificator.toast("Blogas Vartotojo ID")
            $scope.reg.setName({
              show : true,
              name : "Blogas ID"
            })
          }
          else {
            Notificator.toast("OK. Užregistruota")
            $scope.reg.setName({
              show : true,
              name : "Užregistruota sėkmingai"
            })
          }
        })
      },
      setName : function(model){
        $scope.reg.view = model;
        $timeout(function(){
          $scope.reg.view = {};
        }, 4500)
      }
    }

    var _init = function () {
      _loadEvents();
    }

    _init();
  });

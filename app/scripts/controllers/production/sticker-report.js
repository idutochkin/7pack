'use strict';

/**
 * @ngdoc function
 * @name erp7App.controller:ProductionMaterialSummaryCtrl
 * @description
 * # ProductionMaterialSummaryCtrl
 * Controller of the erp7App
 */
angular.module('erp7App')
  .controller('ProductionStickerReportCtrl', function ($scope, $state, api, Notificator) {
    $scope.calendar = {
      date : moment(),
      display : moment().format("dddd, MMMM Do YYYY"),
      go : function (dir){
        if(dir == 'next'){
          $scope.calendar.date = moment($scope.calendar.date).add(1, 'day');
          $scope.calendar.change();
        } else {
          $scope.calendar.date = moment($scope.calendar.date).subtract(1, 'day');
          $scope.calendar.change();
        }
      },
      change : function () {
        $scope.calendar.display = moment($scope.calendar.date).format("dddd, MMMM Do YYYY");
        load($scope.calendar.date);
      }
    }

    $scope.loading = false;

    var load = function(date){
      $scope.loading = true;
      var formatedDate = moment(date).format("YYYY-MM-DD");
      api.report.sets(formatedDate, function (err,res){
        if(err) return err(err);
        console.log(res);
        $scope.sets = res.data;
        _.each($scope.sets, function(set){
          set.qty = 0;
        })
        $scope.loading = false;
      })
    }

    var err = function(errorModel){
      var loading = false;
      Notificator.alert("Klaida " + errorModel.status , errorModel.data);
      console.error(errorModel);
    }

    $scope.printStickers = function () {
      var data = [];
      _.each($scope.sets, function (set){
        if(set.qty > 0){
          data.push(
            {
              "Rinkinys": set.Rinkinys,
              "Kiekis": set.qty
            }
          )
        }
      })

      var _url = $state.href('terminal.stickerPrint', 
      {date : JSON.stringify(
        {
          day : moment($scope.calendar.date).format("YYYY-MM-DD"),
          data : data
        })
      });

      window.open(_url, '_blank')
    }

    load($scope.calendar.date);
  });

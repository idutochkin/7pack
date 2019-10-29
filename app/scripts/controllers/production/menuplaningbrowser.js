'use strict';

/**
 * @ngdoc function
 * @name erp7App.controller:ProductionMenuplaningbrowserCtrl
 * @description
 * # ProductionMenuplaningbrowserCtrl
 * Controller of the erp7App
 */
angular.module('erp7App')
    .controller('ProductionMenuplaningbrowserCtrl', function ($scope, $timeout, $state, api, $mdDialog) {
  
      var PAGE_SIZE = 30;

      $scope.loading = true;
  
      var loadAll = function (page) {
        $scope.loading = true;
        var filter = {};
        filter.from = page * PAGE_SIZE;
        filter.qty = PAGE_SIZE;
      
        api.sets.all(filter.from, filter.qty, function(err, res){
          console.log(res);
          $scope.sets = res;
          $scope.loading = false;
        });
      };
      $scope.search = function(input){
        $scope.loading = true;
        if(!input) return loadAll($scope.CURRENT_PAGE);
        if(input.length > 2) {
          api.sets.search(input, function(err, res){
            if(err) return console.log(err);
            $scope.sets = res.data;
            console.log(res.data);
            $scope.loading = false;
          })
        }
      };
      $scope.input = '';
      $scope.cleanSearch = function () {
        $scope.input = '';
        loadAll($scope.CURRENT_PAGE);
      }
      $scope.CURRENT_PAGE = -1;
      $scope.nextPage = function (){
        $scope.CURRENT_PAGE++;
        loadAll($scope.CURRENT_PAGE);
      }
      $scope.prevPage = function (){
        $scope.CURRENT_PAGE--;
        loadAll($scope.CURRENT_PAGE);
      }
      $scope.nextPage();
  
      $scope.createNewSet = function () {
        $mdDialog.show({
          templateUrl: 'views/production/create-set.html',
          controller : 'ProductionCreateSetCtrl',
          clickOutsideToClose:false,
        }).then(function(data){
          if(data.id){
            $state.go('production.menuPlaningBrowser.menuPlaning', {id : data.id})
          }
        })
      };
    });

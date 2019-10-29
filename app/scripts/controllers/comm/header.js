'use strict';

/**
 * @ngdoc function
 * @name erp7App.controller:CommHeaderCtrl
 * @description
 * # CommHeaderCtrl
 * Controller of the erp7App
 */
angular.module('erp7App')
  .controller('HeaderCtrl', function ($scope, $mdMedia, $mdSidenav) {
    $scope.sideNavButton = false;
    $scope.$watch(
      function(){
        return $mdMedia('gt-sm')
      },
      function(){
        $scope.sideNavButton = !$mdMedia('gt-sm')
      }
    )
    $scope.toggleSidenav = function() {
      $mdSidenav("left").toggle();
    }
    $scope.openMenu = function($mdMenu, ev) {
      originatorEv = ev;
      $mdMenu.open(ev);
    };
    $scope.moreMenu = [
      {
        name : 'Nustatymai',
        sref : 'settings.menu'
      },
      {
        name : 'Pagalba',
        sref : ''
      },
      {
        name : 'Dokumentacija',
        sref : ''
      }
    ];
    $scope.search = {
      active : false,
      toggle : function () {
        $scope.search.active = !$scope.search.active 
      },
      find : function (input) {
        console.log(input);
      }
    }
  });

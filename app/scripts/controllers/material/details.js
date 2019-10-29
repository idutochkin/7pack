'use strict';

/**
 * @ngdoc function
 * @name erp7App.controller:MaterialDetailsCtrl
 * @description
 * # MaterialDetailsCtrl
 * Controller of the erp7App
 */
angular.module('erp7App')
  .controller('MaterialDetailsCtrl', function ($scope, $location, api, $stateParams, Notificator, $mdDialog) {
    $scope.currentUrl = $location.absUrl();
    $scope.uiLink = $scope.currentUrl.search(/https?:\/\/.+\/recipies\/browser\/material\/[0-9]+/i) !== -1 ? 'recipies.browser.modify({id:material.ID})' : 'material.create({id:material.ID})';
    $scope.microChartData = {
      type: 'pie',
      backgroundColor: 'none',
      series: [{
        values: [1],
        text: 'Angliavandeniai'
      },
      {
        values: [1],
        text: 'Baltymai'
      },
      {
        values: [1],
        text: 'Riebalai'
      },
      ],
      plot: {
        valueBox: {
          placement: 'in',
          text: '%t\n%npv% | %v',
          fontFamily: 'Open Sans',
          fontSize: '11pt'
        }
      }
    }
    $scope.macroChartData = {
      type: 'pie',
      backgroundColor: 'none',
      series: [{
        values: [1],
        text: 'Cukrus'
      },
      {
        values: [1],
        text: 'Druska'
      },
      {
        values: [1],
        text: 'Skaidulos'
      },
      ],
      plot: {
        valueBox: {
          placement: 'in',
          text: '%t\n%npv% | %v',
          fontFamily: 'Open Sans',
          fontSize: '11pt'
        }
      }
    }

    api.material.getPatiekolas($stateParams.id, 0, function (err, res) {
      if (err) return console.error(err);
	   
	  $scope.treePatiekolas = { childPatiekolas: res.Data };
	  $scope.PatiekolasLength = res.Count;
    })

    $scope.loading = true;
    var __groups = [];
    var __mUnits = [];

    api.material.allergens.all(function (err, res) {
      if (err) return console.error(err);

      $scope.allergens = res.data;
    })

    var _init = function () {
      _loadImage($stateParams.id);
      api.material.one($stateParams.id, function (matErr, material) {
        api.material.allergens.one($stateParams.id, function (allergErr, allergens) {
          if (matErr || allergErr) return Notificator.alert("Klaida", "Serverio klaida užkraunant žaliavą.");
          if (material.data.length < 1) return Notificator.alert("Klaida", "Žaliava neegzistuoja. Greičiausiai ji buvo ištrinta.");

          $scope.material = material.data[0];

          $scope.material.Kcal = $scope.material.Kcal * 100;
          $scope.material.Kcal = $scope.material.Kcal.toFixed(4);

          $scope.material.Angliavandeniai = $scope.material.Angliavandeniai * 100;
          $scope.material.Baltymai = $scope.material.Baltymai * 100;
          $scope.material.Riebalai = $scope.material.Riebalai * 100;
          $scope.material.Angliavandeniai = $scope.material.Angliavandeniai.toFixed(2);
          $scope.material.Baltymai = $scope.material.Baltymai.toFixed(2);
          $scope.material.Riebalai = $scope.material.Riebalai.toFixed(2);

          $scope.microChartData.series[0].values[0] = Number($scope.material.Angliavandeniai);
          $scope.microChartData.series[1].values[0] = Number($scope.material.Baltymai);
          $scope.microChartData.series[2].values[0] = Number($scope.material.Riebalai);

          $scope.material.Cukrus = $scope.material.Cukrus * 100;
          $scope.material.Skaidulos = $scope.material.Skaidulos * 100;
          $scope.material.Druska = $scope.material.Druska * 100;
          $scope.material.Cukrus = $scope.material.Cukrus.toFixed(2);
          $scope.material.Skaidulos = $scope.material.Skaidulos.toFixed(2);
          $scope.material.Druska = $scope.material.Druska.toFixed(2);

          $scope.macroChartData.series[0].values[0] = Number($scope.material.Cukrus);
          $scope.macroChartData.series[1].values[0] = Number($scope.material.Druska);
          $scope.macroChartData.series[2].values[0] = Number($scope.material.Skaidulos);
		  
          $scope.material.Alergenas = allergens.data
            .map(function (al) {
              var item = $scope.allergens.find(function (item) {
                return item.ID === al.Alergeno_ID;
              });
              return item;
            })
            .reduce(function (acc, cur) {
              var res = acc + ', ' + cur.Pavadinimas;
              if (!acc) {
                res = acc + cur.Pavadinimas;
              }
              return res;
            }, '');

          $scope.loading = false;
        })
      });
    };

    api.material.groups(function (err, res) {
      if (err) return console.log(err);
      __groups = res.data;
      api.other.mu(function (err, res) {
        if (err) console.log(err);
        __mUnits = res.data;
        _init();
      })
    })

    $scope.group = function (idx) {
      var GROUP = _.find(__groups, function (g) {
        return g.ID == idx;
      });
      if (GROUP) {
        return GROUP.Pavadinimas;
      } else {
        return 'nepriskirta'
      }

    }
    $scope.unit = function (idx) {
      var UNIT = _.find(__mUnits, function (m) {
        return m.ID == idx;
      });
      if (UNIT) {
        return UNIT.Pavadinimas + '(' + UNIT.Kodas + ')';
      } else {
        return 'nepriskirta'
      }
    }
    $scope.img = false;
    var _loadImage = function (idx) {
      api.material.image(idx, function (err, res) {
        if (err) return console.log(err);
        $scope.images = res.data;
        if (res.data[0]) $scope.img = res.data[0];
      })
    }

    $scope.openPhotoModal = function () {
      $mdDialog.show({
        controller: 'MaterialPhotoModalCtrl',
        templateUrl: 'views/material/photo.modal.html',
        clickOutsideToClose: true,
        locals: {
          images: $scope.images
        }
      })
    }

	$scope.tipas = "0";
    $scope.search = function (tipas) {
      if (tipas == 0) {
		  api.material.getPatiekolas($stateParams.id, 0, function (err, res) {
		  if (err) return console.error(err);		  
	  
		  $scope.treePatiekolas = { childPatiekolas: res.Data };
		  $scope.PatiekolasLength = res.Count;
		})
	  } else {
		api.material.getPatiekolas($stateParams.id, tipas, function (err, res) {
		  if (err) return console.error(err);
		  
		  $scope.treePatiekolas = { childPatiekolas: res.Data };
		  $scope.PatiekolasLength = res.Count;
		})
      }
      $scope.$apply();
    };
  })
  .directive("tree", function(RecursionHelper) {
    return {
        restrict: "E",
        scope: {family: '=', level: '@'},
        template:
		'<md-list-item class="md-3-line treePatiekolas-block" ng-click="treeClick(family.PatiekaloID)">' +
			'<span class="md-padding PatiekaloID">{{family.PatiekaloID}}</span>' +
			'<div class="md-list-item-text" layout="column">' +
				'<h3>{{family.Pavadinimas}}</h3>' +
				'<p layout="row" layout-align="space-between center">' +
					'<span>??? - Gaminama</span>' +
					'<span>{{family.Netto}}g</span>' +
				'</p>' +
				'<p>Tipas: {{family.Tipas}}</p>' +
			'</div>' +
		'</md-list-item>' +
        '<ul id="family_{{family.PatiekaloID}}">' + 
            '<li ng-repeat="child in family.childPatiekolas">' + 
                '<tree family="child" level="{{level ? level + 1 : 1}}"></tree>' +
            '</li>' +
        '</ul>',
        compile: function(element) {
            return RecursionHelper.compile(element, function(scope, iElement, iAttrs, controller, transcludeFn){
                // Define your normal link function here.
                // Alternative: instead of passing a function,
                // you can also pass an object with 
                // a 'pre'- and 'post'-link function.
            });
        },
		controller: function($scope, $element) {
			$scope.treeClick = function(PatiekaloID) {
				var family_Patiekalo = document.getElementById("family_" + PatiekaloID);
				
				if(getComputedStyle(family_Patiekalo, null).display == "none")
					family_Patiekalo.style.display = "block";
				else
					family_Patiekalo.style.display = "none";
			 }
		}
    };

});
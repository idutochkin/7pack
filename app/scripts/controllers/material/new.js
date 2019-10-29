'use strict';

/**
 * @ngdoc function
 * @name erp7App.controller:MaterialNewCtrl
 * @description
 * # MaterialNewCtrl
 * Controller of the erp7App
 */

angular.module('erp7App')
  .controller('MaterialNewCtrl', function ($scope, api, $location, $stateParams, Notificator, $state, FileUploader) {
    api.material.allergens.all(function (err, res) {
      if (err) return console.error(err);

      $scope.allergens = res.data;
    })

    $scope.hide = false;
    $scope.checkboxClick = function () {
      $scope.hide = !$scope.hide;
    };
    $scope.conv = {
      data: [],
      add: function () {
        $scope.conv.data.push({
          mid: null,
          size: 0
        })
      },
      remove: function (idx) {
        $scope.conv.data.splice(idx, 1);
      }
    };
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
    };
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
    };

    $scope.updateMicroChart = function (idx, value) {
      $scope.microChartData.series[idx].values[0] = value;
    }

    $scope.updateMacroChart = function (idx, value) {
      $scope.macroChartData.series[idx].values[0] = value;
    }

    var _thisNew = false;

    api.material.groups(function (err, res) {
      $scope.groups = res.data;
    })

    api.other.mu(function (err, res) {
      if (err) console.log(err);
      $scope.units = res.data;
    })

    if ($stateParams.id != 'new') {
      _thisNew = false;
      api.material.one($stateParams.id, function (matErr, material) {
        api.material.allergens.one($stateParams.id, function (allergErr, allergen) {
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

          $scope.material.Cukrus = $scope.material.Cukrus * 100;
          $scope.material.Skaidulos = $scope.material.Skaidulos * 100;
          $scope.material.Druska = $scope.material.Druska * 100;
          $scope.material.Cukrus = $scope.material.Cukrus.toFixed(2);
          $scope.material.Skaidulos = $scope.material.Skaidulos.toFixed(2);
          $scope.material.Druska = $scope.material.Druska.toFixed(2);

          $scope.material.Angliavandeniai = Number($scope.material.Angliavandeniai)
          $scope.material.Baltymai = Number($scope.material.Baltymai)
          $scope.material.Riebalai = Number($scope.material.Riebalai)

          $scope.material.Cukrus = Number($scope.material.Cukrus)
          $scope.material.Skaidulos = Number($scope.material.Skaidulos)
          $scope.material.Druska = Number($scope.material.Druska)

          $scope.material.Kcal = Number($scope.material.Kcal);

          $scope.material.Aktyvi = $scope.material.Aktyvi ? true : false;
          $scope.material.Alergenas = allergen.data.map(function (al) {
            var item = $scope.allergens.find(function (item) {
              return item.ID === al.Alergeno_ID;
            });
            return item;
          });

          $scope.updateMicroChart(0, $scope.material.Angliavandeniai);
          $scope.updateMicroChart(1, $scope.material.Baltymai);
          $scope.updateMicroChart(2, $scope.material.Riebalai);

          $scope.updateMacroChart(0, $scope.material.Cukrus);
          $scope.updateMacroChart(1, $scope.material.Druska);
          $scope.updateMacroChart(2, $scope.material.Skaidulos);
		  
		  
		  api.material.image($stateParams.id, function (err, res) {
			if (err) return console.log(err);
			$scope.images = res.data;
		  })
        })
      })
    } else {
      _thisNew = true;
		$scope.material = { Aktyvi:0 };
    }	
	

    $scope.save = function () {
      if (_thisNew) {
        $scope.material.Aktyvi = $scope.material.Aktyvi ? 1 : 0;
        api.material.create($scope.material, function (err, res) {
          if (err) return Notificator.alert("Klaida", "Serverio klaida kuriant žaliavą.")
          Notificator.toast("Žaliava sukurta");

          if ($scope.uploader.queue.length > 0) {
            __uploadImage(res.data, function () { })
          }
          $state.go("material.browser.selected", {
              id: res.data
          })
        })
      } else {
        $scope.material.Aktyvi = $scope.material.Aktyvi ? 1 : 0;
        var allergens = $scope.material.Alergenas.map(function (item) {
          return {
            'Zaliavos_ID': $stateParams.id,
            'Alergeno_ID': item.ID
          }
        });
        api.material.update($stateParams.id, $scope.material, function (matErr) {
          api.material.allergens.update($stateParams.id, allergens, function (allergErr) {
            if (matErr || allergErr) {
              Notificator.alert("Klaida", "Serverio klaida saugant žaliavą.")
              return console.error(matErr, allergErr)
            }

            Notificator.toast("Žaliava išsaugota");
            if ($scope.uploader.queue.length > 0) {
              __uploadImage($stateParams.id, function () { })
            }

            $state.go("material.browser.selected", {
              id: $stateParams.id
            })
          })
        })
      }
    }

    $scope.uploader = new FileUploader({});
	
    var __uploadImage = function (materialId, cb) {
      _.each($scope.uploader.queue, function (item) {
		  api.material.uploadImage(materialId, item._file, function(res) {});
      });
    }	
    
    $scope.removeImage = function (img) {
		img = img.substr(img.lastIndexOf('/') + 1);
		api.material.removeImage($stateParams.id, img, function(res) {		
		  api.material.image($stateParams.id, function (err, res) {
			if (err) return console.log(err);
			$scope.images = res.data;
		  })
		});
	}

  });
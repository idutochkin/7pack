'use strict';

/**
 * @ngdoc function
 * @name erp7App.controller:ProducionBagLabelPrintCtrl
 * @description
 * # ProducionBagLabelPrintCtrl
 * Controller of the erp7App
 */
angular.module('erp7App')
  .controller('ProducionBagLabelPrintCtrl', function ($scope, $stateParams, api, $filter) {
    $scope.barcode = function (text) {
      var canvas = document.createElement("canvas");
      JsBarcode(canvas, text, {
        format: "CODE39",
        width: 4,
        height: 100,
        fontSize: 54,
        background: null
      });
      return canvas.toDataURL("image/png");
    }

    var _date = $stateParams.date;
    api.orders.getAll(_date, function (err, res) {
      if (err) return console.error(err);

      var _col = localStorage.getItem('ao.7packErp@bagAssignment_col');
      var _dir = localStorage.getItem('ao.7packErp@bagAssignment_dir');
      if (_col) {
        $scope.bags = $filter('orderBy')(api._convertDates(res.data), _col, _dir === 'desc' ? true : false);
      }
      else {
        $scope.bags = api._convertDates(res.data);
      }
      $scope.bags.forEach(function (bag) {
        bag.AdresasDelimiter = bag.Adresas.search(/\d/);
        bag.Vienkartinis = bag.Vienkartinis ? 'VNK' : '';
        bag.Ivadinis = bag.Ivadinis ? 'ĮV. L.' : '';
      });

      setTimeout(
        function () {
          window.print();
        }, 3000
      )
    })

  });

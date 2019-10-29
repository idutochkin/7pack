'use strict';

/**
 * @ngdoc function
 * @name erp7App.controller:RecipiesDatasheetCtrl
 * @description
 * # RecipiesDatasheetCtrl
 * Controller of the erp7App
 */
angular.module('erp7App')
  .controller('RecipiesDatasheetCtrl', function ($scope) {

    $scope.export = function(){
      html2canvas(document.getElementById('datasheet'), {
          onrendered: function (canvas) {
              var data = canvas.toDataURL();
              var docDefinition = {
                  content: [{
                      image: data,
                      width: 500,
                  }]
              };
              pdfMake.createPdf(docDefinition).download("datasheet-1111.pdf");
          }
      });
   };
   $scope.print = function (){
      var printContents = document.getElementById('datasheet').innerHTML;
      var originalContents = document.body.innerHTML;
 
      document.body.innerHTML = printContents;
 
      window.print();
 
      document.body.innerHTML = originalContents;
   }
  });

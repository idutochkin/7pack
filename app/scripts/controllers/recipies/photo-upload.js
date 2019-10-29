'use strict';

/**
 * @ngdoc function
 * @name erp7App.controller:RecipiesPhotoUploadCtrl
 * @description
 * # RecipiesPhotoUploadCtrl
 * Controller of the erp7App
 */
angular.module('erp7App')
  .controller('RecipiesPhotoUploadCtrl', function (productId, $scope, FileUploader, $mdDialog, $timeout, Notificator) {
    console.log(productId);
    $scope.uploader = new FileUploader({
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('ao.7packErp@accessToken') }
    });
    $scope.__uploadImage = function (materialId, cb) {
      var url = "http://7packapi.azurewebsites.net/api/Products/Image/Upload/" + productId;
      // $scope.uploader.setOptions({url : url})
      // $scope.uploader.onBeforeUploadItem(function(item){
      //   item.url = url;
      // })
      _.each($scope.uploader.queue, function (item){
        item.url = url;
        item.formData.push({UploadedImage : item._file})
      })
      $scope.uploader.onCompleteAll(
        function () {
          cb();
        }
      )
      $scope.uploader.onErrorItem(
        function () {
          Notificator.alert("Klaida","Klaida įkeliant paveiksliuką.")
          cb();
        }
      )
      $scope.uploader.uploadAll();
      $timeout(function(){
        $mdDialog.hide();
        Notificator.toast("Nuotrauka įkelta");
      })
    }
  });

'use strict';

/**
 * @ngdoc service
 * @name erp7App.Notificator
 * @description
 * # Notificator
 * Service in the erp7App.
 */
angular.module('erp7App')
  .service('Notificator', function ($mdDialog, $mdToast) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.confirm = function(header, body, okText, okCb, cancelCb){
      var confirm = $mdDialog.confirm()
            .title(header)
            .textContent(body)
            .ariaLabel(header)
            .ok(okText)
            .cancel('Atšaukti');

      $mdDialog.show(confirm).then(
        function () {
          if (typeof okCb === 'function') return okCb();
        },
        function () {
          if (typeof cancelCb === 'function') return cancelCb();
        }
      );
    };
    this.toast = function (toastText) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(toastText)
          .position('bottom right')
          .hideDelay(3000)
      );
    };
    this.prompt = function (header, body, placeholder, value, okText, okCb, cancelCb){
      var prompt = $mdDialog.prompt()
            .title(header)
            .textContent(body)
            .placeholder(placeholder)
            .ariaLabel(header)
            .initialValue(value)
            .ok(okText)
            .cancel('Atšaukti');

      $mdDialog.show(prompt).then(
        function () {
          if (typeof okCb === 'function') return okCb();
        },
        function () {
          if (typeof cancelCb === 'function') return cancelCb();
        }
      );
    }
    this.alert = function (title, text){
      var _alert = $mdDialog.alert()
      .title(title)
      .htmlContent(text)
      .ariaLabel(title)
      .ok("ok")

      $mdDialog.show(_alert);
    }
  });

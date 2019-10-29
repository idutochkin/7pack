'use strict';

/**
 * @ngdoc service
 * @name erp7App.auth
 * @description
 * # auth
 * Service in the erp7App.
 */
angular.module('erp7App')
  .service('auth', function (api, md5) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.login = function(username, password, callback){
      api.user.getToken(username, md5.createHash(password || ''), 
        function(success){
          if(success){
            api.user.getCurrentUser(function(success){
              callback(success);
            })
          }
          else{
            callback(false);
          }
        }
      );
    };
  });

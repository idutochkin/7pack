'use strict';

/**
 * @ngdoc service
 * @name erp7App.Navigator
 * @description
 * # Navigator
 * Service in the erp7App.
 */
angular.module('erp7App')
  .service('Navigator', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var sideNavValue = true;
    this.sideNavExpanded = function(){
      return sideNavValue;
    };
    this.toggleSideNav = function () {
      sideNavValue = !sideNavValue;
    };
    this.setSideNavValue = function (value) {
      sideNavValue = value;
    }
  });

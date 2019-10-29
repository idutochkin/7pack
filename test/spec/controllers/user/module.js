'use strict';

describe('Controller: UserModuleCtrl', function () {

  // load the controller's module
  beforeEach(module('erp7App'));

  var UserModuleCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UserModuleCtrl = $controller('UserModuleCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(UserModuleCtrl.awesomeThings.length).toBe(3);
  });
});

'use strict';

describe('Controller: CommSideNavigationCtrl', function () {

  // load the controller's module
  beforeEach(module('erp7App'));

  var CommSideNavigationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CommSideNavigationCtrl = $controller('CommSideNavigationCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CommSideNavigationCtrl.awesomeThings.length).toBe(3);
  });
});

'use strict';

describe('Controller: SalesConfirmationCtrl', function () {

  // load the controller's module
  beforeEach(module('erp7App'));

  var SalesConfirmationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SalesConfirmationCtrl = $controller('SalesConfirmationCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SalesConfirmationCtrl.awesomeThings.length).toBe(3);
  });
});

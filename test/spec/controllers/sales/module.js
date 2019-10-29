'use strict';

describe('Controller: SalesModuleCtrl', function () {

  // load the controller's module
  beforeEach(module('erp7App'));

  var SalesModuleCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SalesModuleCtrl = $controller('SalesModuleCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SalesModuleCtrl.awesomeThings.length).toBe(3);
  });
});

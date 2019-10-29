'use strict';

describe('Controller: ClientsModuleCtrl', function () {

  // load the controller's module
  beforeEach(module('erp7App'));

  var ClientsModuleCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ClientsModuleCtrl = $controller('ClientsModuleCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ClientsModuleCtrl.awesomeThings.length).toBe(3);
  });
});

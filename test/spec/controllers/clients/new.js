'use strict';

describe('Controller: ClientsNewCtrl', function () {

  // load the controller's module
  beforeEach(module('erp7App'));

  var ClientsNewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ClientsNewCtrl = $controller('ClientsNewCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ClientsNewCtrl.awesomeThings.length).toBe(3);
  });
});

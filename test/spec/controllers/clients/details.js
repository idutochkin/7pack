'use strict';

describe('Controller: ClientsDetailsCtrl', function () {

  // load the controller's module
  beforeEach(module('erp7App'));

  var ClientsDetailsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ClientsDetailsCtrl = $controller('ClientsDetailsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ClientsDetailsCtrl.awesomeThings.length).toBe(3);
  });
});

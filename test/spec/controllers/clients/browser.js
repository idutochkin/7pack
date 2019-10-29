'use strict';

describe('Controller: ClientsBrowserCtrl', function () {

  // load the controller's module
  beforeEach(module('erp7App'));

  var ClientsBrowserCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ClientsBrowserCtrl = $controller('ClientsBrowserCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ClientsBrowserCtrl.awesomeThings.length).toBe(3);
  });
});

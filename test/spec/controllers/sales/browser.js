'use strict';

describe('Controller: SalesBrowserCtrl', function () {

  // load the controller's module
  beforeEach(module('erp7App'));

  var SalesBrowserCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SalesBrowserCtrl = $controller('SalesBrowserCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SalesBrowserCtrl.awesomeThings.length).toBe(3);
  });
});

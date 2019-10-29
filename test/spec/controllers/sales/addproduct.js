'use strict';

describe('Controller: SalesAddproductCtrl', function () {

  // load the controller's module
  beforeEach(module('erp7App'));

  var SalesAddproductCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SalesAddproductCtrl = $controller('SalesAddproductCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SalesAddproductCtrl.awesomeThings.length).toBe(3);
  });
});

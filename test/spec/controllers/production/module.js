'use strict';

describe('Controller: ProductionModuleCtrl', function () {

  // load the controller's module
  beforeEach(module('erp7App'));

  var ProductionModuleCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProductionModuleCtrl = $controller('ProductionModuleCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ProductionModuleCtrl.awesomeThings.length).toBe(3);
  });
});

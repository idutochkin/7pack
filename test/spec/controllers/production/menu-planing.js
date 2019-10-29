'use strict';

describe('Controller: ProductionMenuPlaningCtrl', function () {

  // load the controller's module
  beforeEach(module('erp7App'));

  var ProductionMenuPlaningCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProductionMenuPlaningCtrl = $controller('ProductionMenuPlaningCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ProductionMenuPlaningCtrl.awesomeThings.length).toBe(3);
  });
});

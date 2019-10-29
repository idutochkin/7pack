'use strict';

describe('Controller: ProductionMaterialSummaryCtrl', function () {

  // load the controller's module
  beforeEach(module('erp7App'));

  var ProductionMaterialSummaryCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProductionMaterialSummaryCtrl = $controller('ProductionMaterialSummaryCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ProductionMaterialSummaryCtrl.awesomeThings.length).toBe(3);
  });
});

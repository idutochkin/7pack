'use strict';

describe('Controller: ProductionQualityCtrl', function () {

  // load the controller's module
  beforeEach(module('erp7App'));

  var ProductionQualityCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProductionQualityCtrl = $controller('ProductionQualityCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ProductionQualityCtrl.awesomeThings.length).toBe(3);
  });
});

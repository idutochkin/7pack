'use strict';

describe('Controller: ProductionClassificatorsCtrl', function () {

  // load the controller's module
  beforeEach(module('erp7App'));

  var ProductionClassificatorsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProductionClassificatorsCtrl = $controller('ProductionClassificatorsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ProductionClassificatorsCtrl.awesomeThings.length).toBe(3);
  });
});

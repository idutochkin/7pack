'use strict';

describe('Controller: ProductionBagCheckCtrl', function () {

  // load the controller's module
  beforeEach(module('erp7App'));

  var ProductionBagCheckCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProductionBagCheckCtrl = $controller('ProductionBagCheckCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ProductionBagCheckCtrl.awesomeThings.length).toBe(3);
  });
});

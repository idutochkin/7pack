'use strict';

describe('Controller: ProductionBagCompleteCtrl', function () {

  // load the controller's module
  beforeEach(module('erp7App'));

  var ProductionBagCompleteCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProductionBagCompleteCtrl = $controller('ProductionBagCompleteCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ProductionBagCompleteCtrl.awesomeThings.length).toBe(3);
  });
});

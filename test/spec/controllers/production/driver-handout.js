'use strict';

describe('Controller: ProductionDriverHandoutCtrl', function () {

  // load the controller's module
  beforeEach(module('erp7App'));

  var ProductionDriverHandoutCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProductionDriverHandoutCtrl = $controller('ProductionDriverHandoutCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ProductionDriverHandoutCtrl.awesomeThings.length).toBe(3);
  });
});

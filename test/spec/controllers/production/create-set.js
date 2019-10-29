'use strict';

describe('Controller: ProductionCreateSetCtrl', function () {

  // load the controller's module
  beforeEach(module('erp7App'));

  var ProductionCreateSetCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProductionCreateSetCtrl = $controller('ProductionCreateSetCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ProductionCreateSetCtrl.awesomeThings.length).toBe(3);
  });
});

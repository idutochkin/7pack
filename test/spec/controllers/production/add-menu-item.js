'use strict';

describe('Controller: ProductionAddMenuItemCtrl', function () {

  // load the controller's module
  beforeEach(module('erp7App'));

  var ProductionAddMenuItemCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProductionAddMenuItemCtrl = $controller('ProductionAddMenuItemCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ProductionAddMenuItemCtrl.awesomeThings.length).toBe(3);
  });
});

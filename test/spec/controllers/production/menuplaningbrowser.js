'use strict';

describe('Controller: ProductionMenuplaningbrowserCtrl', function () {

  // load the controller's module
  beforeEach(module('erp7App'));

  var ProductionMenuplaningbrowserCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProductionMenuplaningbrowserCtrl = $controller('ProductionMenuplaningbrowserCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ProductionMenuplaningbrowserCtrl.awesomeThings.length).toBe(3);
  });
});

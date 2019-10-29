'use strict';

describe('Controller: DashboardsModuleCtrl', function () {

  // load the controller's module
  beforeEach(module('erp7App'));

  var DashboardsModuleCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DashboardsModuleCtrl = $controller('DashboardsModuleCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DashboardsModuleCtrl.awesomeThings.length).toBe(3);
  });
});

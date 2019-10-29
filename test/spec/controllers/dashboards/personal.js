'use strict';

describe('Controller: DashboardsPersonalCtrl', function () {

  // load the controller's module
  beforeEach(module('erp7App'));

  var DashboardsPersonalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DashboardsPersonalCtrl = $controller('DashboardsPersonalCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DashboardsPersonalCtrl.awesomeThings.length).toBe(3);
  });
});

'use strict';

describe('Controller: SettingsEmployeesNewCtrl', function () {

  // load the controller's module
  beforeEach(module('erp7App'));

  var SettingsEmployeesNewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SettingsEmployeesNewCtrl = $controller('SettingsEmployeesNewCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SettingsEmployeesNewCtrl.awesomeThings.length).toBe(3);
  });
});

'use strict';

describe('Controller: SettingsEmployeesDetailsCtrl', function () {

  // load the controller's module
  beforeEach(module('erp7App'));

  var SettingsEmployeesDetailsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SettingsEmployeesDetailsCtrl = $controller('SettingsEmployeesDetailsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SettingsEmployeesDetailsCtrl.awesomeThings.length).toBe(3);
  });
});

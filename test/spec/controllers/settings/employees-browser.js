'use strict';

describe('Controller: SettingsEmployeesBrowserCtrl', function () {

  // load the controller's module
  beforeEach(module('erp7App'));

  var SettingsEmployeesBrowserCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SettingsEmployeesBrowserCtrl = $controller('SettingsEmployeesBrowserCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SettingsEmployeesBrowserCtrl.awesomeThings.length).toBe(3);
  });
});

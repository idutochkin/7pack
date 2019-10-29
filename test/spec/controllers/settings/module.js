'use strict';

describe('Controller: SettingsModuleCtrl', function () {

  // load the controller's module
  beforeEach(module('erp7App'));

  var SettingsModuleCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SettingsModuleCtrl = $controller('SettingsModuleCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SettingsModuleCtrl.awesomeThings.length).toBe(3);
  });
});

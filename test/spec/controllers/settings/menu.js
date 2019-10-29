'use strict';

describe('Controller: SettingsMenuCtrl', function () {

  // load the controller's module
  beforeEach(module('erp7App'));

  var SettingsMenuCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SettingsMenuCtrl = $controller('SettingsMenuCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SettingsMenuCtrl.awesomeThings.length).toBe(3);
  });
});

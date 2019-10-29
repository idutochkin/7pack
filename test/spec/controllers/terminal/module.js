'use strict';

describe('Controller: TerminalModuleCtrl', function () {

  // load the controller's module
  beforeEach(module('erp7App'));

  var TerminalModuleCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TerminalModuleCtrl = $controller('TerminalModuleCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TerminalModuleCtrl.awesomeThings.length).toBe(3);
  });
});

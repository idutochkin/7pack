'use strict';

describe('Controller: TerminalMainCtrl', function () {

  // load the controller's module
  beforeEach(module('erp7App'));

  var TerminalMainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TerminalMainCtrl = $controller('TerminalMainCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TerminalMainCtrl.awesomeThings.length).toBe(3);
  });
});

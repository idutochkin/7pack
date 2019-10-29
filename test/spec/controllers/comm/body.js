'use strict';

describe('Controller: CommBodyCtrl', function () {

  // load the controller's module
  beforeEach(module('erp7App'));

  var CommBodyCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CommBodyCtrl = $controller('CommBodyCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CommBodyCtrl.awesomeThings.length).toBe(3);
  });
});

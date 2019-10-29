'use strict';

describe('Controller: SalesDetailsCtrl', function () {

  // load the controller's module
  beforeEach(module('erp7App'));

  var SalesDetailsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SalesDetailsCtrl = $controller('SalesDetailsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SalesDetailsCtrl.awesomeThings.length).toBe(3);
  });
});

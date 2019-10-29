'use strict';

describe('Controller: RecipiesSelectedCtrl', function () {

  // load the controller's module
  beforeEach(module('erp7App'));

  var RecipiesSelectedCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecipiesSelectedCtrl = $controller('RecipiesSelectedCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RecipiesSelectedCtrl.awesomeThings.length).toBe(3);
  });
});

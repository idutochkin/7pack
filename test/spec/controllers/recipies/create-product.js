'use strict';

describe('Controller: RecipiesCreateProductCtrl', function () {

  // load the controller's module
  beforeEach(module('erp7App'));

  var RecipiesCreateProductCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecipiesCreateProductCtrl = $controller('RecipiesCreateProductCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RecipiesCreateProductCtrl.awesomeThings.length).toBe(3);
  });
});

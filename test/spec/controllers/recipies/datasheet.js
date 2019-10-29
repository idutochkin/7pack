'use strict';

describe('Controller: RecipiesDatasheetCtrl', function () {

  // load the controller's module
  beforeEach(module('erp7App'));

  var RecipiesDatasheetCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecipiesDatasheetCtrl = $controller('RecipiesDatasheetCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RecipiesDatasheetCtrl.awesomeThings.length).toBe(3);
  });
});

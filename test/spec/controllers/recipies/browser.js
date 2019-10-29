'use strict';

describe('Controller: RecipiesBrowserCtrl', function () {

  // load the controller's module
  beforeEach(module('erp7App'));

  var RecipiesBrowserCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecipiesBrowserCtrl = $controller('RecipiesBrowserCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RecipiesBrowserCtrl.awesomeThings.length).toBe(3);
  });
});

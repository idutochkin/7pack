'use strict';

describe('Controller: MaterialBrowserCtrl', function () {

  // load the controller's module
  beforeEach(module('erp7App'));

  var MaterialBrowserCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MaterialBrowserCtrl = $controller('MaterialBrowserCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MaterialBrowserCtrl.awesomeThings.length).toBe(3);
  });
});

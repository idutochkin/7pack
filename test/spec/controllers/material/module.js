'use strict';

describe('Controller: MaterialModuleCtrl', function () {

  // load the controller's module
  beforeEach(module('erp7App'));

  var MaterialModuleCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MaterialModuleCtrl = $controller('MaterialModuleCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MaterialModuleCtrl.awesomeThings.length).toBe(3);
  });
});

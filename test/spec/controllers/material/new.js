'use strict';

describe('Controller: MaterialNewCtrl', function () {

  // load the controller's module
  beforeEach(module('erp7App'));

  var MaterialNewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MaterialNewCtrl = $controller('MaterialNewCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MaterialNewCtrl.awesomeThings.length).toBe(3);
  });
});

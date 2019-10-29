'use strict';

describe('Controller: RecepiesMaterialAddCtrl', function () {

  // load the controller's module
  beforeEach(module('erp7App'));

  var RecepiesMaterialAddCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecepiesMaterialAddCtrl = $controller('RecepiesMaterialAddCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RecepiesMaterialAddCtrl.awesomeThings.length).toBe(3);
  });
});

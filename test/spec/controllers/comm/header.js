'use strict';

describe('Controller: CommHeaderCtrl', function () {

  // load the controller's module
  beforeEach(module('erp7App'));

  var CommHeaderCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CommHeaderCtrl = $controller('CommHeaderCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CommHeaderCtrl.awesomeThings.length).toBe(3);
  });
});

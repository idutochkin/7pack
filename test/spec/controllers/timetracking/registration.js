'use strict';

describe('Controller: TimetrackingRegistrationCtrl', function () {

  // load the controller's module
  beforeEach(module('erp7App'));

  var TimetrackingRegistrationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TimetrackingRegistrationCtrl = $controller('TimetrackingRegistrationCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TimetrackingRegistrationCtrl.awesomeThings.length).toBe(3);
  });
});

'use strict';

describe('Controller: MaterialPhotoModalCtrl', function () {

  // load the controller's module
  beforeEach(module('erp7App'));

  var MaterialPhotoModalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MaterialPhotoModalCtrl = $controller('MaterialPhotoModalCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MaterialPhotoModalCtrl.awesomeThings.length).toBe(3);
  });
});

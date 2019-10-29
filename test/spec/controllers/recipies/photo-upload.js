'use strict';

describe('Controller: RecipiesPhotoUploadCtrl', function () {

  // load the controller's module
  beforeEach(module('erp7App'));

  var RecipiesPhotoUploadCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecipiesPhotoUploadCtrl = $controller('RecipiesPhotoUploadCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RecipiesPhotoUploadCtrl.awesomeThings.length).toBe(3);
  });
});

'use strict';

describe('Controller: StickerPrintingCtrl', function () {

  // load the controller's module
  beforeEach(module('erp7App'));

  var StickerPrintingCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StickerPrintingCtrl = $controller('StickerPrintingCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(StickerPrintingCtrl.awesomeThings.length).toBe(3);
  });
});

'use strict';

describe('Controller: ProducionBagLabelModalCtrl', function () {

  // load the controller's module
  beforeEach(module('erp7App'));

  var ProducionBagLabelModalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProducionBagLabelModalCtrl = $controller('ProducionBagLabelModalCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ProducionBagLabelModalCtrl.awesomeThings.length).toBe(3);
  });
});

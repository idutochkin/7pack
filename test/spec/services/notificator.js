'use strict';

describe('Service: Notificator', function () {

  // load the service's module
  beforeEach(module('erp7App'));

  // instantiate service
  var Notificator;
  beforeEach(inject(function (_Notificator_) {
    Notificator = _Notificator_;
  }));

  it('should do something', function () {
    expect(!!Notificator).toBe(true);
  });

});

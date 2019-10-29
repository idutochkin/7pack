'use strict';

/**
 * @ngdoc service
 * @name erp7App.api
 * @description
 * # api
 * Service in the erp7App.
 */
angular.module('erp7App').service('api', function ($http, $q, apiUrl) {
  var url = apiUrl.info().url;
  var ls = {
    accessTokenKey: '',
  };

  Date.prototype.stdTimezoneOffset = function () {
    var jan = new Date(this.getFullYear(), 0, 1);
    var jul = new Date(this.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
  }

  Date.prototype.dst = function () {
    return this.getTimezoneOffset() < this.stdTimezoneOffset();
  }

  function convertUTCToLocalTime(hm) {
    var minsInDay = 1440;
    var minsInHour = 60;

    var hrs = hm.substr(0, 2);
    var mnts = hm.substr(3, 2);
    var offset = (new Date()).getTimezoneOffset();

    if ((new Date()).dst()) {
      offset += 60;
    }

    mnts = Number(hrs) * minsInHour + Number(mnts) - offset;
    if (mnts > minsInDay) {
      mnts = minsInDay - mnts;
    }

    var resHrs = String(Math.floor(mnts / minsInHour));
    var resMnts = String(mnts - resHrs * minsInHour);
    if (resHrs.length < 2) {
      resHrs = '0' + String(resHrs);
    }
    if (resMnts.length < 2) {
      resMnts = '0' + String(resMnts);
    }

    return resHrs + ':' + resMnts;
  }

  this.Customer = {
    Update: function (controller, cb, id, data) {
      var method = url + '/api/Customer/' + id;
      $http.put(method, JSON.stringify(data)).then(
        function (response) {
          cb(controller, response);
        },
        function (err) {
          console.error(err);
        }
      );
    },
    listPersonal: function (controller, cb) {
      var method = url + '/api/Customer/List/Personal';
      $http({
        method: 'GET',
        url: method,
      }).then(
        function (response) {
          cb(controller, response);
        },
        function (err) {
          console.error(err);
        }
      );
    },
    listCompany: function (controller, cb) {
      var method = url + '/api/Customer/List/Company';
      $http({
        method: 'GET',
        url: method,
      }).then(
        function (response) {
          cb(controller, response);
        },
        function (err) {
          console.error(err);
        }
      );
    },
    getAll: function (cb) {
      var method = url + '/api/Customer/List/Temp';
      _http.get(method, cb);
    },
    updateTemp: function (id, data, cb) {
      var method = url + '/api/Customer/Temp/' + id;
      _http.put(method, data, cb);
    },
    addTemp: function (data, cb) {
      var method = url + '/api/Customer/Create/Temp';
      _http.post(method, data, cb);
    },
    byId: function (controller, cb, id) {
      var method = url + '/api/Customer/' + id;
      $http({
        method: 'GET',
        url: method,
      }).then(
        function (response) {
          cb(controller, response);
        },
        function (err) {
          console.error(err);
        }
      );
    },
    CompanyStatuses: function (controller, cb, userId, data) {
      var method = url + '/api/Customer/Company/Statuses';
      $http({
        method: 'GET',
        url: method,
      }).then(
        function (response) {
          var result = [];
          for (var i = 0; i < response.data.length; i++) {
            result[response.data[i]['ID']] = response.data[i];
          }
          cb(controller, result[data]);
        },
        function (err) {
          console.error(err);
        }
      );
    },
    SalesPerson: function (controller, cb, userId, data) {
      var method = url + '/api/Customer/SalesPerson/Active';
      $http({
        method: 'GET',
        url: method,
      }).then(
        function (response) {
          var result = [];
          for (var i = 0; i < response.data.length; i++) {
            result[response.data[i]['ID']] = response.data[i];
          }
          cb(controller, result[data]);
        },
        function (err) {
          console.error(err);
        }
      );
    },
    PaymentTerms: function (controller, cb, userId, data) {
      var method = url + '/api/Customer/' + userId + '/Payment-Terms/Active';
      $http({
        method: 'GET',
        url: method,
      }).then(
        function (response) {
          var result = [];
          for (var i = 0; i < response.data.length; i++) {
            result[response.data[i]['ID']] = response.data[i];
          }
          cb(controller, result[data]);
        },
        function (err) {
          console.error(err);
        }
      );
    },
    Discounts: function (controller, cb, userId) {
      var method = url + '/api/Customer/' + userId + '/Discounts/Active';
      $http({
        method: 'GET',
        url: method,
      }).then(
        function (response) {
          cb(controller, response);
        },
        function (err) {
          console.error(err);
        }
      );
    },
    AllPaymentTypes: function (controller, cb, data) {
      var method = url + '/api/Orders/Payment-Types/Active';
      $http({
        method: 'GET',
        url: method,
      }).then(
        function (response) {
          var result = [];
          for (var i = 0; i < response.data.length; i++) {
            result[response.data[i]['ID']] = response.data[i];
          }
          cb(controller, result[data]);
        },
        function (err) {
          console.error(err);
        }
      );
    },
    AllPaymentTerms: function (controller, cb, data) {
      var method = url + '/api/Orders/Payment-Terms/Active';
      $http({
        method: 'GET',
        url: method,
      }).then(
        function (response) {
          var result = [];
          for (var i = 0; i < response.data.length; i++) {
            result[response.data[i]['ID']] = response.data[i];
          }
          cb(controller, result[data]);
        },
        function (err) {
          console.error(err);
        }
      );
    },
    PaymentTypes: function (controller, cb, userId, data) {
      var method = url + '/api/Customer/' + userId + '/Payment-Types/Active';
      $http({
        method: 'GET',
        url: method,
      }).then(
        function (response) {
          var result = [];
          for (var i = 0; i < response.data.length; i++) {
            result[response.data[i]['ID']] = response.data[i];
          }
          cb(controller, result[data]);
        },
        function (err) {
          console.error(err);
        }
      );
    },
    Phones: function (controller, cb, userId, data) {
      var method = url + '/api/Customer/' + userId + '/Phones/Active';
      $http({
        method: 'GET',
        url: method,
      }).then(
        function (response) {
          var result = [];
          for (var i = 0; i < response.data.length; i++) {
            result[response.data[i]['ID']] = response.data[i];
          }
          cb(controller, result[data]);
        },
        function (err) {
          console.error(err);
        }
      );
    },
    Contacts: function (controller, cb, userId, data) {
      var method = url + '/api/Customer/' + userId + '/Contacts/Active';
      $http({
        method: 'GET',
        url: method,
      }).then(
        function (response) {
          var result = [];
          for (var i = 0; i < response.data.length; i++) {
            result[response.data[i]['ID']] = response.data[i];
          }
          cb(controller, result[data]);
        },
        function (err) {
          console.error(err);
        }
      );
    },
    Emails: function (controller, cb, userId, data) {
      var method = url + '/api/Customer/' + userId + '/Emails/Active';
      $http({
        method: 'GET',
        url: method,
      }).then(
        function (response) {
          var result = [];
          for (var i = 0; i < response.data.length; i++) {
            result[response.data[i]['ID']] = response.data[i];
          }
          cb(controller, result[data]);
        },
        function (err) {
          console.error(err);
        }
      );
    },
    Addresses: function (controller, cb, userId, data) {
      var method = url + '/api/Customer/' + userId + '/Addresses/Active';
      $http({
        method: 'GET',
        url: method,
      }).then(
        function (response) {
          var result = [];
          for (var i = 0; i < response.data.length; i++) {
            result[response.data[i]['ID']] = response.data[i];
          }
          cb(controller, result[data]);
        },
        function (err) {
          console.error(err);
        }
      );
    },
  };

  this.Orders = {
    PaymentTerms: function (controller, cb, data) {
      var method = url + '/api/Orders/Payment-Terms/Active';
      $http({
        method: 'GET',
        url: method,
      }).then(
        function (response) {
          var result = [];
          for (var i = 0; i < response.data.length; i++) {
            result[response.data[i]['ID']] = response.data[i];
          }
          cb(controller, result, data, response.data);
        },
        function (err) {
          console.error(err);
        }
      );
    },
    PaymentTypes: function (controller, cb, data) {
      var method = url + '/api/Orders/Payment-Types/Active';
      $http({
        method: 'GET',
        url: method,
      }).then(
        function (response) {
          var result = [];
          for (var i = 0; i < response.data.length; i++) {
            result[response.data[i]['ID']] = response.data[i];
          }
          cb(controller, result, data, response.data);
        },
        function (err) {
          console.error(err);
        }
      );
    },
  };

  this.user = {
    getToken: function (username, password, cb) {
      var method = url + '/token';
      $http({
        method: 'POST',
        url: method,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        transformRequest: function (obj) {
          var str = [];
          for (var p in obj) str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
          return str.join('&');
        },
        data: {
          username: username,
          password: password,
          grant_type: 'password',
          scope: 'ERP',
        },
      }).then(
        function (response) {
          if (response.status == 200) {
            var accessToken = response.data.access_token;
            localStorage.setItem(ls.accessTokenKey, accessToken);
            $http.defaults.headers.common.Authorization = 'Bearer ' + accessToken;
            cb(true);
          } else {
            cb(false);
          }
        },
        function (err) {
          cb(false);
        }
      );
    },
    getCurrentUser: function (cb) {
      var method = url + '/api/user/';
      $http({
        method: 'GET',
        url: method,
      }).then(
        function (response) {
          cb(true);
        },
        function (err) {
          cb(false);
          console.error(err);
        }
      );
    },
    getUserData: function (cb) {
      var method = url + '/api/user/';
      $http({
        method: 'GET',
        url: method,
      }).then(
        function (response) {
          cb(response.data);
        },
        function (err) {
          cb(false);
          console.error(err);
        }
      );
    },
    isAuthenticated: function (cb) {
      var method = url + '/api/login/auth';
      $http.defaults.headers.common.Authorization =
        'Bearer ' + localStorage.getItem(ls.accessTokenKey);
      $http({
        method: 'GET',
        url: method,
      }).then(
        function (response) {
          cb(true);
        },
        function (err) {
          console.error(err);
          cb(false);
        }
      );
    },
  };
  this.orders = {
    getAll: function (date, cb) {
      if (!date) {
        var date = moment().format('YYYY-MM-DD');
      }
      var method = url + '/api/logistics/shipments/all/' + date;
      $http({
        method: 'GET',
        url: method,
      }).then(
        function (response) {
          cb(null, response);
        },
        function (err) {
          cb(err);
        }
      );
    },
    delayedBags: function (date, cb) {
      if (!date) date = 'all';
      var method = url + '/api/Logistics/Shipments/delayed/returns/' + date;

      $http({
        method: 'GET',
        url: method,
      }).then(
        function (response) {
          cb(null, response);
        },
        function (err) {
          cb(err);
          console.error(err);
        }
      );
    },
    returnBag: function (barcode, cb) {
      var method = url + '/api/logistics/Shipments/return/' + barcode;
      $http({
        method: 'PUT',
        url: method,
      }).then(
        function (response) {
          cb(null, response);
        },
        function (err) {
          cb(err);
          console.error(err);
        }
      );
    },
    completeBag: function (barcode, cb) {
      var method = url + '/api/Production/Complete/' + barcode;
      $http({
        method: 'PUT',
        url: method,
      }).then(
        function (res) {
          cb(null, res);
        },
        function (err) {
          cb(err);
        }
      );
    },
    bagSearch: function (input, cb) {
      var method = url + '/api/Logistics/Shipments/Search';
      $http({
        method: 'POST',
        url: method,
        data: [
          {
            SearchString: input,
          },
        ],
      }).then(
        function (response) {
          cb(null, response);
        },
        function (err) {
          cb(err);
        }
      );
    },
  };
  this.drivers = {
    active: function (cb) {
      var method = url + '/api/logistics/drivers/active';
      $http({
        method: 'GET',
        url: method,
      }).then(
        function (response) {
          cb(null, response);
        },
        function (err) {
          cb(err);
        }
      );
    },
    assignBags: function (data, cb) {
      var method = url + '/api/Logistics/Shipments/assigndriver';
      $http({
        method: 'PUT',
        url: method,
        data: data,
      }).then(
        function (response) {
          cb(null, response);
        },
        function (err) {
          console.error(err);
          cb(true);
        }
      );
    },
    bags: function (driverId, cb) {
      if (!driverId)
        return cb({
          code: 500,
          message: 'No driver selected',
        });
      var today = moment().format('YYYY-MM-DD');

      var method = url + '/api/Logistics/Shipments/driver/' + driverId + '/' + today;
      $http({
        method: 'GET',
        url: method,
      }).then(
        function (response) {
          cb(null, response);
        },
        function (err) {
          cb(err);
        }
      );
    },
    bagsByDate: function (driverId, date, cb) {
      if (!driverId)
        return cb({
          code: 500,
          message: 'No driver selected',
        });
      var today = moment(date).format('YYYY-MM-DD');

      var method = url + '/api/Logistics/Shipments/driver/' + driverId + '/' + today;
      $http({
        method: 'GET',
        url: method,
      }).then(
        function (response) {
          cb(null, response);
        },
        function (err) {
          cb(err);
        }
      );
    },
    take: function (driverId, barcode, cb) {
      var method = url + '/api/Logistics/Shipments/take/' + barcode + '/' + driverId;
      $http({
        method: 'PUT',
        url: method,
      }).then(
        function (response) {
          cb(null, response);
        },
        function (err) {
          cb(err);
          console.error(err);
        }
      );
    },
    quality: function (barcode, userId, cb) {
      var link = url + '/api/Production/Tracking/Box/' + barcode + '/' + userId;
      _http.post(link, undefined, cb);
    },
  };

  this.timeTracking = {
    find: function (date, employeeId, cb) {
      if (!date)
        date = moment()
          .subtract(0, 'day')
          .format('YYYY-MM-DD');

      var method = url + '/api/User/Events/' + date;
      if (employeeId) method += '/' + employeeId;

      $http({
        method: 'GET',
        url: method,
      }).then(
        function (response) {
          cb(null, response);
        },
        function (err) {
          cb(err);
          console.error(err);
        }
      );
    },
    register: function (employeeId, cb) {
      if (!employeeId) return cb(true);

      var method = url + '/api/User/register-event/' + employeeId;

      $http({
        method: 'POST',
        url: method,
      }).then(
        function (response) {
          cb(null, response);
        },
        function (err) {
          cb(err);
          console.error(err);
        }
      );
    },
  };

  this.material = {
    all: function (filter, cb) {
      var method = url + '/api/Raw-Materials/All';
      if (filter) {
        method = method + '/' + filter.from + '/' + filter.qty;
      }
      $http({
        method: 'GET',
        url: method,
      }).then(
        function (response) {
          cb(null, response);
        },
        function (err) {
          console.error(err);
        }
      );
    },
    one: function (id, cb) {
      var method = url + '/api/Raw-Materials/' + id;
      $http({
        method: 'GET',
        url: method,
      }).then(
        function (response) {
          cb(null, response);
        },
        function (err) {
          console.error(err);
        }
      );
    },
    allergens: {
      all: function (cb) {
        var link = url + '/api/Raw-Materials/Allergens/List';
        _http.get(link, cb);
      },
      one: function (id, cb) {
        var link = url + '/api/Raw-Materials/' + id + '/Allergens';
        _http.get(link, cb);
      },
      update: function (id, allergens, cb) {
        var link = url + '/api/Raw-Materials/Update/' + id + '/Allergens';
        _http.postJSON(link, allergens, cb);
      },
    },
    groups: function (cb) {
      var method = url + '/api/Raw-Materials/Groups';
      $http({
        method: 'GET',
        url: method,
      }).then(
        function (response) {
          cb(null, response);
        },
        function (err) {
          console.error(err);
        }
      );
    },
    image: function (id, cb) {
      var method = url + '/api/Raw-Materials/' + id + '/Image/List';
      $http({
        method: 'GET',
        url: method,
      }).then(
        function (response) {
          cb(null, response);
        },
        function (err) {
          console.error(err);
        }
      );
    },
    create: function (model, cb) {
      var method = url + '/api/Raw-Materials/Create';
      $http({
        method: 'POST',
        url: method,
        data: [model],
      }).then(
        function (response) {
          cb(null, response);
        },
        function (err) {
          cb(err);
        }
      );
    },
    update: function (id, model, cb) {
      var method = url + '/api/Raw-Materials/Update/' + id;
      $http({
        method: 'PUT',
        url: method,
        data: [model],
      }).then(
        function (response) {
          cb(null, response);
        },
        function (err) {
          cb(err);
        }
      );
    },
    search: function (text, cb) {
      var method = url + '/api/Raw-Materials/Search';
      $http({
        method: 'POST',
        url: method,
        data: [
          {
            SearchString: text,
          },
        ],
      }).then(
        function (response) {
          cb(null, response);
        },
        function (err) {
          cb(err);
        }
      );
    },
    uploadImage: function (id, file, cb) {
      var method = url + '/api/Raw-Materials/Image/Upload/' + id;
      var fd = new FormData();
      fd.append('UploadedImage', file);

      $http
        .post(method, fd, {
          transformRequest: angular.identity,
          headers: {
            'Content-Type': undefined,
          },
        })
        .then(
          function (res) {
            cb(null, res);
          },
          function (err) {
            cb(err);
          }
        );
    },
    removeImage: function (id, img, cb) {
      var method = url + '/api/Raw-Materials/Image/Delete/' + id;
      $http({
        method: 'POST',
        url: method,
        data: [
          {
            FileName: img,
          },
        ],
      }).then(
        function (response) {
          cb(null, response);
        },
        function (err) {
          cb(err);
        }
      );
    },
    getPatiekolas: function (zaliavosId, tipas, cb) {
      var method = url + '/api/Production/Patiekolas/' + zaliavosId + "/" + tipas;
      $http({
        method: 'GET',
        url: method
      }).then(
        function (response) {
          cb(null, response.data);
        },
        function (err) {
          cb(err);
        }
      );
    }
  };

  this.day = {
    open: function (date, cb) {
      var date_to_open = moment(date).format('YYYY-MM-DD');
      var method = url + '/api/Logistics/Shipments/Open/' + date_to_open;
      $http({
        method: 'POST',
        url: method,
      }).then(
        function (respose) {
          cb(null, respose);
        },
        function (err) {
          cb(err);
        }
      );
    },
    close: function (cb) {
      var method = url + '/api/Logistics/Shipments/Close';
      $http({
        method: 'PUT',
        url: method,
      }).then(
        function (response) {
          cb(null, response);
        },
        function (err) {
          cb(err);
        }
      );
    },
    check: function (cb) {
      var method = url + '/api/Logistics/Shipments/Current-Day';
      $http({
        method: 'GET',
        url: method,
      }).then(
        function (response) {
          cb(null, response);
        },
        function (err) {
          cb(err);
        }
      );
    },
  };

  this.other = {
    mu: function (cb) {
      var method = url + '/api/general/uom/list';
      $http({
        method: 'GET',
        url: method,
      }).then(
        function (response) {
          cb(null, response);
        },
        function (err) {
          cb(err);
        }
      );
    },
    bars: function (cb) {
      var method = url + '/api/Production/Bar/List';
      $http({
        method: 'GET',
        url: method,
      }).then(
        function (response) {
          cb(null, response);
        },
        function (err) {
          cb(err);
        }
      );
    },
  };

  this.product = {
    all: function (filter, cb) {
      var method = url + '/api/Products/All';
      if (filter) {
        method = method + '/' + filter.from + '/' + filter.qty;
      }

      $http({
        method: 'GET',
        url: method,
      }).then(
        function (response) {
          cb(null, response);
        },
        function (err) {
          console.error(err);
        }
      );
    },
    semiFinished: function (cb) {
      var link = url + '/api/Products/Semi-Finished/Active';
      _http.get(link, cb);
    },
    search: function (input, cb) {
      var method = url + '/api/Products/Search';
      $http({
        method: 'POST',
        url: method,
        data: [
          {
            SearchString: input,
          },
        ],
      }).then(
        function (response) {
          cb(null, response);
        },
        function (err) {
          cb(err);
        }
      );
    },
    onePromise: function (id, cb) {
      var product = {};
      var urls = [
        {
          link: url + '/api/Products/' + id,
          root: true,
          countable: true,
          elseCond: {},
        },
        {
          link: url + '/api/Products/Technology/' + id,
          name: 'technology',
          countable: false,
          elseCond: {},
        },
        {
          link: url + '/api/Products/Calculation/' + id,
          name: 'calculation',
          countable: false,
          elseCond: {},
        },
        {
          link: url + '/api/Products/Sticker/' + id,
          name: 'sticker',
          countable: true,
          elseCond: _defaultStickerModel,
        },
        {
          link: url + '/api/Products/Storage-Conditions/' + id,
          name: 'storage',
          countable: true,
          elseCond: {},
        },
        {
          link: url + '/api/Products/' + id + '/Image/List',
          name: 'images',
          countable: false,
          elseCond: {},
        },
      ];
      var functionStack = [];
      _.each(urls, function (item) {
        var _f = function () {
          var defer = $q.defer();
          _http.get(item.link, function (err, res) {
            if (item.root) {
              if (item.countable) {
                var result = res.data[0];
              } else {
                var result = res.data;
              }
              product = result || item.elseCond;
              defer.resolve(true);
            } else {
              if (item.countable) {
                var result = res.data[0];
              } else {
                var result = res.data;
              }
              product[item.name] = result || item.elseCond;
              defer.resolve(true);
            }
          });
          return defer.promise;
        };
        functionStack.push(_f());
      });
      $q.all(functionStack).then(function (res) {
        cb(null, product);
      });
    },
    one: function (id, cb) {
      // $httpProvider.defaults.useXDomain = true;
      var product;
      var urls = [
        url + '/api/Products/' + id,
        url + '/api/Products/Technology/' + id,
        url + '/api/Products/Calculation/' + id,
        url + '/api/Products/Sticker/' + id,
        url + '/api/Products/Storage-Conditions/' + id,
        url + '/api/Products/' + id + '/Image/List',
      ];
      _http.get(urls[0], function (err, res) {
        if (err) return cb(err);
        product = res.data[0];
        _http.get(urls[1], function (err, res) {
          if (err) return cb(err);
          product.technology = res.data || [];
          _http.get(urls[2], function (err, res) {
            if (err) return cb(err);
            product.calculation = res.data || [];
            _http.get(urls[3], function (err, res) {
              if (err) return cb(err);
              product.sticker = res.data[0] || _defaultStickerModel;
              _http.get(urls[4], function (err, res) {
                if (err) return cb(err);
                product.storage = res.data[0] || {};
                _http.get(urls[5], function (err, res) {
                  if (err) return cb(err);
                  product.images = res.data;
                  cb(null, product);
                });
              });
            });
          });
        });
      });
    },
    types: function (cb) {
      var link = url + '/api/Products/Types';
      _http.get(link, function (err, res) {
        if (err) return cb(err);
        cb(null, res.data);
      });
    },
    statuses: function (cb) {
      var link = url + '/api/Products/Statuses';
      _http.get(link, function (err, res) {
        if (err) return cb(err);
        cb(null, res.data);
      });
    },
    createCalculation: function (productId, model, cb) {
      var method = url + '/api/Products/Calculation/' + productId;
      $http({
        method: 'POST',
        url: method,
        data: [model],
      }).then(
        function (res) {
          cb(null, res);
        },
        function (err) {
          cb(err);
        }
      );
    },
    updateCalculation: function (rowId, model, cb) {
      var method = url + '/api/Products/Calculation/' + rowId;
      $http({
        method: 'PUT',
        url: method,
        data: [model],
      }).then(
        function (res) {
          cb(null, res);
        },
        function (err) {
          cb(err);
        }
      );
    },
    deleteCalculation: function (rowId, cb) {
      var method = url + '/api/Products/Calculation/' + rowId;
      $http({
        method: 'DELETE',
        url: method,
      }).then(
        function (res) {
          cb(null, res);
        },
        function (err) {
          cb(err);
        }
      );
    },
    create: function (model, cb) {
      var method = url + '/api/Products/Create';
      $http({
        method: 'POST',
        url: method,
        data: [model],
      }).then(
        function (res) {
          cb(null, res);
        },
        function (err) {
          cb(err);
        }
      );
    },
    update: function (id, model, cb) {
      var method = url + '/api/Products/Update/' + id;
      $http({
        method: 'PUT',
        url: method,
        data: [model],
      }).then(
        function (res) {
          cb(null, res);
        },
        function (err) {
          cb(err);
        }
      );
    },
    createStorage: function (productId, model, cb) {
      var method = url + '/api/Products/Storage-Conditions/' + productId;
      $http({
        method: 'POST',
        url: method,
        data: [model],
      }).then(
        function (res) {
          cb(null, res);
        },
        function (err) {
          cb(err);
        }
      );
    },
    updateStorage: function (rowId, model, cb) {
      var method = url + '/api/Products/Storage-Conditions/' + rowId;
      $http({
        method: 'PUT',
        url: method,
        data: [model],
      }).then(
        function (res) {
          cb(null, res);
        },
        function (err) {
          cb(err);
        }
      );
    },
    updateSticker: function (productId, model, cb) {
      var method = url + '/api/Products/Sticker/' + productId;
      $http({
        method: 'PUT',
        url: method,
        data: [model],
      }).then(
        function (res) {
          cb(null, res);
        },
        function (err) {
          cb(err);
        }
      );
    },
    technology: {
      create: function (productId, model, cb) {
        var method = url + '/api/Products/Technology/' + productId;
        $http({
          method: 'POST',
          url: method,
          data: [model],
        }).then(
          function (res) {
            cb(null, res);
          },
          function (err) {
            cb(err);
          }
        );
      },
      update: function (rowId, model, cb) {
        var method = url + '/api/Products/Technology/' + rowId;
        $http({
          method: 'PUT',
          url: method,
          data: [model],
        }).then(
          function (res) {
            cb(null, res);
          },
          function (err) {
            cb(err);
          }
        );
      },
      delete: function (rowId, cb) {
        var method = url + '/api/Products/Technology/' + rowId;
        $http({
          method: 'DELETE',
          url: method,
        }).then(
          function (res) {
            cb(null, res);
          },
          function (err) {
            cb(err);
          }
        );
      },
    },
  };

  this.sets = {
    all: function (from, limit, cb) {
      var method = url + '/api/Sets/All/' + from + '/' + limit;
      _http.get(method, function (err, res) {
        cb(null, res.data);
      });
    },
    byId: function (id, cb) {
      var link = url + '/api/Sets/' + id;
      _http.get(link, cb);
    },
    one: function (id, date, cb) {
      var set;
      var urls = [url + '/api/Sets/' + id, url + '/api/Sets/Menu/' + id + '/' + date];
      _http.get(urls[0], function (err, res) {
        if (err) return cb(err);
        set = res.data[0];
        _http.get(urls[1], function (err, res) {
          if (err) return cb(err);
          set.menu = res.data;
          cb(null, set);
        });
      });
    },
    active: function (cb) {
      var method = url + '/api/Sets/Active/List';
      _http.get(method, cb);
    },
    search: function (text, cb) {
      var method = url + '/api/Sets/Search';
      $http({
        method: 'POST',
        url: method,
        data: [
          {
            SearchString: text,
          },
        ],
      }).then(
        function (response) {
          cb(null, response);
        },
        function (err) {
          cb(err);
        }
      );
    },
    create: function (data, cb) {
      var method = url + '/api/Sets/Create';
      _http.post(method, data, cb);
    },
    menu: {
      add: function (setId, data, cb) {
        var method = url + '/api/Sets/Menu/' + setId;
        $http({
          method: 'POST',
          url: method,
          data: [data],
        }).then(
          function (res) {
            cb(null, res);
          },
          function (err) {
            cb(err);
          }
        );
      },
      update: function (id, data, cb) {
        var method = url + '/api/Sets/Menu/' + id;
        _http.put(method, data, cb);
      },
      delete: function (id, cb) {
        var method = url + '/api/Sets/Menu/' + id;
        _http.delete(method, cb);
      },
    },
    materials: function (cb) {
      var method = url + '/api/Products/ForSets/List';
      _http.get(method, cb);
    },
    statuses: function (cb) {
      var method = url + '/api/Sets/Statuses';
      _http.get(method, cb);
    },
    images: function (cb) {
      var link = url + '/api/Sets/Sticker-Templates';

      _http.get(link, cb);
    },
    update: function (id, name, status, image, cb) {
      var method = url + '/api/Sets/' + id;
      var data = [
        {
          ID: id,
          Pavadinimas: name,
          Statusas: status,
          Sablono_ID: image,
        },
      ];
      _http.putJSON(method, data, cb);
    },
  };

  this.calendar = {
    getCurrentDay: function (cb) {
      var link = url + '/api/Production/Plan/Current-Day';
      _http.get(link, cb);
    },
    closeDay: function (cb) {
      var link = url + '/api/Production/Plan/Day-Close';
      _http.post(link, null, cb);
    },
    getHolidays: function (cb) {
      var link = url + '/api/General/Holidays';
      _http.get(link, cb);
    },
    getRawCalendar: function (months, years, cb) {
      var link = url + '/api/Production/Plan';
      var data = [
        {
          Metai: years,
          Menesiai: months,
        },
      ];

      _http.postJSON(link, data, cb);
    },
    add: function (customerId, setId, daysAmount, date, cb) {
      var link = url + '/api/Production/Plan/' + customerId;
      var formattedDate = moment(date).format('YYYY-MM-DD');
      var data = [
        {
          KlientoID: customerId,
          RinkinioID: setId,
          Dienu_skacius: daysAmount,
          Pirma_diena: formattedDate,
        },
      ];

      _http.postJSON(link, data, cb);
    },
    update: function (entryId, setId, cb) {
      var link = url + '/api/Production/Plan/' + entryId + '/' + setId;
      $http({
        method: 'PUT',
        url: link,
      }).then(
        function (res) {
          cb(null, res);
        },
        function (err) {
          cb(err);
        }
      );
    },
    delete: function (id, cb) {
      var link = url + '/api/Production/Plan/' + id;
      _http.delete(link, cb);
    },
  };

  this.report = {
    sticker: function (date, data, cb) {
      var link = url + '/api/production/Labels/' + date;
      _http.postMany(link, data, cb);
    },
    sets: function (date, cb) {
      var link = url + '/api/Production/Sets/' + date;
      _http.get(link, cb);
    },
  };

  var _http = {
    get: function (link, callback) {
      $http({
        method: 'GET',
        url: link,
        withCredentials: true,
      }).then(
        function (res) {
          callback(null, res);
        },
        function (err) {
          callback(err);
        }
      );
    },
    asyncGet: function (link) {
      return $q(function (resolve, reject) {
        $http({
          method: 'GET',
          url: link
        }).then(
          function (res) {
            resolve(res);
          },
          function (err) {
            reject(err);
          }
        );
      });
    },
    post: function (link, data, callback) {
      $http({
        method: 'POST',
        url: link,
        data: [data],
      }).then(
        function (res) {
          callback(null, res);
        },
        function (err) {
          callback(err);
        }
      );
    },
    postJSON: function (link, data, callback) {
      $http({
        method: 'POST',
        url: link,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        data: data,
      }).then(
        function (res) {
          callback(null, res);
        },
        function (err) {
          callback(err);
        }
      );
    },
    asyncPostJSON: function (link, data) {
      return $q(function (resolve, reject) {
        $http({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
          url: link,
          data: data,
          responseType: 'blob',
        }).then(function (res) {
          resolve(res);
        }, function (err) {
          reject(err);
        });
      });
    },
    postMany: function (link, data, callback) {
      $http({
        method: 'POST',
        url: link,
        data: data,
      }).then(
        function (res) {
          callback(null, res);
        },
        function (err) {
          callback(err);
        }
      );
    },
    put: function (link, data, callback) {
      $http({
        method: 'PUT',
        url: link,
        data: [data],
      }).then(
        function (res) {
          callback(null, res);
        },
        function (err) {
          callback(err);
        }
      );
    },
    putJSON: function (link, data, callback) {
      $http({
        method: 'PUT',
        url: link,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        data: data,
      }).then(
        function (res) {
          callback(null, res);
        },
        function (err) {
          callback(err);
        }
      );
    },
    delete: function (link, callback) {
      $http({
        method: 'DELETE',
        url: link,
      }).then(
        function (res) {
          callback(null, res);
        },
        function (err) {
          callback(err);
        }
      );
    },
  };

  this._convertDates = function (array) {
    var __fields = [
      'Sukomplektuota',
      'Pristatyta',
      'Laikas_Nuo',
      'Laikas_Iki',
      'Pristatymo_Diena',
      'Ikelta',
      'Isvezta',
      'Grazinta',
    ];
    _.each(array, function (line) {
      _.each(__fields, function (key) {
        if (line[key]) {
          line[key] = moment(line[key] + 'Z').toDate();
          if (key === 'Laikas_Nuo' || key === 'Laikas_Iki') {
            var utc = moment(line[key]).utc().format('HH:mm');
            var date = moment(line[key]).format('YYYY-MM-DD');
            var time = convertUTCToLocalTime(utc);
            line[key] = date + ' ' + time;
          }
        }
      });
    });
    return array;
  };

  var _defaultStickerModel = {
    Aprasymas: '',
    Sildomas: 0,
    Be_Cukraus: 0,
    Baltymai: 0,
    Skaidulinis: 0,
    Veganinis: 0,
    Vegetarinis: 0,
    Be_pieno: 0,
  };

  this.pdfReport = {
    getSimplePart: function (date, cb) {
      var link = url + '/api/Production/Plan/Sum/' + date;
      _http.get(link, cb);
    },
    getDetailPart: function (date, cb) {
      var link = url + '/api/Production/Plan/Detail/' + date;
      _http.get(link, cb);
    },
    makeDayReport: function (date, simple, detail, cb) {
      var link = url + '/api/Production/Make-Day-Report';     
	  
      var formattedDate = moment(date).format('YYYY-MM-DD'); 
      var data = [{
          date: formattedDate,
          simpleTable: simple,
          detailTable: detail
      }];
	  
      $http({
        method: 'POST',
        url: link,
        data: data,
      }).then(
        function (res) {
          cb(null, res.data);
        },
        function (err) {
          cb(err);
        }
      );
    },
  };

  this.sendEmail = function (data, cb) {
      var link = url + '/api/General/Send-Email';
	  
      var data = [{
          To: data.To,
          CC: data.CC,
          Subject: data.Subject,
          Message: data.Message,
		  Attachment: data.Attachment
      }];	  
	  
      $http(
		{ method:'POST', url:link, data:data }
	  ).then(
        function (res) {
          cb(null, res.data);
        },
        function (err) {
          cb(err);
        }
      );
  };

  this.zaliavos = {
    get: function (uuid, diena) {
      var formattedDate = moment(diena).format('YYYY-MM-DD');
      var link = url + '/api/Production/Zaliavos/' + uuid + '/' + formattedDate;

      return _http.asyncGet(link);
    },
    add: function (RinkinioID, Kiekis, UUID, Diena) {
      var link = url + '/api/Production/Zaliavos/Add';
      var date = moment(Diena).format('YYYY-MM-DD');
      var data = [{
          RinkinioID: RinkinioID,
          Kiekis: Kiekis,
          UUID: UUID,
          Diena: date,
      }];

      return _http.asyncPostJSON(link, data);
    },
  };

  this.productionReport = {
    getCurrentDate: function () {
      var link = url + '/api/Production/Plan/Current-Day';

      return _http.asyncGet(link);
    },
    getSetsForDate: function (date) {
      var link = url + '/api/Production/Plan/Sum/' + date;

      return _http.asyncGet(link);
    },
    generateReport: function (uuid, date) {
	  var formattedDate = moment(date).format('YYYY-MM-DD');
      var link = url + '/api/Production/Report-Generate/' + uuid +'/' + formattedDate;

      return _http.asyncGet(link);
    },
    getListReports: function () {
      var link = url + '/api/Production/Get-List-Reports';

      return _http.asyncGet(link);
    }
  }

  this.conversions = {
    get: function (Zaliavos_Tipas, Zaliavos_ID) {
      var link = url + '/api/Conversions/Get/' + Zaliavos_Tipas + "/" + Zaliavos_ID;

      return _http.asyncGet(link);
    },
    create: function (data) {
      var link = url + '/api/Conversions/Create';
      var data = [{
          MatavimoVnt: data.MatavimoVnt,
          Dydis: data.Dydis,
          Zaliava: data.Zaliava,
          ZaliavosTipas: data.ZaliavosTipas
      }];

      _http.asyncPostJSON(link, data);
    },
    update: function (id, data) {
      var link = url + '/api/Conversions/Update/' + id;
      var data = [{
          MatavimoVnt: data.MatavimoVnt,
          Dydis: data.Dydis
      }];

      _http.asyncPostJSON(link, data);
    },
    delete: function (id) {
      var link = url + '/api/Conversions/Delete/' + id;

      _http.delete(link);
    }
  }
});
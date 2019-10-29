'use strict';

/**
 * @ngdoc function
 * @name erp7App.controller:ProductionModuleCtrl
 * @description
 * # ProductionModuleCtrl
 * Controller of the erp7App
 */
angular.module('erp7App')
  .controller('BagsTrackingCtrl', function ($scope, $mdDialog, api, Notificator, $filter, $timeout) {

    $scope.calendar = {
      date: moment()
    };

    $scope.alterTabs = {
      current: 0,
      set: function (nt) {
        $scope.alterTabs.current = nt;
      }
    }

    $scope.countAway = 0;
    $scope.totalLate = 0;
    $scope.showAll = true;

    function convertLocalTimeToUTC(hm) {
      var min = 1440;
      var minInHour = 60;

      var hrs = hm.substr(0, 2);
      var mnts = hm.substr(3, 2);
      var offset = (new Date()).getTimezoneOffset();

      if ((new Date()).dst()) {
        offset += 60;
      }

      mnts = Number(hrs) * minInHour + Number(mnts) + offset;
      if (mnts < 0) {
        mnts = min + mnts;
      }

      var resHrs = String(Math.floor(mnts / minInHour));
      var resMnts = String(mnts - resHrs * minInHour);
      if (resHrs.length < 2) {
        resHrs = '0' + String(resHrs);
      }
      if (resMnts.length < 2) {
        resMnts = '0' + String(resMnts);
      }

      return resHrs + ':' + resMnts;
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

    var loadDelayed = function (date) {
      api.orders.getAll(date, function (err, res) {
        $scope.delayed = res.data.map(function (bag) {
          bag.Laikas_Iki = convertUTCToLocalTime(bag.Laikas_Iki.substr(-8));
          bag.Laikas_Nuo = convertUTCToLocalTime(bag.Laikas_Nuo.substr(-8));

          return bag;
        });
        $scope.delayed.forEach(function (bag) {
          bag.late = bag.Pristatyta && !bag.Grazinta ? moment(moment().subtract(2, 'days')).isAfter(moment(bag.Pristatyta)) : false;
        });
        var away = _.filter($scope.delayed, function (db) {
          return !db.Grazinta && db.Isvezta;
        });
        if (away) {
          $scope.countAway = away.length;
        }
        else {
          $scope.countAway = 0;
        }
        // if(date == null) $scope.totalLate = res.data.length;
      })
    };

    $scope.$watch( //watch calendar date change
      function () {
        return $scope.calendar.date;
      },
      function () {
        // console.log("date changed");
        // console.log($scope.calendar.date.format("YYYY-MM-DD"))
        loadDelayed(moment($scope.calendar.date).format("YYYY-MM-DD"));
      }
    )

    $scope.conditionToShow = function (driver) {
      // decides if item has to be shown
      var __showAssignedOnly = $scope.showAssigedOnly;
      var __showAll = $scope.showAll;
      var __showNotAssigned = $scope.showNotAssigned;
      var __selectedDriver = $scope.driverToAssign;

      if (__showAssignedOnly && !driver) return true;
      if (__showAssignedOnly && driver) return false;
      if (__showAll) return true;
      if (__selectedDriver == driver) return true;
      if (!driver && __showNotAssigned) return true;

      return false;

    }

    $scope.searchCfg = 1;

    $scope.openCheck = function (driverId) {
      if (!$scope.day.isOpen) return Notificator.toast("Nėra atidarytos dienos")
      api.drivers.bags(driverId, function (err, res) {
        console.log(res);
        $mdDialog.show({
          controller: 'ProductionBagCheckCtrl',
          templateUrl: 'views/production/bag-check-modal.html',
          clickOutsideToClose: true,
          locals: {
            orders: res.data,
            driver: _.find($scope.drivers, function (drv) {
              return driverId == drv.ID
            }),
            currentDay: $scope.day.currentOpen
          }
        })
      })

    };

    $scope.openLabelModal = function () {
      $mdDialog.show({
        locals: { dateSelected: $scope.calendar.date },
        controller: 'ProductionBagLabelModalCtrl',
        templateUrl: 'views/production/bag-label-modal.html',
        clickOutsideToClose: true,
      }
      )
    }

    $scope.handout = function () {
      $mdDialog.show({
        controller: 'ProductionDriverHandoutCtrl',
        templateUrl: 'views/production/handout-print-modal.html',
        clickOutsideToClose: true,
      }
      )
    }

    $scope.searchLoading = false;

    $scope.search = function (input) {
      if (!input) return loadDelayed(moment($scope.calendar.date).format("YYYY-MM-DD"));
      if (input.length < 2) return loadDelayed(moment($scope.calendar.date).format("YYYY-MM-DD"));
      console.log($scope.barcodeInput);

      $timeout(
        function () {
          console.log(input === $scope.barcodeInput)
          if (input === $scope.barcodeInput) {
            $scope.searchLoading = true;
            api.orders.bagSearch(input,
              function (err, res) {
                console.log(err);
                console.log(res);
                $scope.delayed = api._convertDates(res.data);
                $scope.delayed.forEach(function (bag) {
                  bag.late = bag.Pristatyta && !bag.Grazinta ? moment(moment().subtract(2, 'days')).isAfter(moment(bag.Pristatyta)) : false;
                })
                $scope.searchLoading = false;
              }
            )
          }
        }, 800
      )

    }

    // $scope.search("");

    $scope.driversBags = 0;
    $scope.driversAddresses = 0;
    $scope.totalBags = 0;
    $scope.totalAddresses = 0;
    $scope.notAssignedBags = 0;
    $scope.recalculateBags = function (driverId) {
      var _filtered = _.filter($scope.bags, function (x) {
        return driverId == x.Vairuotojas;
      });
      var _notAssigned = _.filter($scope.bags, function (y) {
        return !y.Vairuotojas;
      })
      if (!driverId) _filtered = null;
      if (_filtered) {
        var _uniq = _.countBy(_filtered, "Adresas");
        //console.log(_uniq);
        var _keys = _.keys(_uniq);
        //console.log(_keys);
        $scope.driversBags = _filtered.length;
        $scope.driversAddresses = _keys.length;
      }
      else {
        $scope.driversBags = 0;
        $scope.driversAddresses = 0;
      }
      if ($scope.bags.length) {
        var _uniqTotal = _.countBy($scope.bags, "Adresas");
        console.log(_uniqTotal);
        var _keysTotal = _.keys(_uniqTotal);
        $scope.totalBags = $scope.bags.length || 0;
        $scope.totalAddresses = _keysTotal.length || 0;
      }
      else {
        $scope.totalBags = 0;
        $scope.totalAddresses = 0;
      }
      if (_notAssigned) {
        $scope.notAssignedBags = _notAssigned.length;
      }
      else {
        $scope.notAssignedBags = 0;
      }

    }

    $scope.filterAssign = {
      col: '',
      dir: 'asc',
      change: function (_col) {
        switch (true) {
          case _col == $scope.filterAssign.col && $scope.filterAssign.dir === 'asc':
            $scope.filterAssign.dir = 'desc'
            // $filter('orderBy')($scope.bags, _col, true)
            break;
          case _col == $scope.filterAssign.col && $scope.filterAssign.dir === 'desc':
            $scope.filterAssign.col = '';
            $scope.filterAssign.dir = 'asc';
            // $filter('orderBy')($scope.bags, 'ID', false)
            console.log($scope.bags)
            break;
          default:
            $scope.filterAssign.col = _col;
            $scope.filterAssign.dir = 'asc';
          // $filter('orderBy')($scope.bags, _col, false)
        };
        console.log($scope.filterAssign);
        localStorage.setItem('ao.7packErp@bagAssignment_col', $scope.filterAssign.col);
        localStorage.setItem('ao.7packErp@bagAssignment_dir', $scope.filterAssign.dir);
      }
    };

    $scope.filterAssign.col = localStorage.getItem('ao.7packErp@bagAssignment_col');
    $scope.filterAssign.dir = localStorage.getItem('ao.7packErp@bagAssignment_dir');

    // $scope.loading = true;
    $scope.assigmentDate = new Date();
    $scope.loadBags = function () {
      loadBags();
    }

    var loadBags = function () {
      $scope.loading = true;
      api.orders.getAll(moment($scope.assigmentDate).format("YYYY-MM-DD"), function (err, res) {
        console.log(res);
        $scope.loading = false;
        $scope.bags = api._convertDates(res.data);
        $scope.assign.selectedAll = false;
        $scope.recalculateBags($scope.driverToAssign);
      })
    }

    $scope.assign = {
      selectedAll: false,
      change: function () {
        $scope.assign.selectedAll = false;
      },
      selectAll: function () {
        _.each($scope.bags, function (bag) {
          if ($scope.conditionToShow(bag.Vairuotojas)) {
            bag.selectedForAssign = $scope.assign.selectedAll;
          }
          else {
            bag.selectedForAssign = false;
          }
        })
        // $scope.assign.selectedAll = !$scope.assign.selectedAll;
      },
      selectOne: function (idx) {
        if ($scope.currentTab == 1) {
          $scope.bags[idx].selectedForAssign = !$scope.bags[idx].selectedForAssign;
        }
      },
      set: function (driverId) {
        if (!driverId) driverId = null;
        var filtered = _.filter($scope.bags, function (bag) {
          return bag.selectedForAssign == true
        });
        var mapped = _.map(filtered, function (bag) {
          var _map = {
            "Barcode": bag.Barcode,
            "eiliskumas": bag.Eiliskumas,
            "Vairuotojas": driverId
          };
          return _map;
        });
        console.log(mapped);
        api.drivers.assignBags(mapped, function (err, res) {
          if (!err) {
            Notificator.toast("Krepšiai priskirti");
            loadBags();
          }
        })
      }
    }

    $scope.driverName = function (dId) {
      var __driver = _.find($scope.drivers, function (d) {
        return d.ID == dId;
      })
      if (__driver) return __driver.Vardas + " " + __driver.Pavarde;
      return dId;
    }

    $scope.totalLate = 0;

    var countLate = function () {
      api.orders.delayedBags(null, function (err, res) {
        $scope.totalLate = res.data.length;
      })
    }

    $scope.showLate = function () {
      api.orders.delayedBags(null, function (err, res) {
        console.log(res.data);
        $scope.totalLate = res.data.length;
        $scope.delayed = api._convertDates(res.data);
        console.log($scope.delayed)
        $scope.delayed.forEach(function (bag) {
          bag.late = bag.Pristatyta && !bag.Grazinta ? moment(moment().subtract(2, 'days')).isAfter(moment(bag.Pristatyta)) : false;
        })
      })
    }

    $scope.returnBag = function () {
      if ($scope.searchCfg == 2 && $scope.barcodeInput.length > 1) {
        api.orders.returnBag($scope.barcodeInput, function (err, res) {
          if (err) {
            Notificator.toast("Klaida. Neteisingas Barkodas");
          }
          else {
            Notificator.toast("Krepšys grąžintas");
            loadDelayed(moment($scope.calendar.date).format("YYYY-MM-DD"));
            countLate();
          }
          $scope.barcodeInput = '';
        }

        )
      }
    }

    $scope.inputChange = function () {
      if (!$scope.barcodeInput) return;
      switch ($scope.searchCfg) {
        case 1:
          $scope.search($scope.barcodeInput);
          break;
        case 2:
          // $scope.returnBag()
          break;
      }
    }

    $scope.day = {
      isOpen: false,
      open: function (date) {
        api.day.open(date, function (err, res) {
          if (err) return Notificator.toast("Klaida.");
          Notificator.toast("Diena Atidaryta");
          $scope.day.check();
        })

      },
      close: function () {
        api.day.close(function (err, res) {
          if (err) return Notificator.toast("Klaida.");
          Notificator.toast("Diena Uždaryta");
          $scope.day.check();
        })
      },
      currentOpen: null,
      check: function () {
        api.day.check(function (err, res) {
          if (err) return $scope.day.isOpen = false;
          console.log("CURRENT_DAY_INFO")
          console.log(res);
          if (res.data[0]) {
            $scope.day.currentOpen = res.data[0];
            $scope.day.isOpen = true;
          }
          else {
            $scope.day.isOpen = false;
          }
        })
      }
    }

    var init = function () {
      loadBags();
      loadDelayed(null);
      countLate();
      api.drivers.active(function (err, res) {
        if (!err) {
          $scope.drivers = res.data;
          console.log(res.data);
        }
      })
      $scope.day.check();
    }



    init();
  });

'use strict';

/**
 * @ngdoc function
 * @name erp7App.controller:ProductionPlanningCtrl
 * @description
 * # ProductionPlanningCtrl
 * Controller of the erp7App
 */
angular
  .module('erp7App')
  .controller('ProductionPlanningCtrl', function (
    $scope,
    api,
    $mdDialog,
    Notificator,
    FileSaver,
    Blob,
    $state
  ) {
    var customers;
    var calendarEntries;
    var publicHolidays;
    var currentDay;

    Date.prototype.stdTimezoneOffset = function() {
      var jan = new Date(this.getFullYear(), 0, 1);
      var jul = new Date(this.getFullYear(), 6, 1);

      return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
    }

    Date.prototype.dst = function() {
      return this.getTimezoneOffset() < this.stdTimezoneOffset();
    }

    function isToday(date) {
      return moment(currentDay).isSame(date);
    }

    function isWeekend(date) {
      date = new Date(date);
      return date.getDay() === 6 || date.getDay() === 0;
    }

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

    $scope.deliveryTimeFrom = [
      '03:00',
      '03:30',
      '04:00',
      '04:30',
      '05:00',
      '05:30',
      '06:00',
      '06:30',
      '07:00',
      '07:30',
      '08:00',
      '08:30',
      '09:00',
      '09:30',
      '10:00',
      '10:30',
    ];

    $scope.deliveryTimeTo = $scope.deliveryTimeFrom.map(function (time) {
      if (Number(time[1]) !== 9) {
        return time[0] + Number(Number(time[1]) + 1) + time[2] + time[3] + time[4];
      } else {
        return Number(time[0] + 1) + '0' + time[2] + time[3] + time[4];
      }
    });

    $scope.getTimeTo = function (from, customer) {
      var correct = customer
        ? customers.find(function (elem) {
          return elem.ID === id;
        })
        : $scope.newCustomer;
      if (Number(from[1]) !== 9) {
        correct.Laikas_Iki = from[0] + Number(Number(from[1]) + 1) + from[2] + from[3] + from[4];
      } else {
        correct.Laikas_Iki = Number(from[0] + 1) + '0' + from[2] + from[3] + from[4];
      }
      correct.deliveryTimeToTemp = $scope.deliveryTimeTo.filter(function (time) {
        return (
          Number(correct.Laikas_Iki.substr(0, 2) + correct.Laikas_Iki.substr(3, 2)) -
          Number(time.substr(0, 2) + time.substr(3, 2)) <=
          0
        );
      });
    };

    $scope.cityCodes = ['VLN', 'KNS'];

    $scope.newCustomer = {
      Adresas: null,
      Aukstas: null,
      Email: null,
      ID: null,
      Kodas: null,
      Laikas_Iki: '04:00',
      Laikas_Nuo: '03:00',
      Miestas: 'VLN',
      PPD: null,
      Pastabos_Gamybai: null,
      Pastabos_Kurjeriui: null,
      Pavarde: null,
      Telefonas: null,
      Vardas: null,
      deliveryTimeToTemp: $scope.deliveryTimeTo,
    };

    $scope.customersDisplayed = 20;
    $scope.calendarsDisplayed = 0;
    $scope.loadNext = function () {
      if ($scope.customers && !$scope.calendarEntries) {
        if ($scope.customersDisplayed < $scope.customers.length) {
          $scope.customersDisplayed += 10;
        }
      } else if ($scope.calendarEntries && !$scope.customers) {
        if ($scope.calendarsDisplayed < $scope.calendarEntries.length) {
          $scope.calendarsDisplayed += 10;
        }
      }
    };

    function formatCalendarData(data) {
      var calendarEntries = [];
      data.forEach(function (dbEntry) {
        var requiredEntry = calendarEntries.find(function (entry) {
          return (
            entry.client.ID === dbEntry.Kliento_ID && !entry.reservedDates.includes(dbEntry.Diena)
          );
        });
        var requiredClient = customers.find(function (customer) {
          return customer.ID === dbEntry.Kliento_ID;
        });
        var reservedDates = [];
        var rowSum = 0;
        var newRow = {
          client: requiredClient,
          cells: $scope.dates.map(function (date) {
            var obj = {
              date: date.formatDate,
              set: null,
              id: null,
              tooltip: null,
              style: {},
            };

            if (isToday(obj.date)) {
              obj.style = {
                background: 'rgba(255, 251, 142, 1)',
                color: 'black',
              };
            } else if (isWeekend(obj.date) || publicHolidays.includes(obj.date)) {
              obj.style = {
                background: 'lightgrey',
                color: 'black',
              };
            }

            if (moment(obj.date).isSame(dbEntry.Diena)) {
              obj.set = dbEntry.Rinkinio_ID;
              obj.id = dbEntry.ID;
              date.ordersInCurrentDate += 1;
              reservedDates.push(dbEntry.Diena);
              rowSum += 1;
              $scope.dates.sumOrders += 1;
            }
            return obj;
          }),
          reservedDates: reservedDates,
          sum: rowSum,
        };

        if (!requiredEntry) {
          calendarEntries.push(newRow);
        } else {
          var cell = requiredEntry.cells.find(function (cell) {
            return moment(cell.date).isSame(dbEntry.Diena);
          });
          if (cell.set === null) {
            cell.set = dbEntry.Rinkinio_ID;
            cell.id = dbEntry.ID;
            requiredEntry.reservedDates.push(dbEntry.Diena);
            requiredEntry.sum += 1;
          } else {
            calendarEntries.push(newRow);
          }
        }
      });
      // Duplicate check
      calendarEntries.forEach(function (entry, i) {
        var clone = calendarEntries.find(function (findItem, j) {
          if (i === j) return;
          return findItem.client.ID === entry.client.ID;
        });

        if (clone) {
          clone.isDuplicate = true;
          entry.isDuplicate = true;
          entry.style = {
            background: 'rgb(213,0,0)',
            color: 'rgba(255,255,255,0.87)',
          };
        } else {
          entry.isDuplicate = false;
          entry.style = {
            background: '',
            color: '',
          };
        }
      });
      //Set tooltips
      calendarEntries.forEach(function (entry) {
        entry.cells.forEach(function (cell) {
          if (cell.set) {
            api.sets.byId(cell.set, function (err, res) {
              if (err) return console.error(err);
              cell.tooltip = res.data[0].Pavadinimas;
            });
          }
        });
      });
      return calendarEntries;
    }

    function hasNotValue(item) {
      return item === null || item === undefined;
    }

    $scope.updateCustomer = function (id) {
      if (confirm('Ar tikrai norite atnaujinti įrašą')) {
        var correct = $scope.customers.find(function (elem) {
          return elem.ID === id;
        });
        if (
          hasNotValue(correct.Vardas) ||
          hasNotValue(correct.Pavarde) ||
          hasNotValue(correct.Laikas_Iki) ||
          hasNotValue(correct.Laikas_Nuo) ||
          hasNotValue(correct.Adresas) ||
          hasNotValue(correct.Miestas) ||
          hasNotValue(correct.Aukstas) ||
          hasNotValue(correct.Telefonas) ||
          hasNotValue(correct.Email)
        ) {
          return Notificator.alert('Klaida: there are fill required fields.');
        }

        var data = {
          Adresas: correct.Adresas,
          Aukstas: correct.Aukstas,
          Email: correct.Email,
          ID: correct.ID,
          Kodas: correct.Kodas,
          Laikas_Iki: correct.Laikas_Iki,
          Laikas_Nuo: correct.Laikas_Nuo,
          Miestas: correct.Miestas,
          PPD: correct.PPD ? 1 : 0,
          Pastabos_Gamybai: correct.Pastabos_Gamybai,
          Pastabos_Kurjeriui: correct.Pastabos_Kurjeriui,
          Pavarde: correct.Pavarde,
          Telefonas: correct.Telefonas,
          Vardas: correct.Vardas,
        };

        api.Customer.updateTemp(id, data, function (err, res) {
          if (err) return Notificator.alert('Klaida ' + err.status, err.data);
          $state.update();
        });
      }
    };

    $scope.addCustomer = function () {
      // if (
      //   hasNotValue($scope.newCustomer.Vardas) ||
      //   hasNotValue($scope.newCustomer.Pavarde) ||
      //   hasNotValue($scope.newCustomer.Laikas_Iki) ||
      //   hasNotValue($scope.newCustomer.Laikas_Nuo) ||
      //   hasNotValue($scope.newCustomer.Adresas) ||
      //   hasNotValue($scope.newCustomer.Miestas) ||
      //   hasNotValue($scope.newCustomer.Aukstas) ||
      //   hasNotValue($scope.newCustomer.Telefonas) ||
      //   hasNotValue($scope.newCustomer.Email)
      // ) {
      //   return Notificator.alert('Klaida: there are fill required fields.');
      // }

      var data = {
        Adresas: $scope.newCustomer.Adresas,
        Aukstas: $scope.newCustomer.Aukstas,
        Email: $scope.newCustomer.Email,
        ID: $scope.newCustomer.ID,
        Kodas: $scope.newCustomer.Kodas,
        Laikas_Iki: convertLocalTimeToUTC($scope.newCustomer.Laikas_Iki),
        Laikas_Nuo: convertLocalTimeToUTC($scope.newCustomer.Laikas_Nuo),
        Miestas: $scope.newCustomer.Miestas,
        PPD: $scope.newCustomer.PPD ? 1 : 0,
        Pastabos_Gamybai: $scope.newCustomer.Pastabos_Gamybai,
        Pastabos_Kurjeriui: $scope.newCustomer.Pastabos_Kurjeriui,
        Pavarde: $scope.newCustomer.Pavarde,
        Telefonas: $scope.newCustomer.Telefonas,
        Vardas: $scope.newCustomer.Vardas,
      };

      api.Customer.addTemp(data, function (err) {
        if (err) {
          console.error(err);
          return Notificator.alert('Klaida ' + err.status, err.data);
        }
        $state.reload();
      });
    };

	var currentDate = new Date();
	var currentYear = currentDate.getFullYear();
	currentDate.setFullYear(currentYear - 1);
	var prevYear = currentDate.getFullYear();
	currentDate.setFullYear(currentYear + 1);
	var nextYear = currentDate.getFullYear();
	
    $scope.yearsOfDelivery = [prevYear, currentYear, nextYear];
    $scope.selectedYears = [];
    $scope.selectedYears.push(currentYear);

    $scope.persons = [];
    $scope.selectedPerson = null;
    $scope.monthsOfDelivery = [
      {
        index: 1,
        name: 'Sausis',
      },
      {
        index: 2,
        name: 'Vasaris',
      },
      {
        index: 3,
        name: 'Kovas',
      },
      {
        index: 4,
        name: 'Balandis',
      },
      {
        index: 5,
        name: 'Gegužė',
      },
      {
        index: 6,
        name: 'Birželis',
      },
      {
        index: 7,
        name: 'Liepa',
      },
      {
        index: 8,
        name: 'Rugpjūtis',
      },
      {
        index: 9,
        name: 'Rugsėjis',
      },
      {
        index: 10,
        name: 'Spalis',
      },
      {
        index: 11,
        name: 'Lapkritis',
      },
      {
        index: 12,
        name: 'Gruodis',
      },
    ];
    $scope.selectedMonths = [];
    $scope.selectedMonths.push($scope.monthsOfDelivery[new Date().getMonth()]);

    function daysInMonth(month, year) {
      return new Date(year, month, 0).getDate();
    }

    function calculateDates(begin) {
      var dates = [];
      $scope.selectedYears.sort();
      $scope.selectedMonths.sort(function (a, b) {
        return a.index - b.index;
      });
      $scope.selectedYears.forEach(function (year) {
        $scope.selectedMonths.forEach(function (month) {
          var days = daysInMonth(month.index, year);
          for (var k = 1; k <= days; k++) {
            var tmpDay = k < 10 ? '0' + k : k;
            var tmpMonth = month.index < 10 ? '0' + month.index : month.index;
            var tmpYear = year.toString().substr(2);
            var formatDate =
              year +
              '-' +
              (month.index >= 10 ? month.index : '0' + month.index) +
              '-' +
              (k >= 10 ? k : '0' + k);
            dates.push({
              dateString: tmpDay + '.' + tmpMonth + '.' + tmpYear,
              formatDate: formatDate,
              ordersInCurrentDate: 0,
              style: {},
            });
          }
        });
      });
      dates.sumOrders = 0;

      $scope.begin = begin || 0;
      $scope.limit = 14;

      return dates;
    }

    $scope.canIGetPrevDates = false;
    $scope.canIGetNextDates = true;

    $scope.getNextDates = function () {
      var len = $scope.dates.length;
      if ($scope.begin + 2 * $scope.limit < len) {
        $scope.begin += $scope.limit;
      } else {
        while ($scope.begin + 1 <= len - $scope.limit) {
          $scope.begin += 1;
        }
        $scope.canIGetNextDates = false;
      }
      $scope.canIGetPrevDates = true;
    };

    $scope.getPrevDates = function () {
      if ($scope.begin - $scope.limit >= 0) {
        $scope.begin -= $scope.limit;
      } else {
        while ($scope.begin - 1 >= 0) {
          $scope.begin -= 1;
        }
        $scope.canIGetPrevDates = false;
      }
      $scope.canIGetNextDates = true;
    };

    $scope.prepareCalendar = function (begin) {
      $scope.loadingCalendar = true;
      $scope.customers = null;
      if (calendarEntries) {
        $scope.calendarEntries = calendarEntries;
        $scope.loadingCalendar = false;
      } else {
        var monthsIndexes = $scope.selectedMonths
          .map(function (item) {
            return item.index;
          })
          .sort(function (a, b) {
            return a - b;
          });

        $scope.dates = calculateDates(begin);
        api.calendar.getRawCalendar(monthsIndexes, $scope.selectedYears, function (
          rawCalendarErr,
          rawCalendar
        ) {
          api.calendar.getCurrentDay(function (currentDayErr, curDay) {
            api.calendar.getHolidays(function (holidaysErr, holidays) {
              if (currentDayErr) return console.error(currentDayErr);
              if (holidaysErr) return console.error(holidaysErr);
              if (rawCalendarErr) return console.error(rawCalendarErr);

              publicHolidays = holidays.data.map(function (item) {
                return moment(item.Data).format('YYYY-MM-DD');
              });

              currentDay = moment(curDay.data[0]).format('YYYY-MM-DD');

              calendarEntries = formatCalendarData(rawCalendar.data);
              $scope.calendarEntries = calendarEntries;

              $scope.loadingCalendar = false;
            });
          });
        });
      }
    };

    $scope.prepareCustomers = function () {
      $scope.loadingCustomers = true;
      $scope.calendarEntries = null;
      if (customers) {
        $scope.customers = customers;
        $scope.loadingCustomers = false;
      } else {
        api.Customer.getAll(function (customerErr, list) {
          if (customerErr) return console.error(customerErr);

          customers = list.data.map(function (item) {
            item.PPD = !!item.PPD;
            item.Laikas_Nuo = convertUTCToLocalTime(item.Laikas_Nuo.substr(0, 5));
            item.Laikas_Iki = convertUTCToLocalTime(item.Laikas_Iki.substr(0, 5));
            item.deliveryTimeToTemp = $scope.deliveryTimeTo;
            item.Pastabos_Gamybai = item.Pastabos_Gamybai || null;
            item.Pastabos_Kurjeriui = item.Pastabos_Kurjeriui || null;
            item.Kodas = item.Kodas || null;
            item.FullName = item.Vardas + ' ' + item.Pavarde;
            item.IdName = item.FullName + ' (' + item.ID + ')';
            return item;
          });

          $scope.customers = customers;

          $scope.newOrder = customers[0];
          $scope.loadingCustomers = false;
        });
      }
    };

    $scope.getMatches = function (searchStirng) {
      var matches = _.filter(customers, function (c) {
        return c.FullName.toLowerCase().includes(searchStirng.toLowerCase());
      });
      return matches;
    };

    $scope.dropCustomersDisplayed = function () {
      $scope.customersDisplayed = 0;
      $scope.customers = null;
    };

    $scope.resetCustomersDisplayed = function () {
      $scope.prepareCustomers();
      $scope.customersDisplayed = 20;
    };

    $scope.dropCalendarsDisplayed = function () {
      $scope.calendarsDisplayed = 0;
      $scope.calendarEntries = null;
    };

    $scope.resetCalendarsDisplayed = function () {
      $scope.prepareCalendar();
      $scope.calendarsDisplayed = 20;
    };

    function checkHoliday(date, holydays) {
      var checking = 0;

      var holydayDate = new Date();
      holydays.forEach(function (holyday) {
        holydayDate = new Date(holyday.Data);
        if (holydayDate == date) {
          date.setDate(date.getDate() - 1);
          checking = 1;
        }
      });
      if (date.getDay() == 6 || date.getDay() == 0) {
        date.setDate(date.getDate() - 1);
        checking = 1;
      }

      if (checking == 1) return checkHoliday(date, holydays);
      else return date;
    }

    function includes(arr, date) {
      for (var i = 0; i < arr.length; i++) {
        if (moment(arr[i].Data).isSame(moment(date))) {
          return true;
        }
      }
      return false;
    }

    $scope.PDFReport = function () {
	  $scope.pdfPreparing = true;
      try {
        api.calendar.getCurrentDay(function (err, curDay) {
          if (err) throw err;

          var formattedDate = moment(curDay.data[0]);

          api.calendar.getHolidays(function (err, holidays) {
            if(err) throw err;

            do {
              formattedDate = formattedDate.subtract(1, 'days');
            } while(includes(holidays.data, formattedDate) || formattedDate.day() === 6 || formattedDate.day() === 0);

            formattedDate = formattedDate.format('YYYY-MM-DD');

            api.pdfReport.getSimplePart(formattedDate, function (err, simple) {
              if (err) throw err;

              api.pdfReport.getDetailPart(formattedDate, function (err, detail) {
                if (err) throw err;

                api.pdfReport.makeDayReport(formattedDate, simple.data, detail.data, function (err, reportPath) {
                  if (err) throw err;

				  $scope.pdfPreparing = false;
                  Notificator.alert("GAMYBAS LAPAS", "<a href=\"" + reportPath + "\">" + reportPath.substring(reportPath.lastIndexOf('/') + 1) + "</a>");
                });
              });
            });
          });
        });
      } catch (e) {
        $scope.pdfPreparing = false;
        console.error(e.message);
      }
    };

    function canEdit(date) {
      return (moment(date).isAfter(currentDay) || isToday(date)) && !isWeekend(date);
    }

    $scope.updateTable = function (begin) {
      calendarEntries = null;
      $scope.prepareCalendar(begin);
    };

    $scope.selectSet = function (date, customerId, entryId, setId) {
      var begin = $scope.begin;
      if (canEdit(date)) {
        if (entryId && setId) {
          // Update record
          $mdDialog.show({
            locals: { customerId: customerId, entryId: entryId, setId: setId },
            templateUrl: 'views/production/change-set-dialog.html',
            clickOutsideToClose: true,
            controller: 'ChangeSetCtrl',
            onRemoving: function () {
              if (confirm('Atnaujinti lentelę?')) {
                $scope.updateTable(begin);
              }
            },
          });
        } else {
          // Add record
          $mdDialog.show({
            locals: {
              date: date,
              customerId: customerId,
              holidays: publicHolidays,
            },
            templateUrl: 'views/production/select-set-dialog.html',
            clickOutsideToClose: true,
            controller: 'SelectSetCtrl',
            onRemoving: function () {
              if (confirm('Atnaujinti lentelę?')) {
                $scope.updateTable(begin);
              }
            },
          });
        }
      }
    };

    $scope.editRow = function (customer) {
      $mdDialog.show({
        locals: {
          customer: customer,
          timeFrom: $scope.deliveryTimeFrom,
          timeTo: $scope.deliveryTimeTo,
          codes: $scope.cityCodes,
          hasNotValue: hasNotValue,
          convertLocalTimeToUTC: convertLocalTimeToUTC,
        },
        templateUrl: 'views/production/edit-row-dialog.html',
        clickOutsideToClose: true,
        controller: 'EditRowCtrl',
      });
    };

    $scope.changeOrder = function (field) {
      if (field === $scope.orderField) {
        $scope.orderField = '-' + $scope.orderField;
      } else {
        $scope.orderField = field;
      }
    };

    $scope.changeCalendarOrder = function (field) {
      if (field === $scope.calendarOrderField) {
        $scope.calendarOrderField = '-' + $scope.calendarOrderField;
      } else {
        $scope.calendarOrderField = field;
      }
    };

    $scope.headerBackground = function (date) {
      var style = { background: '' };

      if (isToday(date)) {
        style['background'] = 'rgba(255, 251, 142, 1)';
      } else if (isWeekend(date) || (publicHolidays && publicHolidays.includes(date))) {
        style['background'] = 'lightgrey';
      }
      return style;
    };

    $scope.closeDay = function () {
      if (confirm('Ar tikrai norite uždaryti dieną?')) {
        var begin = $scope.begin;
        try {
            api.calendar.getCurrentDay(function (err, curDay) {
              if (err) throw err;
              var formattedDate = moment(curDay.data[0]).format('YYYY-MM-DD');
              api.pdfReport.getSimplePart(formattedDate, function (err, simple) {
                if (err) throw err;
                api.pdfReport.getDetailPart(formattedDate, function (err, detail) {
                  if (err) throw err;
                  api.pdfReport.makeDayReport(formattedDate, simple.data, detail.data, function (err, reportPath) {
                    if (err) throw err;
				    var data = { 
					  To : "info@7pack.lt",
					  CC : "mindaugas@7pack.lt",
					  Subject : "Report",
					  Message : "Here is a report for " + formattedDate,
					  Attachment : reportPath
				    };
                    api.sendEmail(data, function (err, res) {
						if (err) throw err;						
					  api.calendar.closeDay(function (err) {
						if (err) return console.error(err);
					  });
                    });
                    if (confirm('Atnaujinti lentelę?')) {
                      $scope.updateTable(begin);
                    }
                  });
                });
              });
            });
        } catch (e) {
          console.error(e.message);
        }
      }
    };
  })
  .filter('filterCustomers', function () {
    return function (customers, prop) {
      if (!customers) {
        return;
      } else if (!prop) {
        return customers;
      } else {
        return customers.filter(function (c) {
          var result =
            c.FullName.toLowerCase().includes(prop.toLowerCase()) ||
            c.Telefonas.toLowerCase().includes(prop.toLowerCase()) ||
            c.Email.toLowerCase().includes(prop.toLowerCase()) ||
            c.Adresas.toLowerCase().includes(prop.toLowerCase());
          if (c.Pastabos_Kurjeriui) {
            result = result || c.Pastabos_Kurjeriui.toLowerCase().includes(prop.toLowerCase());
          }

          return result;
        });
      }
    };
  });

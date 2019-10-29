'use strict';

/**
 * @ngdoc function
 * @name erp7App.controller:ProductionReportCtrl
 * @description
 * # ProductionReportCtrl
 * Controller of the erp7App
 */
angular.module('erp7App')
  .controller('ProductionReportCtrl', function ($scope, $q, Blob, FileSaver, api, Notificator) {

    $scope.alterTabs = {
      current: 0,
      set: function (nt) {
        $scope.alterTabs.current = nt;
      }
    }
	
    var report = this;

    report.isLoaded = false;
    report.generating = false;
    report.sets = [];

    function generateUUID() {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11)
        .replace(/[018]/g, function (c) {
          return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        });
    }

    api.productionReport.getCurrentDate()
      .then(function (resp) {
        report.date = moment(resp.data[0]);
        report.maxDate = report.date.toDate();
      })
      .catch(function (err) {
        Notificator.alert("Klaida " + err.status, err.data.Message);
      })
      .finally(function () {
        report.isLoaded = true;
      });

    this.onlyWeekdaysPredicate = function (date) {
      var day = date.getDay();
      return day > 0 && day < 6;
    };

    this.getSets = function () {
      report.isLoaded = false;

      var date = moment(report.date).format('YYYY-MM-DD');

      api.productionReport.getSetsForDate(date)
        .then(function (resp) {
          report.sets = resp.data;
        })
        .catch(function (err) {
          Notificator.alert("Klaida " + err.status, err.data.Message);
        })
        .finally(function () {
          report.isLoaded = true;
        });
    };

    this.generate = function () {
      if (report.sets.length > 0) {
        report.generating = true;

        var setRegEx = /^\((\d+)\)(\s)(.*)$/;
        var uuid = generateUUID();
        var date = moment(report.date).format('YYYY-MM-DD');
        var sets = report.sets.map(function (set) {
          return {
            id: set.Rinkinys.match(setRegEx)[1],
            name: set.Rinkinys.match(setRegEx)[3],
            amount: set.Kiekis
          }
        });

        var addPromises = [];
        sets.forEach(function (set) {
          addPromises.push(api.zaliavos.add(set.id, set.amount, uuid, date));
        });
        $q.all(addPromises)
          .then(function () {
            return api.productionReport.generateReport(uuid, date);
          })
          .then(function (resp) {
			Notificator.alert("Ataskaita bus rodoma kortelėje \"PDF ATASKAITOS\" po 15 minučių, palaukite.");
          })
          .catch(function (err) {
            console.error(err);
            Notificator.alert("Klaida " + err.status > 0 ? err.status : "Unknown", err.data ? err.data.Message : "Unknown");
          })
          .finally(function () {
            report.generating = false;
          });
      }
    }
	
	api.productionReport.getListReports()
      .then(function (resp) {
		var reports = JSON.parse(resp.data);
		var listReports = [];
		reports.list.forEach(function (report) {
			listReports.push({
				"name" : report["name"].split('.')[0],
				"date" : moment(report["date"]).format('YYYY-MM-DD'),
				"path" : report["path"]
			});
		});
        $scope.listReports = listReports;
      })
      .catch(function (err) {
        Notificator.alert(err.status, err.data.Message);
      });
  });

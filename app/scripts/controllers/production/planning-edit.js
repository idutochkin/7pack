'use strict';

/**
 * @ngdoc function
 * @name erp7App.controller:PlanningEditCtrl
 * @description
 * # PlanningEditCtrl
 * Controller of the erp7App
 */
angular.module('erp7App')
    .controller('PlanningEditCtrl', function($scope, api, $mdDialog, Notificator, $state, $stateParams) {
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

        $scope.deliveryTimeTo = $scope.deliveryTimeFrom.map(function(time) {
            if (Number(time[1]) !== 9) {
                return time[0] + Number(Number(time[1]) + 1) + time[2] + time[3] + time[4];
            } else {
                return Number(time[0] + 1) + '0' + time[2] + time[3] + time[4];
            }
        });

        $scope.isWeekend = function(date) {
            date = new Date(date);
            return (date.getDay() === 6) || (date.getDay() === 0);
        };

        function getPlan() {
            if ($scope.customers) {
                var monthsIndexes = $scope.selectedMonths.map(function(item) {
                    return item.index;
                });
                api.sets.returnPlan(monthsIndexes, $scope.selectedYears, function(err, plan) {
                    $scope.calendarEntries = [];
                    $scope.dates.map(function(date) {
                        date.ordersInCurrentDate = 0;
                        return date;
                    });

                    $scope.calendarEntries = [];
                    plan.data.forEach(function(dbEntry) {
                        var requiredEntry = $scope.calendarEntries.find(function(entry) {
                            return entry.client.ID === dbEntry.Kliento_ID && !entry.reservedDates.includes(dbEntry.Diena);
                        });
                        var requiredClient = $scope.customers.find(function(customer) {
                            return customer.ID === dbEntry.Kliento_ID;
                        });
                        var reservedDates = [];
                        var rowSum = 0;
                        var newRow = {
                            client: requiredClient,
                            cells: $scope.dates.map(function(date) {
                                var obj = {
                                    date: date.formatDate,
                                    set: null,
                                    id: null,
                                    tooltip: null
                                };

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
                            sum: rowSum
                        };

                        if (!requiredEntry) {
                            $scope.calendarEntries.push(newRow);
                        } else {
                            for (var i = 0, max = requiredEntry.cells.length; i < max; i++) {
                                if (moment(requiredEntry.cells[i].date).isSame(dbEntry.Diena)) {
                                    if (requiredEntry.cells[i].set === null) {
                                        requiredEntry.cells[i].set = dbEntry.Rinkinio_ID;
                                        requiredEntry.cells[i].id = dbEntry.ID;
                                        requiredEntry.reservedDates.push(dbEntry.Diena);
                                        requiredEntry.sum += 1;
                                    } else {
                                        $scope.calendarEntries.push(newRow);
                                    }
                                    break;
                                }
                            }
                        }
                    });
                    // Duplicate check
                    $scope.calendarEntries.forEach(function(entry, i) {
                        var clone = $scope.calendarEntries.find(function(findItem, j) {
                            if (i === j) return;
                            return findItem.client.ID === entry.client.ID;
                        });

                        if (clone) {
                            clone.isDuplicate = true;
                            entry.isDuplicate = true;
                            entry.style = {
                                'background': 'rgb(213,0,0)',
                                'color': 'rgba(255,255,255,0.87)'
                            }
                        } else {
                            entry.isDuplicate = false;
                            entry.style = {
                                'background': '',
                                'color': ''
                            }
                        }
                    });
                    $scope.calendarEntries.forEach(function(entry) {
                        entry.cells.forEach(function(cell) {
                            if (cell.set) {
                                api.sets.byId(cell.set, function(err, res) {
                                    cell.tooltip = res.data[0].Pavadinimas;
                                });
                            }
                        });
                    });
                    console.log('Calendar', $scope.calendarEntries);
                });
            }
        }

        api.Customer.listTemp(function(customerErr, list) {
            api.holidays.getAll(function(holidaysErr, holidays) {
                api.sets.getCurrentDay(function(currentDayErr, currentDay) {

                    if (customerErr) return console.error(customerErr);
                    else if (holidaysErr) return console.error(holidaysErr);
                    else if (currentDayErr) return console.error(currentDayErr);


                    $scope.currentDay = moment(currentDay.data[0]).format('YYYY-MM-DD');

					var i = 0;
					var key = 0;
                    $scope.customers = list.data.map(function(item) {
						if(item.ID == $stateParams.id) {
							item.PPD = !!item.PPD;
							item.Laikas_Nuo = item.Laikas_Nuo.substr(0, 5);
							item.Laikas_Iki = item.Laikas_Iki.substr(0, 5);
							item.deliveryTimeToTemp = $scope.deliveryTimeTo;
							item.Pastabos_Gamybai = item.Pastabos_Gamybai ? item.Pastabos_Gamybai : null;
							item.Pastabos_Kurjeriui = item.Pastabos_Kurjeriui ? item.Pastabos_Kurjeriui : null;
							item.Kodas = item.Kodas ? item.Kodas : null;
							item.FullName = item.Vardas + ' ' + item.Pavarde;
							key = i;
							return item;
						}
						i++;
                    });
                    $scope.newOrder = $scope.customers[0];
                    $scope.customer = $scope.customers[key];

                    $scope.publicHolidays = holidays.data.map(function(item) {
                        return moment(item.Data).format('YYYY-MM-DD');
                    });
                    //getPlan();
                });
            });
        });

        $scope.getTimeTo = function(from, customer) {
            var correct = customer ? $scope.customers.find(function(elem) {
                return elem.ID === id
            }) : $scope.newCustomer;
            if (Number(from[1]) !== 9) {
                correct.Laikas_Iki = from[0] + Number(Number(from[1]) + 1) + from[2] + from[3] + from[4];
            } else {
                correct.Laikas_Iki = Number(from[0] + 1) + '0' + from[2] + from[3] + from[4];
            }
            correct.deliveryTimeToTemp = $scope.deliveryTimeTo.filter(function(time) {
                return Number(correct.Laikas_Iki.substr(0, 2) + correct.Laikas_Iki.substr(3, 2)) -
                    Number(time.substr(0, 2) + time.substr(3, 2)) <= 0;
            });
        };

        function hasNotValue(item) {
            return item === null || item === undefined;
        }

        $scope.updateCustomer = function() {
            if (confirm('Ar tikrai norite atnaujinti įrašą')) {
                var correct = $scope.customer;
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
                    return Notificator.alert("Klaida: there are fill required fields.");
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
                    Vardas: correct.Vardas
                };
                api.Customer.updateTemp($stateParams.id, data, function(err, res) {
                    if (err) return Notificator.alert("Klaida " + err.status, err.data);
                });
            }
        };

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
            deliveryTimeToTemp: $scope.deliveryTimeTo
        };

        $scope.addCustomer = function() {
            if (
                hasNotValue($scope.newCustomer.Vardas) ||
                hasNotValue($scope.newCustomer.Pavarde) ||
                hasNotValue($scope.newCustomer.Laikas_Iki) ||
                hasNotValue($scope.newCustomer.Laikas_Nuo) ||
                hasNotValue($scope.newCustomer.Adresas) ||
                hasNotValue($scope.newCustomer.Miestas) ||
                hasNotValue($scope.newCustomer.Aukstas) ||
                hasNotValue($scope.newCustomer.Telefonas) ||
                hasNotValue($scope.newCustomer.Email)
            ) {
                return Notificator.alert("Klaida: there are fill required fields.");
            }

            var data = {
                Adresas: $scope.newCustomer.Adresas,
                Aukstas: $scope.newCustomer.Aukstas,
                Email: $scope.newCustomer.Email,
                ID: $scope.newCustomer.ID,
                Kodas: $scope.newCustomer.Kodas,
                Laikas_Iki: $scope.newCustomer.Laikas_Iki + ':00',
                Laikas_Nuo: $scope.newCustomer.Laikas_Nuo + ':00',
                Miestas: $scope.newCustomer.Miestas,
                PPD: $scope.newCustomer.PPD ? 1 : 0,
                Pastabos_Gamybai: $scope.newCustomer.Pastabos_Gamybai,
                Pastabos_Kurjeriui: $scope.newCustomer.Pastabos_Kurjeriui,
                Pavarde: $scope.newCustomer.Pavarde,
                Telefonas: $scope.newCustomer.Telefonas,
                Vardas: $scope.newCustomer.Vardas,
            };
            api.Customer.addTemp(data, function(err, res) {
                if (err) return Notificator.alert("Klaida " + err.status, err.data);
                $state.reload();
            });
        };

        $scope.cityCodes = ['VLN', 'KNS'];

        $scope.PPD = false;

        $scope.yearsOfDelivery = [
            '2017',
            '2018',
            '2019',
        ];
        $scope.selectedYears = [];
        $scope.selectedYears.push(new Date().getFullYear());

        $scope.persons = [];
        $scope.selectedPerson = null;
        $scope.monthsOfDelivery = [
            {
                index: 1,
                name: 'Sausis'
            },
            {
                index: 2,
                name: 'Vasaris'
            },
            {
                index: 3,
                name: 'Kovas'
            },
            {
                index: 4,
                name: 'Balandis'
            },
            {
                index: 5,
                name: 'Gegužė'
            },
            {
                index: 6,
                name: 'Birželis'
            },
            {
                index: 7,
                name: 'Liepa'
            },
            {
                index: 8,
                name: 'Rugpjūtis'
            },
            {
                index: 9,
                name: 'Rugsėjis'
            },
            {
                index: 10,
                name: 'Spalis'
            },
            {
                index: 11,
                name: 'Lapkritis'
            },
            {
                index: 12,
                name: 'Gruodis'
            }
        ];
        $scope.selectedMonths = [];
        $scope.selectedMonths.push($scope.monthsOfDelivery[new Date().getMonth()]);

        function daysInMonth(month, year) {
            return new Date(year, month, 0).getDate();
        }

        $scope.calculateDates = function(begin) {
            $scope.dates = [];
            $scope.selectedYears.sort();
            $scope.selectedMonths.sort(function(a, b) {
                return a.index - b.index;
            });
            $scope.selectedYears.forEach(function(year, i, years) {
                $scope.selectedMonths.forEach(function(month, j, months) {
                    var days = daysInMonth(month.index, year);
                    for (var k = 1; k <= days; k++) {
                        var tmpDay = k < 10 ? '0' + k : k;
                        var tmpMonth = month.index < 10 ? '0' + month.index : month.index;
                        var tmpYear = year.toString().substr(2);
                        var formatDate = year + '-' + (month.index >= 10 ? month.index : '0' + month.index) + '-' + (k >= 10 ? k : '0' + k);
                        $scope.dates.push({
                            dateString: tmpDay + '.' + tmpMonth + '.' + tmpYear,
                            formatDate: formatDate,
                            ordersInCurrentDate: 0
                        });
                    }
                });
            });
            $scope.dates.sumOrders = 0;
            getPlan();

            $scope.begin = begin || 0;
            $scope.limit = 14;
        };
        $scope.calculateDates();

        $scope.begin = 0;
        $scope.limit = 14;

        $scope.canIGetPrevDates = false;
        $scope.canIGetNextDates = true;

        $scope.getNextDates = function() {
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

        $scope.getPrevDates = function() {
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

        $scope.PDFReport = function() {
            var formattedDate = moment(new Date()).format('YYYY-MM-DD');
            api.pdfReport.getSimplePart(formattedDate, function(err, simple) {
                if (err) return Notificator.alert("Klaida " + err.status, err.data);

                api.pdfReport.getDetailPart(formattedDate, function(err, detail) {
                    if (err) return Notificator.alert("Klaida " + err.status, err.data);

                    var upperTable = [
                        ['Rinkinys', 'Kiekis', 'Pastabos'].map(function(item) {
                            return {
                                text: item,
                                style: 'header'
                            }
                        })
                    ];
                    simple.data.forEach(function(pdf) {
                        upperTable.push([
                            pdf.Rinkinys,
                            pdf.Kiekis,
                            pdf.Pastabos
                        ]);
                    });

                    var lowerTable = [
                        ['Nr', 'Vardas Pavardė', 'Rinkinys', 'Gamybos pastabos', 'Vienkartinis', 'Pirmas'].map(function(item) {
                            return {
                                text: item,
                                style: 'header'
                            }
                        })
                    ];
                    detail.data.forEach(function(pdf) {
                        lowerTable.push([
                            pdf.Nr,
                            pdf.Vardas_Pavarde,
                            pdf.Pavadinimas,
                            pdf.Gamybos_Pastabos,
                            pdf.Vienkartinis ? 'Taip' : '',
                            pdf.Pirmas ? 'Taip' : ''
                        ]);
                    }
                    );

                    var docDefinition = {
                        pageOrientation: 'landscape',
                        content: [
                            {
                                text: 'Dienos gamybos planas pagal vartotojus',
                                style: {
                                    fontSize: 24,
                                    alignment: 'center'
                                }
                            },
                            {
                                text: String(moment(formattedDate).format('YYYY.MM.DD')),
                                style: {
                                    fontSize: 24,
                                    alignment: 'center'
                                }
                            },
                            {
                                text: 'Suminis',
                                style: {
                                    fontSize: 18,
                                    alignment: 'center'
                                },
                                margin: [0, 15, 0, 0]
                            },
                            {
                                table: {
                                    headerRows: 1,
                                    widths: ['*', '*', '*'],

                                    body: upperTable
                                },
                                style: {
                                    alignment: 'center'
                                }
                            },
                            {
                                text: 'Detalus pagal vartotojus',
                                style: {
                                    fontSize: 18,
                                    alignment: 'center'
                                },
                                margin: [0, 60, 0, 0]
                            },
                            {
                                table: {
                                    headerRows: 1,
                                    widths: ['*', '*', '*', '*', '*', '*'],

                                    body: lowerTable
                                },
                                style: {
                                    alignment: 'center'
                                }
                            }
                        ],
                        styles: {
                            header: {
                                fillColor: 'lightgrey',
                                bold: true
                            },
                        }
                    };
                    pdfMake.createPdf(docDefinition).open();
                    pdfMake.createPdf(docDefinition).download();
                });
            });
        };

        $scope.canAddOrUpdate = function(date) {
            return (moment(date).isAfter($scope.currentDay) ||
                $scope.isToday(date)) && !$scope.isWeekend(date);
        }

        $scope.selectSet = function(date, customerId, entryId, setId) {
            var begin = $scope.begin;
            if (
                entryId &&
                setId &&
                $scope.canAddOrUpdate(date)
            ) {
                // Update record
                $mdDialog.show({
                    locals: { customerId: customerId, entryId: entryId, setId: setId },
                    templateUrl: 'views/production/change-set-dialog.html',
                    clickOutsideToClose: true,
                    controller: 'ChangeSetCtrl',
                    onRemoving: function(event, removePromise) {
                        $scope.calculateDates(begin);
                    }
                })
            } else if (
                $scope.canAddOrUpdate(date)
            ) {
                // Add record
                $mdDialog.show({
                    locals: { date: date, customerId: customerId, holidays: $scope.publicHolidays },
                    templateUrl: 'views/production/select-set-dialog.html',
                    clickOutsideToClose: true,
                    controller: 'SelectSetCtrl',
                    onRemoving: function(event, removePromise) {
                        $scope.calculateDates(begin);
                    }
                })
            }
        };

        $scope.changeOrder = function(field) {
            if (field === $scope.orderField) {
                $scope.orderField = '-' + $scope.orderField;
            } else {
                $scope.orderField = field;
            }
        };

        $scope.changeCalendarOrder = function(field) {
            if (field === $scope.calendarOrderField) {
                $scope.calendarOrderField = '-' + $scope.calendarOrderField;
            } else {
                $scope.calendarOrderField = field;
            }
        };

        $scope.isToday = function(date) {
            return moment($scope.currentDay).isSame(date);
        };

        $scope.cellBackgroundStyle = function(date) {
            if ($scope.publicHolidays) {
                if ($scope.isWeekend(date) || $scope.publicHolidays.includes(date)) {
                    return {
                        'background': 'lightgrey'
                    };
                } else if ($scope.isToday(date)) {
                    return {
                        'background': 'rgba(255, 251, 142, 1)',
                        'color': 'black'
                    };
                }
                return {
                    'background': '',
                    'color': ''
                };
            }
        };

        $scope.closeDay = function() {
            if (confirm('Ar tikrai norite uždaryti dieną?')) {
                var begin = $scope.begin;
                api.sets.closeDay(function(err, res) {
                    if (err) return console.error(err);
                    $state.reload();
                });
            }
        }
    });

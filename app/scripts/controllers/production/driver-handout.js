'use strict';

/**
 * @ngdoc function
 * @name erp7App.controller:ProductionDriverHandoutCtrl
 * @description
 * # ProductionDriverHandoutCtrl
 * Controller of the erp7App
 */
angular.module('erp7App')
  .controller('ProductionDriverHandoutCtrl', function ($state, api, $scope, $mdDialog, $stateParams, md5, $filter) {
    if($state.current.name === 'production.bagsTracking'){
      $scope.text = "Pasirinkite vairuotoją ir datą";
      $scope.selected = {
        date : new Date()
      };
      $scope.allDrivers = false;
      $scope.cancel = function() {$mdDialog.hide();};
      $scope.drivers = [];
      $scope.cbChange = function () {
        if($scope.allDrivers){
          $scope.next = true;
        }
        else {
          $scope.next = false;
        }
      };
      $scope.change = function () {
        var _sel = $scope.selected;
        if(_sel.date && _sel.driver){
          api.drivers.bagsByDate(
            _sel.driver,
            _sel.date,
            function (err, res){
              if(err || !res.data){
                $scope.text = "Vairuotojas pasirinktą dieną neturi krapšių";
                $scope.next = false;
              }
              else {
                $scope.next = true;
                $scope.text = "Vairuotojas pasirinktą dieną turi "+ res.data.length + " krepšių(-s)."
              }
            }
          )
        }
        else {
          return;
        }
      }
      $scope.goNext = function (type) {
        var _p = {
          date : moment($scope.selected.date).format("YYYY-MM-DD"),
          driver : $scope.allDrivers ? 'all' : $scope.selected.driver,
          jobType : type
        }
        var _url = $state.href('terminal.printHandout', _p);
        window.open(_url, '_blank');
      }
      api.drivers.active(
        function (err, res){
          $scope.drivers = res.data;
        }
      )
    }
    else {
      var jobType = $stateParams.jobType;
      var sp_driver = $stateParams.driver;
      $scope.date = $stateParams.date;


      $scope.count = {
        bag : 0,
        address : 0
      };

      $scope.driversWithOrders = [];

      api.drivers.active(
        function(err, res){
          if(err) return console.log(err);
          if(sp_driver != 'all'){
            var thisDriver =  _.find(res.data, function (drv) {
              return $stateParams.driver == drv.ID
            });
            getOneOrder(thisDriver, function (result){
              $scope.driversWithOrders.push(result);
            });
          }
          else {
            res.data.forEach(function(__thisDriver){
              getOneOrder(__thisDriver, function (result){
                $scope.driversWithOrders.push(result);
              })
            })
          }
          console.log($scope);
          if(jobType == 'print') {
            setTimeout(
              function(){
                window.print();
              },3000
            )
          }
          else {
            
            setTimeout(
              function(){
                $scope.driversWithOrders.forEach(
                  function (dr) {
                    if (dr.orders.length){
                      var fName = dr.driver.Vardas + '_' + dr.driver.Pavarde + '_' + $scope.date + '.pdf';
                      createPDF(dr, fName);
                    }
                  }
                )
                
              },3000
            )
          }
        }
      );

      var getOneOrder = function (crt_drv, cb){

        var _result = {
          driver : crt_drv,
          count : {},
          orders : [],
          idx : md5.createHash(crt_drv.Vardas + crt_drv.Pavarde)
        };

        api.drivers.bagsByDate(
          crt_drv.ID,
          $stateParams.date,
          function(err, res){
            console.log(res);
            _result.orders = api._convertDates(res.data);
            var _uniqAddresses =  _.uniq(res.data, function(x){return x.Adresas})
            _result.count = {
              bag : res.data.length,
              address : _uniqAddresses.length
            };
            
            cb(_result);
            // setTimeout(function () {
            //   window.print();
            // }, 3000);
          }
        );
      
      }

      var createPDF = function (driverData, fileName) {
        console.log('printing  pdf as ' + fileName);
        var docDefinition = __getDD(driverData);
        pdfMake.createPdf(docDefinition).download(fileName);
        console.log($scope);
      }

      var __getDD = function (driverData) {
        // playground requires you to assign document definition to a variable called dd

        // dd.content[0].table.body

        var headerColor = '#FAFAFA';
        var headerText = '#212121';


        var dd = {
          pageOrientation : 'landscape',
          content: [
            {
                layout: {
                  fillColor: function (i, node) {
                    return (i % 2 === 0 && i > 3) ? '#EEEEEE' : null;
                  }
                },
                style : 'header', //content[0].table.body[1][2].text
                table : {
                    headerRows: 4,
                    body : [
                        [{ alignment: 'center', fillColor : headerColor, color : headerText, text : "ŠIAME DOKUMENTE PATEIKIAMA KONFIDENCIALI INFORMACIJA. UŽPILDYTAS IR PASIRAŠYTAS DOKUMENTAS PRIVALO BŪTI GRĄŽINTAS ADMINISTRACIJAI.", colSpan : 14}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
                        [
                            {fillColor : headerColor, color : headerText, text : $scope.date, colSpan : 2},{},
                            {fillColor : headerColor, color : headerText, text : "Vairuotojas:", alignment: 'right', colSpan : 3},{},{},
                            {fillColor : headerColor, color : headerText, text : driverData.driver.Vardas + ' ' + driverData.driver.Pavarde, colSpan : 1},
                            {alignment: 'center', fillColor : headerColor, color : headerText, text : "JEIGU MATOTE, KAD LAIKU NESPĖSITE ATVEŽTI, BŪTINA KLIENTUI NUSIŲSTI SMS. JĄ REIKIA SIŲSTI IR TADA, KAI VĖLUOSITE KELIAS MIN. KUO ANKŠČIAU INFORMUOSITE, TUO GERIAU.", colSpan : 8, rowSpan : 2},{},{},{},{},{},{},{}
                        ],
                        [
                            {fillColor : headerColor, color : headerText, text : "Viso Krepšių :", colSpan : 2, alignment: 'right'},{},
                            {fillColor : headerColor, color : headerText, text : driverData.count.bag, colSpan : 1},
                            {fillColor : headerColor, color : headerText, text : "Viso adresų :", colSpan : 2, alignment: 'right'},{},
                            {fillColor : headerColor, color : headerText, text : driverData.count.address, colSpan : 1},
                            {}
                        ],
                        [
                            {fillColor : headerColor, color : headerText, text : "Nr.", colSpan : 1},
                            {fillColor : headerColor, color : headerText, text : "Vardas Pavardė", colSpan : 1},
                            {fillColor : headerColor, color : headerText, text : "Miestas", colSpan : 1},
                            {fillColor : headerColor, color : headerText, text : "Nuo", colSpan : 1},
                            {fillColor : headerColor, color : headerText, text : "Iki", colSpan : 1},
                            {fillColor : headerColor, color : headerText, text : "Adresas", colSpan : 1},
                            {fillColor : headerColor, color : headerText, text : "PPD", colSpan : 1},
                            {fillColor : headerColor, color : headerText, text : "A", colSpan : 1},
                            {fillColor : headerColor, color : headerText, text : "Kodas", colSpan : 1},
                            {fillColor : headerColor, color : headerText, text : "Telefonas", colSpan : 1},
                            {fillColor : headerColor, color : headerText, text : "Pastabos", colSpan : 1},
                            {fillColor : headerColor, color : headerText, text : "Vnk.", colSpan : 1},
                            {fillColor : headerColor, color : headerText, text : "Grąžino", colSpan : 1},
                            {fillColor : headerColor, color : headerText, text : "Be Etiketės", colSpan : 1}
                        ]
                        
                    ]
                },
            },
          ],
          styles: {
            header: {
              fontSize: 6,
              bold: false,
              width : '100%'
            },
            body: {
              fontSize: 7
            },
            footer : {
                fontSize : 10,
                margin : [10,10,10,10]
            }
          }
        };
        var preFooter = {text: '', margin: [0, 20, 0, 8]}
        var footer = {
            table : {
                style : 'footer',
                body : [
                    [{text : 'Kurjerio parašas:', border : [], width: '25%'},
                    {text : '', border : [0,0,0,1], width: '25%'},
                    {text : '', border : [], width: '25%'},
                    {text : 'Vyr. kurjerio / Vadybininko parašas', border : [], width: '25%'},
                    {text : '', border : [0,0,0,1], width: '25%'}
                    ]
                ],
                widths: ['20%', '20%', '10%', '30%', '20%']
            }
        }

        driverData.orders = $filter('orderBy')(driverData.orders, 'Eiliskumas', false);

        _.each(driverData.orders, function (_D, index) {
          var line = [
            {style : 'body', text : index + 1, colSpan : 1},
            {style : 'body', text : _D.Vardas_Pavarde || '-', colSpan : 1},
            {style : 'body', text : _D.Miestas || '-', colSpan : 1},
            {style : 'body', text : moment(_D.Laikas_Nuo).format("HH:mm") || '-', colSpan : 1},
            {style : 'body', text : moment(_D.Laikas_Iki).format("HH:mm") || '-', colSpan : 1},
            {style : 'body', text : _D.Adresas || '-', colSpan : 1},
            {style : 'body', text : _D.PPD == 1 ? "Taip": "Ne" , colSpan : 1},
            {style : 'body', text : _D.Aukstas || '-', colSpan : 1},
            {style : 'body', text : _D.Kodas || '-', colSpan : 1},
            {style : 'body', text : _D.Telefonas || '-', colSpan : 1},
            {style : 'body', text : _D.Pastabos || '-', colSpan : 1},
            {style : 'body', text : _D.Vienkartinis ? 'Taip' : '', colSpan : 1},
            {style : 'body', text : "" || '', colSpan : 1},
            {style : 'body', text : "" || '', colSpan : 1}
          ];
          dd.content[0].table.body.push(line);
        })

        dd.content.push(preFooter);
        dd.content.push(footer);
        // dd.content[0].table.body[1][2].text = driverData.driver.Vardas + driverData.driver.Pavarde
 
        console.log(dd);

        return dd;
      }
    }
  });

'use strict';

/**
 * @ngdoc function
 * @name erp7App.controller:SalesNewCtrl
 * @description
 * # SalesNewCtrl
 * Controller of the erp7App
 */
angular.module('erp7App')
  .controller('ClientsDialogCtrl', function ($scope, $mdDialog, api, parent) {
    $scope.parent = parent;
    $scope.closeDialog = function () {
      $mdDialog.hide();
    };
    $scope.getInfo = function (client) {
      api.Customer.byId(this, function (controller, response) {
        var data = response.data[0];

        $scope.parent.$order.client.name = !data.Company_Name ? data.First_Name + ' ' + data.Last_Name : data.Company_Name;

        api.Customer.Contacts(this, function (controller, response) {
          $scope.parent.$order.client.contactPerson = response ? response.Vardas_Pavarde : 'Nenurodyta';
        }, client.ID, data.Contact_Person);

        api.Customer.Addresses(this, function (controller, response) {
          $scope.parent.$order.client.billingAdress = response ? response.Adresas : 'Nenurodyta';
        }, client.ID, data.Billing_Address);

        api.Customer.Phones(this, function (controller, response) {
          $scope.parent.$order.client.phone = response ? response.Numeris : 'Nenurodyta';
        }, client.ID, data.Phone);

        api.Customer.AllPaymentTypes(this, function (controller, response) {
          $scope.parent.$order.client.paymentType = response ? response.Pavadinimas : 'Nenurodyta';
        }, data.Payment_Type);

        api.Customer.AllPaymentTerms(this, function (controller, response) {
          $scope.parent.$order.client.paymentConditions = response ? response.Kodas : 'Nenurodyta';
        }, data.Payment_Terms);

        api.Customer.SalesPerson(this, function (controller, response) {
          $scope.parent.$order.client.vendor = response ? response.Pardavejas : 'Nenurodyta';
        }, client.ID, data.Sales_Manager);

        api.Customer.Discounts(this, function (controller, response) {
          var discounts = [];
          if (response) {
            if (response.data) {
              for (var i = 0; i < response.data.length; i++) {
                discounts.push(response.data[i].Kodas);
              }
            }
          }
          $scope.parent.$order.client.discounts = discounts.length ? discounts : null;
        }, client.ID);

      }, client.ID);
      $mdDialog.hide();
    };
  })
  .controller('SalesNewCtrl', function ($scope, $mdDialog) {
    $scope.$order = {
      number: 'U-110770',
      date: new Date(),
      status: null,
      price: 0,
      client: {
        contactPerson: 'Nenurodyta',
        name: 'Nenurodyta',
        address: null,
        paymentType: 'Nenurodyta',
        paymentConditions: 'Nenurodyta',
        vendor: 'Nenurodyta',
        discounts: null,
        discountCode: null,
        comment: 'Nenurodyta',
        eshop: false,
        eshopComment: null,
        billingAdress: 'Nenurodyta',
        phone: 'Nenurodyta'
      },
      products: []
    };

    $scope.product = {
      add: function () {
        $mdDialog.show({
          templateUrl: 'views/sales/addProduct.html',
          clickOutsideToClose: false,
          controller: 'SalesAddproductCtrl'
        })
      }
    };

    $scope.client = {
      createNew: function () {
        $mdDialog.show({
          templateUrl: 'views/clients/new-modal.html',
          clickOutsideToClose: true,
          controller: 'ClientsNewCtrl'
        })
      },

      findClient: function () {
        $mdDialog.show({
          templateUrl: 'views/clients/find-modal.html',
          clickOutsideToClose: true,
          locals: {
            parent: $scope
          },
          controller: 'ClientsDialogCtrl'
        });
      }
    };


  });

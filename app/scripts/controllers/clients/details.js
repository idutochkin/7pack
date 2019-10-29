'use strict';

/**
 * @ngdoc function
 * @name erp7App.controller:ClientsDetailsCtrl
 * @description
 * # ClientsDetailsCtrl
 * Controller of the erp7App
 */
angular.module('erp7App')
  .controller('ClientsDetailsCtrl', function ($mdSidenav, $scope, $mdMedia, $stateParams, api) {
    $scope.dataNow = {
      CustomerID: this.CustomerID,
      Blocked: this.Blocked,
      Eshop: 1,
      EshopID: 1,
      InvoicingAddressID: 1,
      DeliveryAddressID: 4,
      PrimaryEmailID: 1,
      PrimaryPhoneID: 1,
      PrimaryContactID: 1,
      FirstName: "",
      LastName: "",
      Gender: "",
      BirthDate: "",
      CompanyName: "",
      CompanyRegNo: "",
      CompanyVATNo: "",
      CompanyStatus: 5,
      IsSalesPerson: this.Is_SalesPerson,
      PaymentType: 5,
      PaymentTerms: 5,
      PriceList: 5,
      SalesManagerID: 5
    };

    $scope.name = $scope.dataNow.FirstName;
    $scope.surname = $scope.dataNow.LastName;
    $scope.currentDate;

    $scope.submit = function () {
      var data = [{
        CustomerID: $scope.dataNow.CustomerID,
        Blocked: $scope.dataNow.Blocked,
        Eshop: 1,
        EshopID: 1,
        InvoicingAddressID: 1,
        DeliveryAddressID: 4,
        PrimaryEmailID: 1,
        PrimaryPhoneID: 1,
        PrimaryContactID: 1,
        FirstName: $scope.dataNow.FirstName,
        LastName: $scope.dataNow.LastName,
        Gender: $scope.dataNow.Gender,
        BirthDate: $scope.dataNow.BirthDate,
        CompanyName: "",
        CompanyRegNo: "",
        CompanyVATNo: "",
        CompanyStatus: 5,
        IsSalesPerson: $scope.dataNow.IsSalesPerson,
        PaymentType: 5,
        PaymentTerms: 5,
        PriceList: 5,
        SalesManagerID: 5
      }];


      api.Customer.Update(this, function (controller, response) {
        window.location.reload(false);
        $scope.currentDate = new Date();
      }, $stateParams.id, data);

    };


    api.Customer.byId(this, function (controller, response) {
      var data = response.data[0];

      controller.ID = data['ID'];
      $scope.dataNow.CustomerID = data['ID'];
      if (data['Company_No'] == undefined) {
        document.getElementById('fiz_details_1').style.display = "block";
        document.getElementById('fiz_details_2').style.display = "block";
        document.getElementById('yur_details_1').style.display = "none";
        document.getElementById('yur_details_2').style.display = "none";

        var date = new Date(data['Birthday'] + "Z");
        controller.Birthday = formatDate(date);
        $scope.dataNow.BirthDate = controller.Birthday;
        var date = new Date(data['Created'] + "Z");
        controller.Created = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
        var date = new Date(data['Updated'] + "Z");
        controller.Updated = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();

        controller.Name = data['First_Name'] + " " + data['Last_Name'];
        controller.First_Name = data['First_Name'];
        $scope.dataNow.FirstName = controller.First_Name;
        controller.Last_Name = data['Last_Name'];
        $scope.dataNow.LastName = controller.Last_Name;
        controller.Gender = (data['Gender'] == 2) ? "M" : "V";
        $scope.dataNow.Gender = controller.Gender;
        controller.Blocked = (data['Blocked'] == 0) ? "Ne" : "Taip";
        controller.Is_Salesperson = (data['Is_Salesperson'] == 0) ? "Ne" : "Taip";
        controller.Magento = (data['Magento'] == undefined) ? "Nenurodyta" : data['Magento'];
        controller.Nuolaidos = (data['Nuolaidos'] == undefined) ? "Nenurodyta" : data['Nuolaidos'];

        getDetailData(api, controller, "Phone", $stateParams.id, data['Phone']);
        getDetailData(api, controller, "Billing_Address", $stateParams.id, data['Billing_Address']);
        getDetailData(api, controller, "Email", $stateParams.id, data['Email']);
        getDetailData(api, controller, "Contact_Person", $stateParams.id, data['Contact_Person']);
        getDetailData(api, controller, "Delivery_Address", $stateParams.id, data['Delivery_Address']);
        getDetailData(api, controller, "Payment_Type", $stateParams.id, data['Payment_Type']);
        getDetailData(api, controller, "Payment_Terms", $stateParams.id, data['Payment_Terms']);
        getDetailData(api, controller, "Sales_Manager", $stateParams.id, data['Sales_Manager']);
      } else {
        document.getElementById('fiz_details_1').style.display = "none";
        document.getElementById('fiz_details_2').style.display = "none";
        document.getElementById('yur_details_1').style.display = "block";
        document.getElementById('yur_details_2').style.display = "block";

        var date = new Date(data['Created'] + "Z");
        controller.Created = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
        var date = new Date(data['Updated'] + "Z");
        controller.Updated = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();

        controller.Name = data['Company_Name'];
        controller.Company_No = data['Company_No'];
        controller.VAT_No = data['VAT_No'];
        controller.Blocked = (data['Blocked'] == 0) ? "Ne" : "Taip";
        controller.Is_Salesperson = (data['Is_Salesperson'] == 0) ? "Ne" : "Taip";
        controller.Magento = (data['Magento'] == undefined) ? "Nenurodyta" : data['Magento'];
        controller.Nuolaidos = (data['Nuolaidos'] == undefined) ? "Nenurodyta" : data['Nuolaidos'];

        getDetailData(api, controller, "Phone", $stateParams.id, data['Phone']);
        getDetailData(api, controller, "Billing_Address", $stateParams.id, data['Billing_Address']);
        getDetailData(api, controller, "Email", $stateParams.id, data['Email']);
        getDetailData(api, controller, "Contact_Person", $stateParams.id, data['Contact_Person']);
        getDetailData(api, controller, "Delivery_Address", $stateParams.id, data['Delivery_Address']);
        getDetailData(api, controller, "Payment_Type", $stateParams.id, data['Payment_Type']);
        getDetailData(api, controller, "Payment_Terms", $stateParams.id, data['Payment_Terms']);
        getDetailData(api, controller, "Sales_Manager", $stateParams.id, data['Sales_Manager']);
        getDetailData(api, controller, "CompanyStatuses", $stateParams.id, data['Status']);
      }
    }, $stateParams.id);


    $scope.crm = {
      bar: {
        isOpen: $mdMedia('gt-md'),
        toggle: function () {
          $mdSidenav('right').open();
        }
      }
    };

    $scope.$watch(function () {
      return $mdMedia('gt-md');
    }, function () {
      $scope.crm.bar.isOpen = $mdMedia('gt-md');
    })

  });

function getDetailData(api, controller, type, userId, data) {
  if (type == 'Billing_Address') {
    api.Customer.Addresses(controller, function (controller, response) {
      var result = "Nenurodyta";
      if (response != undefined)
        result = response['Adresas'];
      controller.Billing_Address = result;
    }, userId, data);
  }
  if (type == 'Phone') {
    api.Customer.Phones(controller, function (controller, response) {
      var result = "Nenurodyta";
      if (response != undefined)
        result = response['Numeris'];
      controller.Phone = result;
    }, userId, data);
  }
  if (type == 'Email') {
    api.Customer.Emails(controller, function (controller, response) {
      var result = "Nenurodyta";
      if (response != undefined)
        result = response['El_pastas'];
      controller.Email = result;
    }, userId, data);
  }
  if (type == 'Contact_Person') {
    api.Customer.Contacts(controller, function (controller, response) {
      var result = "Nenurodyta";
      if (response != undefined)
        result = response['Vardas_Pavarde'];
      controller.Contact_Person = result;
    }, userId, data);
  }
  if (type == 'Delivery_Address') {
    api.Customer.Addresses(controller, function (controller, response) {
      var result = "Nenurodyta";
      if (response != undefined)
        result = response['Adresas'];
      controller.Delivery_Address = result;
    }, userId, data);
  }
  if (type == 'Payment_Type') {
    api.Customer.PaymentTypes(controller, function (controller, response) {
      var result = "Nenurodyta";
      if (response != undefined) {
        result = response['TipoID'];
        api.Orders.PaymentTypes(controller, function (controller, response, typoId) {
          var result = "Nenurodyta";
          if (response != undefined)
            result = response[typoId]['Pavadinimas'];
          controller.Payment_Type = result;
        }, result);
      } else {
        controller.Payment_Type = result;
      }
    }, userId, data);
  }
  if (type == 'Sales_Manager') {
    api.Customer.SalesPerson(controller, function (controller, response) {
      var result = "Nenurodyta";
      if (response != undefined)
        result = response['Pardavejas'];
      controller.Sales_Manager = result;
    }, userId, data);
  }
  if (type == 'Payment_Terms') {
    api.Customer.PaymentTerms(controller, function (controller, response) {
      var result = "Nenurodyta";
      if (response != undefined) {
        result = response['SalyguID'];
        api.Orders.PaymentTerms(controller, function (controller, response, salyguID) {
          var result = "Nenurodyta";
          if (response != undefined)
            result = response[salyguID]['Kodas'];
          controller.Payment_Terms = result;
        }, result);
      } else {
        controller.Payment_Terms = result;
      }
    }, userId, data);
  }
  if (type == 'Is_Salesperson') {
    api.Customer.SalesPerson(controller, function (controller, response) {
      var result = "Nenurodyta";
      if (response != undefined)
        result = response['Pardavejas'];
      controller.Is_Salesperson = result;
    }, userId, data);
  }
  if (type == 'CompanyStatuses') {
    api.Customer.CompanyStatuses(controller, function (controller, response) {
      var result = "Nenurodyta";
      if (response != undefined)
        result = response['Statusas'];
      controller.Status = result;
    }, userId, data);
  }
}

function formatDate(date) {
  var dd = date.getDate();
  if (dd < 10)
    dd = '0' + dd;
  var mm = date.getMonth() + 1;
  if (mm < 10)
    mm = '0' + mm;
  var yyyy = date.getFullYear();
  if (yyyy < 10)
    yyyy = '000' + yyyy;
  else if (yyyy < 100)
    yyyy = '00' + yyyy;
  else if (yyyy < 1000)
    yyyy = '0' + yyyy;
  return yyyy + '-' + mm + '-' + dd;
}

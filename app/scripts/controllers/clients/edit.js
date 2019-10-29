'use strict';

/**
 * @ngdoc function
 * @name erp7App.controller:ClientsEditCtrl
 * @description
 * # ClientsEditCtrl
 * Controller of the erp7App
 */
angular.module('erp7App')
  .controller('ClientsEditCtrl', function ($mdSidenav, $scope, $mdMedia, $stateParams, api) {
    $scope.submit = function () {
      var data = [{
        CustomerID: 1,
        Blocked: 1,
        Eshop: 1,
        EshopID: 1,
        InvoicingAddressID: 1,
        DeliveryAddressID: 1,
        PrimaryEmailID: 1,
        PrimaryPhoneID: 1,
        PrimaryContactID: 1,
        FirstName: "this.FirstName",
        LastName: "this.LastName",
        Gender: 1,
        BirthDate: "2018-05-30",
        CompanyName: "",
        CompanyRegNo: "",
        CompanyVATNo: "",
        CompanyStatus: 5,
        IsSalesPerson: 1,
        PaymentType: 5,
        PaymentTerms: 5,
        PriceList: 5,
        SalesManagerID: 5
      }];
      /*
        CustomerID: $stateParams.id,
        Blocked: this.Blocked,
        Eshop: this.Eshop,
        EshopID: this.EshopID,
        InvoicingAddressID: this.InvoicingAddressID,
        DeliveryAddressID: this.DeliveryAddressID,
        PrimaryEmailID: this.PrimaryEmailID,
        PrimaryPhoneID: this.PrimaryPhoneID,
        PrimaryContactID: this.PrimaryContactID,
        FirstName: this.FirstName,
        LastName: this.LastName,
        Gender: this.Gender,
        BirthDate: this.BirthDate,
        CompanyName: this.CompanyName,
        CompanyRegNo: this.CompanyRegNo,
        CompanyVATNo: this.CompanyVATNo,
        CompanyStatus: this.CompanyStatus,
        IsSalesPerson: this.IsSalesPerson,
        PaymentType: this.PaymentType,
        PaymentTerms: this.PaymentTerms,
        PriceList: this.PriceList,
        SalesManagerID: this.SalesManagerID*/

      api.Customer.Update(this, function (controller, response) {
        alert("good");
      }, 1, data); //$stateParams.id
    }

    api.Customer.byId(this, function (controller, response) {
      var data = response.data[0];

      controller.ID = data['ID'];
      if (data['Company_No'] == undefined) {
        controller.Type = 'phy';
        var date = new Date(data['Birthday'] + "Z");
        controller.Birthday = formatDate(date);
        console.log(formatDate(date));
        var date = new Date(data['Created'] + "Z");
        controller.Created = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
        var date = new Date(data['Updated'] + "Z");
        controller.Updated = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();

        controller.Name = data['First_Name'] + " " + data['Last_Name'];
        controller.Gender = (data['Gender'] == 2) ? "M" : "V";
        controller.Blocked = (data['Blocked'] == 0) ? "Ne" : "Taip";
        controller.Is_Salesperson = (data['Is_Salesperson'] == 0) ? "Ne" : "Taip";
        controller.Magento = data['Magento'];
        controller.Nuolaidos = data['Nuolaidos'];

        getEditData(api, controller, "Phone", $stateParams.id, data['Phone']);
        getEditData(api, controller, "Billing_Address", $stateParams.id, data['Billing_Address']);
        getEditData(api, controller, "Email", $stateParams.id, data['Email']);
        getEditData(api, controller, "Contact_Person", $stateParams.id, data['Contact_Person']);
        getEditData(api, controller, "Delivery_Address", $stateParams.id, data['Delivery_Address']);
        getEditData(api, controller, "Payment_Type", $stateParams.id, data['Payment_Type']);
        getEditData(api, controller, "Payment_Terms", $stateParams.id, data['Payment_Terms']);
        getEditData(api, controller, "Sales_Manager", $stateParams.id, data['Sales_Manager']);
      } else {
        controller.Type = 'com';
        var date = new Date(data['Created'] + "Z");
        controller.Created = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
        var date = new Date(data['Updated'] + "Z");
        controller.Updated = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();

        controller.Name = data['Company_Name'];
        controller.Company_No = data['Company_No'];
        controller.VAT_No = data['VAT_No'];
        controller.Blocked = (data['Blocked'] == 0) ? "Ne" : "Taip";
        controller.Is_Salesperson = (data['Is_Salesperson'] == 0) ? "Ne" : "Taip";
        controller.Magento = data['Magento'];
        controller.Nuolaidos = data['Nuolaidos'];

        getEditData(api, controller, "Phone", $stateParams.id, data['Phone']);
        getEditData(api, controller, "Billing_Address", $stateParams.id, data['Billing_Address']);
        getEditData(api, controller, "Email", $stateParams.id, data['Email']);
        getEditData(api, controller, "Contact_Person", $stateParams.id, data['Contact_Person']);
        getEditData(api, controller, "Delivery_Address", $stateParams.id, data['Delivery_Address']);
        getEditData(api, controller, "Payment_Type", $stateParams.id, data['Payment_Type']);
        getEditData(api, controller, "Sales_Manager", $stateParams.id, data['Sales_Manager']);
        getEditData(api, controller, "Payment_Terms", $stateParams.id, data['Payment_Terms']);
        getEditData(api, controller, "CompanyStatuses", $stateParams.id, data['Status']);
      }
    }, $stateParams.id);

  });

function getEditData(api, controller, type, userId, data) {
  if (type == 'Billing_Address') {
    api.Customer.Addresses(controller, function (controller, response) {
      var result = "";
      if (response != undefined)
        result = response['Adresas'];
      controller.Billing_Address = result;
    }, userId, data);
  }
  if (type == 'Phone') {
    api.Customer.Phones(controller, function (controller, response) {
      var result = "";
      if (response != undefined)
        result = response['Numeris'];
      controller.Phone = result;
    }, userId, data);
  }
  if (type == 'Email') {
    api.Customer.Emails(controller, function (controller, response) {
      var result = "";
      if (response != undefined)
        result = response['El_pastas'];
      controller.Email = result;
    }, userId, data);
  }
  if (type == 'Contact_Person') {
    api.Customer.Contacts(controller, function (controller, response) {
      var result = "";
      if (response != undefined)
        result = response['Vardas_Pavarde'];
      controller.Contact_Person = result;
    }, userId, data);
  }
  if (type == 'Delivery_Address') {
    api.Customer.Addresses(controller, function (controller, response) {
      var result = "";
      if (response != undefined)
        result = response['Adresas'];
      controller.Delivery_Address = result;
    }, userId, data);
  }
  if (type == 'Payment_Type') {
    api.Customer.PaymentTypes(controller, function (controller, response) {
      var result = "";
      if (response != undefined) {
        result = response['TipoID'];
        api.Orders.PaymentTypes(controller, function (controller, response, tipoID, listType) {
          var result = "";
          if (response != undefined) {
            result = response[tipoID]['Pavadinimas'];
            controller.Payment_Type_List = listType;
          }
          controller.Payment_Type = result;
        }, result);
      } else {
        controller.Payment_Type = result;
      }
    }, userId, data);
  }
  if (type == 'Sales_Manager') {
    api.Customer.SalesPerson(controller, function (controller, response) {
      var result = "";
      if (response != undefined)
        result = response['Pardavejas'];
      controller.Sales_Manager = result;
    }, userId, data);
  }
  if (type == 'Payment_Terms') {
    api.Customer.PaymentTerms(controller, function (controller, response) {
      var result = "";
      if (response != undefined) {
        result = response['SalyguID'];
        api.Orders.PaymentTerms(controller, function (controller, response, salyguID, listTerms) {
          var result = "";
          if (response != undefined) {
            result = response[salyguID]['Kodas'];
            controller.Payment_Terms_List = listTerms;
          }
          controller.Payment_Terms = result;
        }, result);
      } else {
        controller.Payment_Terms = result;
      }
    }, userId, data);
  }
  if (type == 'Is_Salesperson') {
    api.Customer.SalesPerson(controller, function (controller, response) {
      var result = "";
      if (response != undefined)
        result = response['Pardavejas'];
      controller.Is_Salesperson = result;
    }, userId, data);
  }
  if (type == 'CompanyStatuses') {
    api.Customer.CompanyStatuses(controller, function (controller, response) {
      var result = "";
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

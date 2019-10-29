'use strict';

/**
 * @ngdoc function
 * @name erp7App.controller:CommSideNavigationCtrl
 * @description
 * # CommSideNavigationCtrl
 * Controller of the erp7App
 */
angular.module('erp7App')
  .controller('SideNavigationCtrl', function ($scope, $state, Navigator, $mdMedia) {


    $scope.$nav = {
      mainClass: Navigator.sideNavExpanded() ? 'navigation_wrap_default' : 'navigation_wrap_minimised',
      expanded: Navigator.sideNavExpanded(),
      visible: true,
      classes: {
        default: 'navigation_wrap_default',
        mini: 'navigation_wrap_minimised'
      },
      toggle: function () {
        closeAll();
        var _N = $scope.$nav;
        Navigator.toggleSideNav();
        if (_N.expanded) {
          _N.mainClass = _N.classes.mini;
        } else {
          _N.mainClass = _N.classes.default;
        }
      },
      forcedToggle: function (navState) {
        var _N = $scope.$nav;
        switch (navState) {
          case 'open':
            Navigator.setSideNavValue(true);
            _N.mainClass = _N.classes.default;
            break;
          case 'close':
            Navigator.setSideNavValue(false);
            _N.mainClass = _N.classes.mini;
            break;
          default:
            return;
        }
      },
      mobile: {
        toggle: function (isSmallEnough) {
          var _N = $scope.$nav;
          $scope.$nav.visible = !isSmallEnough;
          if (isSmallEnough) {
            $scope.$nav.forcedToggle('open');
          } else {
            $scope.$nav.forcedToggle('closed')
          }
        }
      }
    }

    $scope.$watch(
      function () {
        return Navigator.sideNavExpanded();
      },
      function () {
        $scope.$nav.expanded = Navigator.sideNavExpanded();
      });

    $scope.$watch(
      function () {
        return $mdMedia('gt-sm')
      },
      function () {
        $scope.$nav.mobile.toggle(!$mdMedia('gt-sm'))
      }
    );

    $scope.$watch(
      function () {
        return $mdMedia('md')
      },
      function () {
        if ($mdMedia('md')) {
          $scope.$nav.forcedToggle('close')
        } else {
          $scope.$nav.forcedToggle('open')
        }
      }
    );

    $scope.menu = [{
        state: 'dashboards.personal',
        name: 'Ataskaitos',
        icon: 'dashboard',
        expandable: true,
        expanded: false,
        childern: [{
            state: 'dashboard.personal',
            name: 'Asmenine',
            icon: 'p'
          },
          {
            state: '',
            name: 'Bendra',
            icon: 'p'
          }
        ]
      },
      {
        state: 'material.browser',
        name: 'Žaliavos',
        icon: 'format_color_fill',
        expandable: true,
        expanded: false,
        childern: [{
            state: 'material.browser',
            name: 'Naršyti',
            icon: 'p'
          },
          {
            state: 'material.create({id:\'new\'})',
            name: 'Naujas',
            icon: 'p'
          }
        ]
      },
      {
        state: 'recipies.browser',
        name: 'Receptai',
        icon: 'receipt',
        expandable: false,
        expanded: false,
        childern: [{
            state: 'recipies.browser',
            name: 'Naršyti',
            icon: 'p'
          },
          {
            state: '',
            name: 'Naujas',
            icon: 'p'
          }
        ]
      },
      {
        state: '',
        name: 'Meniu',
        icon: 'restaurant_menu',
        expandable: true,
        expanded: false,
        childern: [{
          state: '',
          name: 'Meniu ',
          icon: 'p'
        }]
      },
      {
        state: '',
        name: 'Gamyba',
        icon: 'work',
        expandable: true,
        expanded: false,
        childern: [{
            state: 'production.bagComplete',
            name: 'Krepšių komplektavimas',
            icon: 'p'
          },
          {
            state: 'production.menuPlaningBrowser',
            name: 'Meniu Planavimas',
            icon: 'p'
          },
          {
            state: 'production.classficators({type:\'main\'})',
            name: 'Klasifikatoriai',
            icon: 'p'
          },
          {
            state: 'timetracking.registration',
            name: 'Laiko sekimas',
            icon: 'p'
          },
          {
            state: 'production.report',
            name: 'Gamybos ataskaita',
            icon: 'p'
          },
          {
            state: 'production.materialSummary',
            name: 'Medžiagų suvestinė',
            icon: 'p'
          },
          {
            state: 'production.stickerReport',
            name: 'Lipdukai',
            icon: 'p'
          },
          {
            state: 'production.quality',
            name: 'Kokybės kontrolė',
            icon: 'p'
          }
        ]
      },
      {
        state: 'production.bagsTracking',
        name: 'Logistika',
        icon: 'directions_bus',
        expandable: true,
        expanded: false,
        childern: [{
          state: 'production.bagsTracking',
          name: 'Krepšiai',
          icon: 'p'
        }]
      },
      {
        state: 'clients.browser',
        name: 'Pardavimai',
        icon: 'attach_money',
        expandable: true,
        expanded: false,
        childern: [

          {
            state: 'sales.browser',
            name: 'Visi Užsakymai',
            icon: 'p'
          },
          {
            state: 'sales.create',
            name: 'Naujas Užsakymas',
            icon: 'p'
          },
          {
            state: 'clients.browser',
            name: 'Klientai',
            icon: null
          },
          {
            name: 'CRM',
            icon: null
          }
        ]
      },
      {
        state: '',
        name: 'Patiekalų vertinimai',
        icon: 'rate_review',
        expandable: true,
        expanded: false,
        childern: [{
            state: '',
            name: 'Naršyti',
            icon: 'p'
          },
          {
            state: '',
            name: 'Naujas',
            icon: 'p'
          }
        ]
      }
    ];
    $scope.toggleChild = function (item) {
      closeAll();
      if (item.expandable) {
        item.expanded = !item.expanded
      } else {
        $state.go(item.state);
      }
    }
    var closeAll = function () {
      $scope.menu.forEach(function (element) {
        element.expanded = false;
      });
    };

  });

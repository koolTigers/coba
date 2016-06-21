angular.module('cobaApp', [
  'ionic',
  'ionic-material', 
  'firebase',
  'ionMDRipple',
  'ngCordova',
  'cobaApp.controllers'])

.run(function($ionicPlatform, $rootScope,  $ionicPopup, $cordovaGeolocation, $firebaseArray) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

  var savedCart = localStorage.getItem('cart');
  if(savedCart) {
    $rootScope.cart = JSON.parse(savedCart);
    $rootScope.totalCart = $rootScope.cart.reduce(function(last, actual) {
      return last + (actual.item.price * actual.quantity);
    }, 0);
  }

  $rootScope.showCart = function() {
    var cartPopup = $ionicPopup.show({
      templateUrl: 'templates/cart.html',
      title: 'Carrito',
      cssClass: 'cart-popup',
      buttons: [
        {
          text: 'Cancelar'
        }, {
          text: 'Ordenar',
          type: 'button-positive',
        }
      ] 
    });
    
    cartPopup.then(function() {
      var checkoutScope = $rootScope.$new();
      // Some Ugly as fuck hardcoding
      checkoutScope.card_brand = 'VISA';
      checkoutScope.card_number = '4012888888881881';
      checkoutScope.address = 'Paseo de las Palmas #275'

      $ionicPopup.show({
        templateUrl: 'templates/checkout.html',
        scope: checkoutScope,
        title: 'Pagar',
        cssClass: 'cart-popup',
        buttons: [
          {
            text: 'Cancelar'
          },
          {
            text: 'Pagar',
            type: 'button-positive',
          }
        ]
      }).then(function(){
        $cordovaGeolocation
          .getCurrentPosition({
            timeout: 10000,
            enableHighAccuracy: false
          })
          .then(function(position) {
            var fireRef = firebase.database().ref().child('orders');
            var orders = $firebaseArray(fireRef);
            orders.$add({
              lat: position.coords.latitude,
              longi: position.coords.longitude,
              products: $rootScope.cart.map(function(elem) {
                return { name: elem.item.name, quantity: elem.quantity };
              }),
              totalProducts: $rootScope.cart.reduce(function(last, current) {
                return last + current.quantity;
              }, 0),
              totalPrice: $rootScope.totalCart,
              shop: "Abarrotes San Juan (168m)"
            }).then(function() {
              $ionicPopup.show({
                title: 'Éxito!',
                template: 'Tu orden ha sido agregada correctamente',
                buttons: [
                  {
                    text: "Ok!",
                    type: 'button-positive'
                  }
                ]
              }).then(function() {
                $rootScope.cart = [];
                $rootScope.totalCart = 0;
                localStorage.removeItem('cart');
              });
            });
          }, function(err) {
            alert(err);
          });
      });
    });
  };

})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('coba', {
      url: '/',
      templateUrl: 'templates/home.html',
      controller: 'HomeCtrl'
    })
    .state('coba.search', {
      url: '/search',
      templateUrl: 'templates/search.html',
      controller: 'SearchCtrl'
    })
    .state('detail', {
      url: '/product/:id',
      templateUrl: 'templates/detail.html',
      controller: 'DetailCtrl',
      resolve: {
        product: function($stateParams, $firebaseObject) {
          var fireRef = firebase.database().ref().child('products');
          var product = $firebaseObject(fireRef.child($stateParams.id));
          return product.$loaded();
        }
      }
    });

  $urlRouterProvider.otherwise('/');
});

angular.module('cobaApp', [
  'ionic',
  'ionic-material', 
  'firebase',
  'ionMDRipple',
  'cobaApp.controllers'])

.run(function($ionicPlatform, $rootScope,  $ionicPopup) {
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
          onTap: checkout
        }
      ] 
    })
  };

  function checkout() {
    
  }
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

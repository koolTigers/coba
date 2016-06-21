angular.module('cobaApp', ['ionic', 'ionic-material', 'cobaApp.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $stateProvider
    .state('coba', {
      url: '/',
      templateUrl: 'templates/home.html',
      controller: 'HomeCtrl'
    });

  $urlRouterProvider.otherwise('/');
});

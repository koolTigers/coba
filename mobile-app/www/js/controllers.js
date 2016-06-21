angular.module('cobaApp.controllers', [])

.controller('HomeCtrl', function($scope, $firebaseArray) {
  var fireRef = firebase.database().ref().child('products');
  var popularProductsQuery = fireRef.orderByChild('timestamp').limitToLast(3);
  $scope.popularProducts = $firebaseArray(popularProductsQuery);
})

.controller('DetailCtrl', function($scope, product) {
  $scope.product = product;
})

.controller('SearchCtrl', function($scope, $firebaseArray) {
});

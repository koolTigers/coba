angular.module('cobaApp.controllers', [])

.controller('HomeCtrl', function($scope, $firebaseArray) {
  var fireRef = firebase.database().ref().child('products');
  var popularProductsQuery = fireRef.orderByChild('timestamp').limitToLast(3);
  $scope.popularProducts = $firebaseArray(popularProductsQuery);
})

.controller('DetailCtrl', function($scope, $rootScope, $ionicPopup, product) {
  $scope.product = product;
  $scope.cartItem = {
    item: {
      $id: product.$id,
      name: product.name,
      price: product.price
    },
    quantity: 1
  };

  $scope.less = function() {
    if($scope.cartItem.quantity > 1) {
      $scope.cartItem.quantity -= 1;
    }
  };

  $scope.plus = function() {
    $scope.cartItem.quantity += 1;
  };

  $scope.showAddToCartPopup = function() {
    var addToCartPopup = $ionicPopup.show({
      template: '<div class="number-spinner">' +
        '<span ng-click="plus()"><i class="icon ion-plus-round"></i></span>' +
        '<input type="number" ng-model="cartItem.quantity">' +
        '<span ng-click="less()"><i class="icon ion-minus-round"></i></span>' +
        '</div>',
      scope: $scope,
      title: 'Añadir al carrito',
      buttons: [
        {
          text: 'Cancelar'
        },
        {
          text: 'Ok',
          type: 'button-positive',
          onTap: function(e) {
            if(!$rootScope.cart) {
              $rootScope.cart = [];
            }
            $rootScope.cart.push(angular.copy($scope.cartItem));
            localStorage.setItem('cart', angular.toJson($rootScope.cart)); 
          }
        }
      ]
    });
  };
})

.controller('SearchCtrl', function($scope, $firebaseArray) {
});

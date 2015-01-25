/**
 * Created by yurchehk0 on 05.01.15.
 */

var appController = angular.module('appController',[]);

//Lobby controller
appController.controller('LobbyItemsCtrl', ['$rootScope', '$scope', '$http', 'localStorageService',
	function($rootScope, $scope, $http, localStorageService){

	//Get lobby items
	$http.get('data/cards.json').
		success(function(data) {
			$scope.lobbyItems = data;
		});

	//Add item to cart
	//Store cart items in localStorage for redirect needed scope to header view
	$scope.cartItems = [];
	$scope.addCartItems = function(item) {
		var cartItem = localStorageService.get('cartItems');

		if(cartItem) {
			$scope.cartItems = cartItem;
		}

		$scope.cartItems.push(item);
		localStorageService.set('cartItems', $scope.cartItems );

		$rootScope.cartItems = cartItem;
	}
}]);

//Single item page controller
appController.controller('SingleItemCtrl', ['$scope', '$http', '$routeParams',
	function($scope, $http, $routeParams){

		//Load single item
		$http.get('data/cards/' + $routeParams.item + '.json').
			success(function(data) {
				$scope.singleItemData = data;
			});

		$scope.addCartItems = function(target) {
			console.log(target);
		}
}]);

//Header cart controller
//Show numbers of items in cart
appController.controller('HeaderCartCtrl',['$rootScope', '$scope', 'localStorageService',
	function($rootScope, $scope, localStorageService){

		$rootScope.$watch('cartItems', function(data){
			//console.log(e);
			$scope.wantToBuy = data || localStorageService.get('cartItems');
		})
}]);

//Cart controller
appController.controller('CartCtrl',['$rootScope', '$scope', 'localStorageService', '$http', '$filter',
	function($rootScope, $scope, localStorageService, $http, $filter){

	var cartItems,
		result = [],
		filteredDataResult,
		duplicateResults,
		rmCartItems = [],
		i,
		j;

	$scope.CartCtrlView = function() {
		cartItems = localStorageService.get('cartItems');
		result = [];
		if(cartItems && cartItems.length) {
			$http.get('data/cards.json').
				success(function(data) {
						for(i = 0; cartItems.length > i; i++) {

							//Find selected item in db
							filteredDataResult = $filter('filter')(data, {id: cartItems[i]})[0];
							//Find duplicate items in cart
							duplicateResults = $filter('filter')(result, {id: cartItems[i]})[0];

							if(result && duplicateResults) {
								duplicateResults.numbers = duplicateResults.numbers + 1;
							} else {
								filteredDataResult.numbers = 1;
								result.push(filteredDataResult);
							}
						}
				});
		}

		$scope.cartView = result;
	};

	$scope.CartCtrlView();

	//Remove one position from scope
	$scope.minusItem = function(el){
		el.numbers = el.numbers - 1;

		for(j = cartItems.length - 1; j >= 0; j--) {
			if(cartItems[j] === el.id) {
				cartItems.splice(j, 1);
				localStorageService.set('cartItems', cartItems);
				$rootScope.cartItems = cartItems;
				break;
			}
		}

		if (el.numbers <= 0) {
			$scope.cartView.splice( $scope.cartView.indexOf(el), 1 );
		}

	};

	//Add one position to scope
	$scope.plusItem = function(el){
		el.numbers = el.numbers + 1;
		cartItems.push(el.id);
		localStorageService.set('cartItems', cartItems);
		$rootScope.cartItems = cartItems;
	};

	//Remove cart items scope
	$scope.removeAll = function(id) {
		rmCartItems = [];

		cartItems.forEach(function(cv){
			if(cv != id) {
				rmCartItems.push(cv);
			}
		});

		cartItems = [];
		localStorageService.set('cartItems', rmCartItems);
		$rootScope.cartItems = rmCartItems;
		$scope.CartCtrlView();
	};

}]);



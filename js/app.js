/**
 * Created by yurchehk0 on 12.01.15.
 */

var testApp = angular.module('testApp', [
		'ngRoute',
		'LocalStorageModule',
		'appController'
	]);

testApp.
	config(['$routeProvider',
		function($routeProvider) {
			$routeProvider.
				when('/lobby', {
					templateUrl: 'templates/lobby.html',
					controller: 'LobbyItemsCtrl'}).
				when('/card/:item', {
					templateUrl: 'templates/singleItem.html',
					controller: 'SingleItemCtrl'}).
				when('/cart', {
					templateUrl: 'templates/cart.html',
					controller: 'CartCtrl'}).
				when('/about', {
					templateUrl: 'templates/aboutUs.html'}).
				when('/404', {
					templateUrl: 'templates/404.html'}).
				otherwise({
					redirectTo: '/404'
				});
		}]);
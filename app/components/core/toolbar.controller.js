angular.module('hiveInTown.core').controller('toolbarController', function($scope, $rootScope, $stateParams, 
									$state, communityName, loginService, Session, AUTH_EVENTS) {
	$scope.isLoggedIn = loginService.isAuthenticated();
	$scope.currentUser = Session.getUser();
	$scope.communityName = communityName.data;
	$scope.selection = "0";
	$scope.showOptions = true;
	
	$scope.$watch('selection', function(newVal, oldVal){
		console.log("newval:" + newVal);
	    switch(newVal){
	        case '0':
	           // [do Some Stuff]
	            break;
	        case '2':
	            loginService.logout();
	            break;
	        default:
	            //[well, do some stuff]
	            break;
	    }
	});
	
	$scope.toggleSidenav = function(name) {
		$rootScope.$broadcast('SIDENAV_TOGGLE_CLICKED', name);
	};
	
	$scope.$on(AUTH_EVENTS.loginSuccess, function(event, data) {
		$scope.currentUser = Session.getUser();
		$scope.isLoggedIn = true;
	});
});
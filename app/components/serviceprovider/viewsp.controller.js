angular.module('hiveInTown.serviceprovider').controller("viewserviceproviderController", function($scope, $mdDialog, user) {

	
	$scope.user = user;
	$scope.title = $scope.user.name;
	
	  $scope.close = function() {
		   $mdDialog.hide();
	  };
});
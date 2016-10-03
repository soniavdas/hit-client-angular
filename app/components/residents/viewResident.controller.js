angular.module('hiveInTown.residents').controller("viewResidentController", function($scope, $mdDialog, user) {

	
	$scope.user = user;
	$scope.title = $scope.user.name;
	$scope.profileUrl = user.profileUrl
	
	  $scope.close = function() {
		   $mdDialog.hide();
	  };
});
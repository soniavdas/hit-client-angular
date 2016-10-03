angular.module('hiveInTown.residents').controller("editResidentController", function($scope, $state, $stateParams, 
													residentService, USER_ROLES, 
													loginService, $mdDialog, user, $mdToast) {

	
	var communityUrlKeyword = $stateParams.communityUrlKeyword;
	$scope.user = user;
	$scope.customMessage = '';
	$scope.editMode = ($scope.user) ? true : false;
	
	if ($scope.editMode) { // edit
		$scope.title = $scope.user.name;
	} else {
		$scope.title = "Add Resident";
		$scope.user = {};
		$scope.user.role = USER_ROLES.resident;
	}
	
	$scope.$watch('user.role', function(newVal, oldVal) {
		if (newVal != oldVal) {
			if (newVal == USER_ROLES.admin) {
				showMsg('WARNING: You are giving this user an admin access.');
			} 
		}
	});
	
	$scope.save = function(user) {
		
		var saveUserObj = {};
		saveUserObj.user = user;
		saveUserObj.customMessage = $scope.customMessage;
		
		 $mdDialog.hide(saveUserObj);
		
	  };
	  
	  $scope.resend = function(user) {
		  loginService.resend(user.email, communityUrlKeyword)
		  	.then(function(results) {
		  		showMsg('Invite sent.');
		  	}, function(error) { 
		  		console.log(error); 
		  	});
	  };
	
	  $scope.cancel = function() {
		   $mdDialog.cancel();
	  };
	  
	  function showMsg(msg) {
		  $mdToast.show(
			$mdToast.simple()
			    .content(msg)
			//.position($scope.getToastPosition())
			    .hideDelay(3000)
			);
	  };
	  
	
});
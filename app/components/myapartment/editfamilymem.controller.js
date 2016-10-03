angular.module('hiveInTown.myapt').controller("editfamilymemController", function($scope, $state, $stateParams, 
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
		$scope.user.roleId = "5";
	}
	
	$scope.$watch('user.roleId', function(newVal, oldVal) {
		if (newVal != oldVal) {
			if (newVal == '1') {
				showMsg('WARNING: You are giving this user an admin access.');
			} 
		}
	});
	
	$scope.save = function(user) {
		
		var saveUserObj = {};
		saveUserObj.user = user;
		saveUserObj.customMessage = $scope.customMessage;
		
		 $mdDialog.hide(saveUserObj);
		 /* residentService.saveUser(user, communityUrlKeyword, $scope.customMessage).
			 then(function(results) {
				 $scope.user = user;
				 $scope.user.userId = results.data;
				 console.log("inserted user:" + results.data);
				 if ($scope.editMode) {
					 showMsg('Resident details saved.');
				 } else { 
					 showMsg('Resident added.');
				 }
				 $mdDialog.hide($scope.user);
			 }, function(error) { 
				console.log(error.code);
				console.log(error.message);
			 	showMsg("FAILED:" + error.message);
		 }); */
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
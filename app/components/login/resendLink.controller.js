angular.module('hiveInTown.login').controller('resendLinkController', function($scope, $rootScope, $cookies, loginService, $stateParams, $state, 
		communityName) {

	
	var communityUrlKeyword = $stateParams.communityUrlKeyword;
	
	$scope.message = 'Please enter your email that was used for sign up.  ';
	
	$scope.resend = function(email) {
		loginService.resend(email, communityUrlKeyword).then(function(result) {
				console.log("resend success:" + result.data);
				$scope.message= "An email has been sent to you. Please click on it and login with your choice of social login. "
					
			}, function(error) {
				console.log("resend error:" + error);
				$scope.message = error.message;
			});
		};
	
	
})

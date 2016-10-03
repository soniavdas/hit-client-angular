angular.module('hiveInTown.hit').controller("hitController", function($scope,  $stateParams, $state) {
	
	 $scope.isLoggedIn = false;
	 
   /* $scope.communities = communities.data;
    
    $scope.$watch('selection', function(newVal, oldVal){
		if (newVal) {
			console.log(newVal);
			$state.go('default.login', {communityUrlKeyword:newVal});
		}
	}); */
	 
	 $scope.login = function() {
		 $state.go('login');
	 }
});






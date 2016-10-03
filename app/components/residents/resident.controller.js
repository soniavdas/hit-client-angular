angular.module('hiveInTown.residents').controller("residentController", function($scope, $state, $stateParams, $mdDialog,
													residentService, USER_ROLES, $mdToast, loginService) {
	
	var FILTER_NONE = "Show All";
	var FILTER_ACTIVE = "LongTerm";
	var FILTER_PENDING = "ShortTerm";
	var FILTER_ADMINS = "Admins";
	var FILTER_RESIDENTS = "Residents";
	var PAGE_LIMIT = 10;
	var communityUrlKeyword = $stateParams.communityUrlKeyword;
	var pageIndex = -1;
	
	$scope.messagetype = "info"; 
	
	$scope.loading = true;
	$scope.searchText = '';
	$scope.filteredResults = [];
	$scope.communityUrlKeyword = communityUrlKeyword;
	$scope.message = '';
	$scope.dataFile = {};
	$scope.uploadClicked = false;
	$scope.selectedFilter = 0;
	$scope.scrollList = [];
	$scope.scrollEnabled = true;
	$scope.isAuthorized = loginService.isAuthorized(USER_ROLES.admin);
	
	$scope.tabs = [{title : 'Residents', disabled: false},
	               {title : 'Home Helpers', disabled: true},
	               {title : 'Employees', disabled: true}]
	
	$scope.filters = [{id:0, name:FILTER_NONE},
					   {id:1, name:FILTER_PENDING}, 
	                  {id:2, name:FILTER_ACTIVE}, 
	                  {id:3, name:FILTER_ADMINS}, 
	                  {id:4, name:FILTER_RESIDENTS} ];
	
	$scope.sortCriterias = [{key:"+name", value:"Name (A-Z)"}, 
	                        {key:"-name",value:"Name (Z-A)"}, 
	                        {key:"+apartmentNum",value:"Apartment"}];
	
	
	
	 $scope.$watch('selectedFilter', function(newVal, oldVal){
			console.log("newval:" + newVal);
		    switch(newVal){
		        case '0':
		            //$scope.update($scope.memberList);
		            break;
		    }
		});
	 
	$scope.toggleUpload = function() {
		if (isUploadOpen()) {
			$scope.close();
		} else {
			$state.go('.upload');
		}
	};
	

	$scope.loadMore = function() {
		
		$scope.scrollEnabled = false;
		pageIndex++;
		
		console.log("loadMore: " + pageIndex);
		
		residentService.getMembers(communityUrlKeyword, pageIndex, PAGE_LIMIT).then(function(results) {
			$scope.scrollEnabled =  (results.data.length > 0);
			console.log(results.data);
			Array.prototype.push.apply($scope.scrollList, results.data);
			
			$scope.loading = false;
		}, function(error) {});

	};
	
  $scope.doUpload = function(ev) {
	  console.log("file upload:" + $scope.dataFile.name);
	  if ($scope.dataFile.name) {
		  $scope.uploadClicked = true;
		  residentService.upload($scope.dataFile, communityUrlKeyword).then(function() {
			  $scope.message = 'Server has processed your file. You will recieve an email with the log.';
			  $scope.uploadClicked = false;
			  $scope.messagetype = "info"; 
			 init();
	        },function(error){
	        	$scope.message = 'Server encountered an error.';
	        	$scope.messagetype = "error"; 
	        });
	  } else {
		  $scope.message = 'Please select a file to upload';
		  $scope.messagetype = "warning"; 
	  }
   };
	   
   $scope.close = function() {
	   $state.go('^');
   };
	 

   function isUploadOpen() {
	  return ($state.current.name == 'default.main.manageRecords.upload');
   }
   
	
	$scope.edit = function(ev, user, index) {
		var bAdd = !user;
		$mdDialog.show({
			controller: 'editResidentController',
			templateUrl: 'components/residents/edit_resident.html',
			parent: angular.element(document.body),
		    targetEvent: ev,
		    locals: { user: bAdd? null: JSON.parse(JSON.stringify(user))}
		}) .then(function(saveUserObj) {
			
			if (saveUserObj) {
					residentService.saveUser(saveUserObj.user, communityUrlKeyword, saveUserObj.customMessage).
					 then(function(results) {
						 if (bAdd) {
							 saveUserObj.user.userId = results.data;
							 console.log("inserted user:" + results.data);
							 //$scope.memberList.unshift(saveUserObj.user);
							 $scope.scrollList.unshift(saveUserObj.user);
							 showMsg('Resident ' + saveUserObj.user.name + ' added.');
						 } else {
							 $scope.scrollList[index] = saveUserObj.user;
							 showMsg('Resident details of ' + saveUserObj.user.name + ' saved.');
						 } 
					 }, function(error) { 
						console.log(error.code);
						console.log(error.message);
					 	showMsg("FAILED:" + error.message);
					 	$scope.messagetype = "error"; 
				 }); 
				
			}
	    }, function() {
	    	console.log("cancelled dialog");
	    });
	};
	
	$scope.view = function(ev, user) {
		$mdDialog.show({
			controller: 'viewResidentController',
			templateUrl: 'components/residents/view_student.html',
			parent: angular.element(document.body),
		    targetEvent: ev,
		    locals: { user: user}
		}) .then(function(answer) {
	    }, function(e) {
	    	console.log(e);
	    });
	};
	

	
	$scope.sendInvites = function(ev) {
		 var confirm = $mdDialog.confirm()
	      .parent(angular.element(document.body))
	      .title('Send Invites to residents')
	      .content('Would you like to send invites to residents who have not joined this community?.')
	      .ariaLabel('Send invites to residents who have not joined')
	      .ok('YES')
	      .cancel('NO')
	      .targetEvent(ev);
	    $mdDialog.show(confirm).then(function() {
	    	residentService.sendInvites(communityUrlKeyword).then(function() {
	    			console.log("invites sent");
	    			$scope.messagetype = "info"; 
	    			showMsg("emails have been sent to residents who have not joined this community.");
		        },function(error){
		        	console.log(error);
		        	$scope.messagetype = "error"; 
		        });
	    }, function() {
	    	console.log(error);
	    });
	}
	
	$scope.deleteUser = function(ev, user, index) {
		 var confirm = $mdDialog.confirm()
	      .parent(angular.element(document.body))
	      .title('Remove ' + user.name + ' from community')
	      .content('Are you sure you want to remove ' + user.name +  ' from community?.')
	      .ariaLabel('Remove ' + user.name + ' from community')
	      .ok('YES')
	      .cancel('NO')
	      .targetEvent(ev);
	    $mdDialog.show(confirm).then(function() {
	    	residentService.removeUser(communityUrlKeyword, user).then(function() {
	    			console.log(user.name + " is removed from " + communityUrlKeyword);
	    			showMsg("User " + user.name + " has been removed from this community.");
	    			if (index > -1) {
	    				$scope.scrollList.splice(index, 1);
	    			}
		        },function(error){
		        	console.log(error);
		        	$scope.messagetype = "error"; 
		        });
	    }, function() {
	    	console.log("user canceled");
	    });
	}
	
	  
	  $scope.resend = function(ev, user) {
			 var confirm = $mdDialog.confirm()
		      .parent(angular.element(document.body))
		      .title('Invite ' + user.name + ' to community')
		      .content('Are you sure you want to send email inviting ' + user.name +  ' to join this community?.')
		      .ariaLabel('Invite ' + user.name + ' from community')
		      .ok('YES')
		      .cancel('NO')
		      .targetEvent(ev);
		    $mdDialog.show(confirm).then(function() {
				  loginService.resend(user.email, communityUrlKeyword)
				  	.then(function(results) {
				  		showMsg('Invite sent.');
				  	}, function(error) { 
				  		console.log(error); 
				  	});
		    });
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

angular.module('hiveInTown').filter('memberFilter', function() {
	return function(memberList, selectedFilter, scope) {
		if (!angular.isDefined(selectedFilter)) {
			return memberList;
		} 
		if (selectedFilter == 0) {
			return memberList;
		}
		var results = [];
		angular.forEach(memberList, function(mem) {
			if (selectedFilter == 1 && !mem.isVerified) {
				results.push(mem);
			} else if (selectedFilter == 2 && mem.isVerified) {
				results.push(mem);
			} else if (selectedFilter == 3 && mem.role == 'ADMIN') {
				results.push(mem);
			} else if (selectedFilter == 4 && mem.role == 'RESIDENT') {
				results.push(mem);
			} 
		});
		//scope.update(results);
		return results;
	}
});

angular.module('hiveInTown').filter('offset', function() {
	  return function(input, start) {
	    start = parseInt(start, 10);
	    return input.slice(start);
	  };
});



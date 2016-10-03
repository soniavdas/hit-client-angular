angular.module('hiveInTown.serviceprovider').controller("serviceproviderController", function($scope, $state, $stateParams, $mdDialog,
													residentService, USER_ROLES, $mdToast, loginService) {
	
	var FILTER_NONE = "Show All";
	var FILTER_DRIVER = "Driver";
	var FILTER_MAID = "Maid";
	var FILTER_CARETAKER = "CareTaker";
	var FILTER_COOK = "Cook";
	var FILTER_PLUMBER = "Plumber";
	var FILTER_ELECTRICIAN = "Electrician";
	var FILTER_MANAGER = "Manager";
	var FILTER_HOUSEKEEPING = "HouseKeeping";
	var FILTER_SECURITY = "Security";
	var PAGE_LIMIT = 20;
	var communityUrlKeyword = $stateParams.communityUrlKeyword;
	
	$scope.loading = true;
	$scope.totalCount = 0;
	$scope.total = 0;
	$scope.totalActive = 0;
	$scope.totalPending = 0;
	$scope.totalAdmins = 0;
	$scope.totalResidents = 0;
	$scope.searchText = '';
	$scope.filteredResults = [];
	$scope.memberList = [];
	$scope.communityUrlKeyword = communityUrlKeyword;
	$scope.message = '';
	$scope.dataFile = {};
	$scope.uploadClicked = false;
	$scope.selectedFilter = 0;
	$scope.scrollList = [];
	$scope.scrollEnabled = true;
	$scope.isAuthorized = loginService.isAuthorized(USER_ROLES.admin);
		
	
	$scope.filters = [{id:0, name:FILTER_NONE},
					   {id:1, name:FILTER_DRIVER}, 
	                  {id:2, name:FILTER_MAID}, 
	                  {id:3, name:FILTER_CARETAKER}, 
	                  {id:4, name:FILTER_COOK}, 
	                  {id:5, name:FILTER_PLUMBER}, 
	                  {id:6, name:FILTER_ELECTRICIAN}, 
	                  {id:7, name:FILTER_MANAGER}, 
	                  {id:8, name:FILTER_HOUSEKEEPING}, 
	                  {id:9, name:FILTER_SECURITY} ];
	
	$scope.sortCriterias = [{key:"+name", value:"Active"}, 
	                        {key:"-name",value:"Inactive"}, 
	                        {key:"+apartmentNum",value:"Blocked"}];
	
	
	init();
	
	 $scope.$watch('selectedFilter', function(newVal, oldVal){
			console.log("newval:" + newVal);
		    switch(newVal){
		        case '0':
		            $scope.update($scope.memberList);
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
	
	function init() {
		residentService.getMembers(communityUrlKeyword).then(function(results) {
			$scope.memberList = results.data;
			$scope.last = -1;
			$scope.loadMore();
			$scope.scrollEnabled = true;
			$scope.loading = false;
			//update($scope.memberList);
		}, function(error) {});
	};
	
  $scope.doUpload = function(ev) {
	  console.log("file upload:" + $scope.dataFile.name);
	  if ($scope.dataFile.name) {
		  $scope.uploadClicked = true;
		  residentService.upload($scope.dataFile, communityUrlKeyword).then(function() {
			  $scope.message = 'Server has processed your file. You will recieve an email with the log.';
			  $scope.uploadClicked = false;
			 init();
	        },function(error){
	        	$scope.message = 'Server encountered an error.';
	        });
	  } else {
		  $scope.message = 'Please select a file to upload';
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
			controller: 'editserviceproviderController',
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
							 $scope.memberList.unshift(saveUserObj.user);
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
				 }); 
				
			}
	    }, function() {
	    	console.log("cancelled dialog");
	    });
	};
	
	$scope.view = function(ev, user) {
		$mdDialog.show({
			controller: 'viewserviceproviderController',
			templateUrl: 'components/serviceprovider/view_sp.html',
			parent: angular.element(document.body),
		    targetEvent: ev,
		    locals: { user: user}
		}) .then(function(answer) {
	    }, function(e) {
	    	console.log(e);
	    });
	};
	
	$scope.loadMore = function() {
	    for(var i = 1; i <= 20; i++) {
	    	var index = ++$scope.last;
	    	if ($scope.memberList[index]) {
	    		$scope.scrollList.push($scope.memberList[index]);
	    	} else {
	    		$scope.scrollEnabled = false;
				return;
	    	}
	    }
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
	    	serviceproviderService.sendInvites(communityUrlKeyword).then(function() {
	    			console.log("invites sent");
	    			showMsg("emails have been sent to residents who have not joined this community.");
		        },function(error){
		        	console.log(error);
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
	    	serviceproviderService.removeUser(communityUrlKeyword, user).then(function() {
	    			console.log(user.name + " is removed from " + communityUrlKeyword);
	    			showMsg("User " + user.name + " has been removed from this community.");
	    			if (index > -1) {
	    				$scope.scrollList.splice(index, 1);
	    			}
		        },function(error){
		        	console.log(error);
		        });
	    }, function() {
	    	console.log(error);
	    });
	}
	  
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



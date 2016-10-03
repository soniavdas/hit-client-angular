

angular.module('hiveInTown.accounts').controller("accountsController", function($scope, $state, $stateParams, 
													residentService, USER_ROLES) {
	
	var FILTER_NONE = "Show All";
	var FILTER_ACTIVE = "Active";
	var FILTER_PENDING = "Pending";
	var FILTER_ADMINS = "Admins";
	var FILTER_RESIDENTS = "Residents";
	var PAGE_LIMIT = 20;
	var communityUrlKeyword = $stateParams.communityUrlKeyword;
	
	$scope.pageLimit = PAGE_LIMIT;
	$scope.totalCount = 0;
	$scope.currentPage = 0;
	$scope.numPages = 0;
	$scope.total = 0;
	$scope.totalActive = 0;
	$scope.totalPending = 0;
	$scope.totalAdmins = 0;
	$scope.totalResidents = 0;
	$scope.prevDisabled = false;
	$scope.nextDisabled = false;
	$scope.searchText = '';
	$scope.update = update;
	$scope.filteredResults = [];
	$scope.memberList = [];
	$scope.startRow = 1;
	$scope.endRow = PAGE_LIMIT;
	$scope.communityUrlKeyword = communityUrlKeyword;
	$scope.message = '';
	$scope.dataFile = {};
	$scope.uploadClicked = false;
	$scope.selectedFilter = 0;
	
	$scope.tabs = [{title : 'Credit', disabled: false},
	               {title : 'Debit', disabled: false},
	               {title : 'Reports', disabled: false}]
	
	$scope.filters = [{id:0, name:FILTER_NONE},
					   {id:1, name:FILTER_PENDING}, 
	                  {id:2, name:FILTER_ACTIVE}, 
	                  {id:3, name:FILTER_ADMINS}, 
	                  {id:4, name:FILTER_RESIDENTS} ];
	
	$scope.sortCriterias = [{key:"+name", value:"Name (A-Z)"}, 
	                        {key:"-name",value:"Name (Z-A)"}, 
	                        {key:"+apartmentNum",value:"Apartment"}];
	
	
	init();
	
	
	 $scope.$on('DATAFILE_UPLOADED', function (event, data) {
		 init();
	 });
	 
	 $scope.$watch('selectedFilter', function(newVal, oldVal){
			console.log("newval:" + newVal);
		    switch(newVal){
		        case '0':
		            $scope.update($scope.memberList);
		            break;
		    }
		});
	 
	$scope.getNext = function() {
		if ($scope.currentPage < $scope.numPages ) {
			updateNextPrevFlags(++$scope.currentPage, $scope.numPages);
		}
	};
	
	$scope.getPrev = function() {
		if ($scope.currentPage > 0) {
			updateNextPrevFlags(--$scope.currentPage, $scope.numPages);
		}
	};
	
	// toggle add block
	$scope.toggleEdit = function() {
		if (isEditOpen()) {
			$scope.close();
		} else {
			$state.go('.add', {index: -1});
		}
	};
	
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
			update($scope.memberList);
		}, function(error) {});
		
		residentService.countOfResidents(communityUrlKeyword).success(function(results) {
			$scope.total = results["total"];
			$scope.totalActive = results["totalVerified"];
			$scope.totalPending = results["totalUnVerified"];
			$scope.totalAdmins = results["totalAdmins"];
			$scope.totalResidents = results["totalResidents"];
		});
		
		//$scope.message = "You can add a user to this community as an admin or resident. An invite will be sent clicking on which the user can access the website."
	};
	
	function update(list) {
		$scope.currentPage = 0;
		$scope.totalCount = list.length;
		$scope.numPages = Math.ceil($scope.totalCount/PAGE_LIMIT);
		updateNextPrevFlags($scope.currentPage, $scope.numPages);
	}
	
	function updateNextPrevFlags(index, numPages) {
		$scope.startRow = index * PAGE_LIMIT + 1;
		if ($scope.totalCount < PAGE_LIMIT) {
			$scope.endRow = $scope.totalCount;
		} else {
			$scope.endRow = $scope.startRow - 1 + PAGE_LIMIT;
		}
		$scope.nextDisabled = (index >= numPages - 1);
		$scope.prevDisabled = (index <= 0);
	}
	
  $scope.doUpload = function(ev) {
	  console.log("file upload:" + $scope.dataFile.name);
	  if ($scope.dataFile.name) {
		  $scope.uploadClicked = true;
		  residentService.upload($scope.dataFile, communityUrlKeyword).then(function() {
			  $scope.message = 'Server has processed your file. You will recieve an email with the log.';
			  $scope.uploadClicked = false;
			  $scope.$emit('DATAFILE_UPLOADED');
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
	 
   $scope.editUser = function(userId) {
	   $state.go('.add', {id: userId});
   };
   
   function isEditOpen() {
	   return ($state.current.name == 'default.main.manageRecords.add');
   }
   
   function isUploadOpen() {
	  return ($state.current.name == 'default.main.manageRecords.upload');
   }
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
		scope.update(results);
		return results;
	}
});

angular.module('hiveInTown').filter('offset', function() {
	  return function(input, start) {
	    start = parseInt(start, 10);
	    return input.slice(start);
	  };
});



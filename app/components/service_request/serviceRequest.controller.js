angular.module('hiveInTown.service_request').controller("serviceRequestController", function($scope, $state, $stateParams, $mdDialog,
													SERVICEREQUEST_STATUS,serviceRequestService,loginService, USER_ROLES) {
	
	var FILTER_ALL = "All";
	var FILTER_OPEN = "Open";
	var FILTER_ONGOING = "Ongoing";
	var FILTER_CLOSED = "Closed";
	var GET_ALL_SERVICEREQUESTS = 0;
	var GET_SINGLE_SERVICEREQUEST = 1;
	var PAGE_LIMIT = 20;
	var communityUrlKeyword = $stateParams.communityUrlKeyword;
	
	$scope.pageLimit = PAGE_LIMIT;
	$scope.totalCount = 0;
	$scope.currentPage = 0;
	$scope.numPages = 0;
	$scope.total = 0;
	$scope.currentPage = 0;
	$scope.searchText = '';
	//$scope.update = update;
	$scope.filteredResults = [];
	$scope.serviceRequestList = [];
	$scope.startRow = 1;
	$scope.endRow = PAGE_LIMIT;
	$scope.communityUrlKeyword = communityUrlKeyword;
	$scope.message = '';
	$scope.dataFile = {};
	$scope.isAuthorized = loginService.isAuthorized(USER_ROLES.admin);
	
	$scope.filters = [{id: 0, name:FILTER_OPEN}, 
	                  {id:1, name:FILTER_ONGOING},
	                  {id:2, name:FILTER_CLOSED} 
					  ];
	
	
      
      	$scope.sortCriterias = [{key:"-dateStatusUpdated", value:"Latest"}, 
	                        {key:"+dateStatusUpdated",value:"Older"}, 
	                       ];
	
	
	init();
	
	function init() {
		serviceRequestService.getServiceRequests(communityUrlKeyword,GET_ALL_SERVICEREQUESTS).success(function(serviceRequestList) {
			$scope.serviceRequestList = serviceRequestList;
		});
	};
	
	
	$scope.edit = function(ev, serviceRequest) {
		var bAdd = (!serviceRequest || serviceRequest.statusId == SERVICEREQUEST_STATUS.approved)
		if (serviceRequest && serviceRequest.statusId == SERVICEREQUEST_STATUS.approved) {
			var newServiceRequest = new Object();
			newServiceRequest.details = newServiceRequest.details;
			newServiceRequest.serviceReqId = undefined;
			newServiceRequest.subject = "UPDATED:" + serviceRequest.subject;
			newServiceRequest.statusId = 1;
			serviceRequest = newServiceRequest;
		}
		$mdDialog.show({
			controller: 'editServiceRequestController',
			templateUrl: 'components/service_request/add_servicerequest.html',
			parent: angular.element(document.body),
		    targetEvent: ev,
		    locals: { serviceRequest: serviceRequest, communityUrlKeyword: communityUrlKeyword}
		}) .then(function(savedServiceRequest) {
				if (bAdd) {
					console.log("serviceRequest added");
					$scope.serviceRequsetList.unshift(savedServiceRequest);
				}
	    	}, function(e) {
	    		console.log(e);
	    });
	};
	
	$scope.view = function(ev, serviceRequest) {
		$mdDialog.show({
			controller: 'viewServiceRequestController',
			templateUrl: 'components/service_request/view_serviceRequest.html',
			parent: angular.element(document.body),
		    targetEvent: ev,
		    locals: { serviceRequest: serviceRequest, communityUrlKeyword: communityUrlKeyword}
		}) .then(function(answer) {
		     // $scope.alert = 'You said the information was "' + answer + '".';
	    }, function(e) {
	    	console.log(e);
	    });
	};
	
	$scope.deleteserviceRequest = function(ev, serviceRequest, index) {
		 var confirm = $mdDialog.confirm()
	      .parent(angular.element(document.body))
	      .title('Delete serviceRequest')
	      .content('Are you sure you want to delete ' + serviceRequest.subject +  ' ?.')
	      .ariaLabel('Delete  serviceRequest')
	      .ok('YES')
	      .cancel('NO')
	      .targetEvent(ev);
	    $mdDialog.show(confirm).then(function() {
	    	serviceRequestService.deleteserviceRequest(communityUrlKeyword, serviceRequest).then(function() {
	    			console.log('serviceRequest is deleted');
	    			showMsg("serviceRequest is deleted.");
	    			if (index > -1) {
	    				$scope.serviceRequestList.splice(index, 1);
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

angular.module('hiveInTown.service_request').controller("editServiceRequestController", function($scope, $mdDialog, serviceRequestService,
		serviceRequest,  communityUrlKeyword, SERVICEREQUEST_STATUS, $mdToast) {
	  
	  $scope.statuslist = [
          "Open",
          "Ongoing",
          "Closed"
       ];
      
      $scope.categorylist = [
          "HouseKeeping",
          "Plumbing",
          "Electrical",
          "Manager"
       ];
       
      $scope.serviceproviderlist = [
          "Name1",
          "Name2",
          "Name3",
          "Name4",
          "Name5",
          "Name6",
          "Name7",
          "Name8"
       ];


      $scope.toppings = [
        { category: 'meat', name: 'HK1' },
        { category: 'meat', name: 'HK2' },
        { category: 'meat', name: 'Elec1' },
        { category: 'meat', name: 'Elec2' },
        { category: 'veg', name: 'Mushrooms' },
        { category: 'veg', name: 'Onion' },
        { category: 'veg', name: 'Green Pepper' },
        { category: 'veg', name: 'Green Olives' }
      ];

	$scope.serviceRequest = serviceRequest;
	
	if (serviceRequest) {
		$scope.title = serviceRequest.subject;
	}
	
	  $scope.close = function() {
		  $mdDialog.cancel();
	  };
	  
	  $scope.add = function(serviceRequest, statusId) {
			 
		 if (!statusId) {
			 statusId = 1;
		 }
		 
		 if (serviceRequest.statusId != statusId) {
			 serviceRequest.dateStatusUpdated = new Date();
		 }
		  serviceRequest.statusId = statusId;
		  serviceRequest.categoryId = 1;
		  serviceRequestService.createserviceRequest(serviceRequest, communityUrlKeyword).
			 success(function(data, status, headers, config) {
				 serviceRequest.serviceRequestId = data;
				 $scope.serviceRequest = serviceRequest;
				 if (serviceRequest.statusId == SERVICEREQUEST_STATUS.draft) {
					 showMsg('serviceRequest is saved as draft.')
				 } else if (serviceRequest.statusId == SERVICEREQUEST_STATUS.approved){ 
					 showMsg('serviceRequest is sent out.')
				 }
			 }).
			 error(function(data, status, headers, config) {
				 $scope.message = 'A server error occurred.';
			});
		  
		  $mdDialog.hide($scope.serviceRequest);
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



angular.module('hiveInTown.service_request').controller("viewServiceRequestController", function($scope, $mdDialog,$sce, serviceRequest) {
	
	$scope.serviceRequest = serviceRequest;
	$scope.title = $scope.serviceRequest.subject;
	 $scope.textserviceRequest =  $sce.trustAsHtml(serviceRequest.details);
	console.log($scope.textserviceRequest);
	
	$scope.close = function() {
		   $mdDialog.hide();
	  };
});

angular.module('hiveInTown').filter('serviceRequestFilter', function() {
	return function(serviceRequestList, selectedFilter, scope) {
		if (!angular.isDefined(selectedFilter)) {
			//scope.update(serviceRequestList);
			return serviceRequestList;
		} 
		var results = [];
		angular.forEach(serviceRequestList, function(serviceRequest) {
			if (selectedFilter == 0 && serviceRequest.statusId == 1) {
				results.push(serviceRequest);
			} else if (selectedFilter == 1 && serviceRequest.statusId == 2) {
				results.push(serviceRequest);
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



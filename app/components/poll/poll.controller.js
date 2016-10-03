angular.module('hiveInTown.poll').controller("pollController", function($scope, $state, $stateParams, 
							pollService, $mdDialog,NOTICE_STATUS, $mdToast, loginService, USER_ROLES) {
	
	var FILTER_ALL = "All";
	var FILTER_POSTED = "Posted";
	var FILTER_DRAFT = "Draft";
	var FILTER_CLOSED = "Closed";
	var GET_ALL_NOTICE = 0;
	var GET_SINGLE_NOTICE = 1;
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
	$scope.noticeList = [];
	$scope.startRow = 1;
	$scope.endRow = PAGE_LIMIT;
	$scope.communityUrlKeyword = communityUrlKeyword;
	$scope.message = '';
	$scope.dataFile = {};
	$scope.nbvalidity='';
	$scope.isAuthorized = loginService.isAuthorized(USER_ROLES.admin);
	$scope.polloption='none';
	
	$scope.filters = [{id: 0, name:FILTER_DRAFT}, 
	                  {id:1, name:FILTER_POSTED} 
					  ];
	
	$scope.sortCriterias = [{key:"-dateStatusUpdated", value:"Latest"}, 
	                        {key:"+dateStatusUpdated",value:"Older"}, 
	                       ];
	
	
	init();
		$scope.pollOptions = [
      { label: 'a', value: 'b', isDisabled: true/false }
    ];


	function init() {
		pollService.getPoll(communityUrlKeyword,GET_ALL_NOTICE).success(function(noticeList) {
			$scope.noticeList = noticeList;
			//update(noticeList);
		});
		
		/*noticeBoardService.countOfNotices(communityUrlKeyword).success(function(results) {
			$scope.total = results["total"];
			$scope.totalActive = results["approved"];
			$scope.totalDraft = results["draft"];
			$scope.totalExpired = results["expired"];
			$scope.totalPending = results["pending"];
		}); */
		
		//$scope.message = "You can add a user to this community as an admin or resident. An invite will be sent clicking on which the user can access the website."
	};
	
	
	$scope.edit = function(ev, poll) {
		var bAdd = (!poll || poll.statusId == NOTICE_STATUS.approved)
		
		// if editing a published notice then copy and create new notice.
		if (poll && poll.statusId == NOTICE_STATUS.approved) {
			var newpoll = new Object();
			newpoll.details = poll.details;
			newpoll.pollId = undefined;
			newpoll.subject = "UPDATED:" + poll.subject;
			newpoll.statusId = 1;
			poll = newpoll;
		}
		$mdDialog.show({
			controller: 'editPollController',
			templateUrl: 'components/poll/add_poll.html',
			parent: angular.element(document.body),
		    targetEvent: ev,
		    locals: { poll: poll, communityUrlKeyword: communityUrlKeyword}
		}) .then(function(savedpoll) {
				if (bAdd) {
					console.log("poll added");
					$scope.noticeList.unshift(savedpoll);
				}
	    	}, function(e) {
	    		console.log(e);
	    });
	};
	
	$scope.view = function(ev, poll) {
		$mdDialog.show({
			controller: 'viewPollController',
			templateUrl: 'components/poll/view_poll.html',
			parent: angular.element(document.body),
		    targetEvent: ev,
		    locals: { poll: poll, communityUrlKeyword: communityUrlKeyword}
		}) .then(function(answer) {
		     // $scope.alert = 'You said the information was "' + answer + '".';
	    }, function(e) {
	    	console.log(e);
	    });
	};
	
	$scope.deletePoll = function(ev, poll, index) {
		 var confirm = $mdDialog.confirm()
	      .parent(angular.element(document.body))
	      .title('Delete poll')
	      .content('Are you sure you want to delete ' + poll.subject +  ' ?.')
	      .ariaLabel('Delete  poll')
	      .ok('YES')
	      .cancel('NO')
	      .targetEvent(ev);
	    $mdDialog.show(confirm).then(function() {
	    	pollService.deletePoll(communityUrlKeyword, poll).then(function() {
	    			console.log('poll is deleted');
	    			showMsg("poll is deleted.");
	    			if (index > -1) {
	    				$scope.noticeList.splice(index, 1);
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

angular.module('hiveInTown.poll').controller("editPollController", function($scope, $mdDialog, pollService,
		poll,  communityUrlKeyword, NOTICE_STATUS, $mdToast) {
		
		$scope.polloption='none';
	
		$scope.pollOptions = [
		];
	
	$scope.poll = poll;
	
	if (poll) {
		$scope.title = poll.subect;
	}
	
	  $scope.close = function() {
		  $mdDialog.cancel();
	  };
	  
	  $scope.add = function(poll, statusId) {
			 
		 if (!statusId) {
			 statusId = 1;
		 }
		 
		 if (poll.statusId != statusId) {
			 poll.dateStatusUpdated = new Date();
		 }
		  poll.statusId = statusId;
		  poll.categoryId = 1;
		  pollService.createPoll(poll, communityUrlKeyword).
			 success(function(data, status, headers, config) {
				 poll.pollId = data;
				 $scope.poll = poll;
				 if (poll.statusId == NOTICE_STATUS.draft) {
					 showMsg('Notice is saved as draft.')
				 } else if (poll.statusId == NOTICE_STATUS.approved){ 
					 showMsg('Notice is sent out.')
				 }
			 }).
			 error(function(data, status, headers, config) {
				 $scope.message = 'A server error occurred.';
			});
		  
		  $mdDialog.hide($scope.poll);
	  };
	  	    $scope.addItem = function() {
      var option=$scope.polloption;
      $scope.pollOptions.push({ label: option, value: option });
    };
    
    $scope.removeItem = function() {
      $scope.pollOptions.pop();
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



angular.module('hiveInTown.poll').controller("viewPollController", function($scope, $mdDialog,$sce, poll) {
	
	$scope.poll = poll;
	$scope.title = $scope.poll.subect;
	 $scope.textpoll =  $sce.trustAsHtml(poll.details);
	console.log($scope.textpoll);
	
	$scope.close = function() {
		   $mdDialog.hide();
	  };
	  
	  
	      $scope.data = {
      group1 : 'Banana',
      optiongroup : '2',
      group3 : 'avatar-1'
    };
    $scope.radioData = [
      { label: '1', value: 1 },
      { label: '2', value: 2 },
      { label: '3', value: '3', isDisabled: true },
      { label: '4', value: '4' }
    ];
    $scope.submit = function() {
      alert('submit');
    };
    $scope.addItem = function() {
      var r = Math.ceil(Math.random() * 1000);
      $scope.radioData.push({ label: r, value: r });
    };
    $scope.removeItem = function() {
      $scope.radioData.pop();
    };
});

angular.module('hiveInTown').filter('pollFilter', function() {
	return function(noticeList, selectedFilter, scope) {
		if (!angular.isDefined(selectedFilter)) {
			//scope.update(noticeList);
			return noticeList;
		} 
		var results = [];
		angular.forEach(noticeList, function(poll) {
			if (selectedFilter == 0 && poll.statusId == 1) {
				results.push(poll);
			} else if (selectedFilter == 1 && poll.statusId == 2) {
				results.push(poll);
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



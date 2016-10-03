angular.module('hiveInTown.noticeboard').controller("noticeBoardController", function($scope, $state, $stateParams, 
							noticeBoardService, $mdDialog, NOTICE_STATUS, $mdToast, loginService, USER_ROLES, $sce, Session, $compile, $document) {
	
	var FILTER_ALL = "All";
	var FILTER_POSTED = "Posted";
	var FILTER_DRAFT = "Draft";
	var FILTER_CLOSED = "Closed";
	var GET_ALL_NOTICE = 0;
	var GET_SINGLE_NOTICE = 1;
	var PAGE_LIMIT = 10;
	var pageIndex = -1;
	var communityUrlKeyword = $stateParams.communityUrlKeyword;
	$scope.profilepic="";

	$scope.pageLimit = PAGE_LIMIT;
	$scope.filteredResults = [];
	$scope.noticeList = [];
	$scope.communityUrlKeyword = communityUrlKeyword;
	$scope.message = '';
	$scope.isAuthorized = loginService.isAuthorized(USER_ROLES.admin);
	$scope.filters = [{id: 0, name:FILTER_DRAFT}, 
	                  {id:1, name:FILTER_POSTED} 
					  ];
	$scope.sortCriterias = [{key:"-dateStatusUpdated", value:"Latest"}, 
	                        {key:"+dateStatusUpdated",value:"Older"}, 
	                       ];
	$scope.loading = true;
	
	$scope.selectedNoticeId = null;
	$scope.editedNoticeRow = null;
	$scope.scrollEnabled = true;
	
	var commentsChildScope, detailsChildScope, editChildScope;
	
	
	$scope.loadMore = function() {
		
		$scope.scrollEnabled = false;
		pageIndex++;
		
		console.log("loadMore: " + pageIndex);
		
		noticeBoardService.getNotices(communityUrlKeyword, GET_ALL_NOTICE, pageIndex, PAGE_LIMIT).then(function(results) {
			$scope.scrollEnabled =  (results.data.length > 0) ? true: false;
			console.log("results count:" + results.data.length);
			console.log(results.data);
			$scope.loading = false;
			
			Array.prototype.push.apply($scope.noticeList, results.data);
			
		}, function(error) {});

	};
	
	$scope.closeEdit = function(index) {
		 $document.find('#edit-placeholder' + index).empty();
		 if (editChildScope) {
			 editChildScope.$destroy();
			 editChildScope = null;
		 }
		 $scope.editedNoticeRow = null;
	};
	
	$scope.afterSaveNotice = function(noticeId, index, bAdd) {
		
		noticeBoardService.getNotice(communityUrlKeyword, noticeId).then(function(result) {
			var notice = result.data;
			if (bAdd) {
				$scope.noticeList.unshift(notice);
			} else {
				var i = findIndexById($scope.noticeList, notice.noticeId);
				$scope.noticeList[i] = notice;
			}
			
		}, 	function() {
			
		});
		
		$scope.closeEdit(index);
	}
	$scope.editdiag = function(ev, serviceRequest) {
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
			templateUrl: 'components/noticeboard/add_nb_dialog.html',
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

	$scope.edit = function(ev, notice, index) {
		var bAdd = (!notice || notice.statusId == NOTICE_STATUS.approved)
		
		// if editing a published notice then copy and create new notice.
		if (notice && notice.statusId == NOTICE_STATUS.approved) {
			var newNotice = new Object();
			newNotice.details = notice.details;
			newNotice.noticeId = undefined;
			newNotice.subject = "UPDATED:" + notice.subject;
			newNotice.statusId = 1;
			newNotice.comments = new Array();
			notice = newNotice;
		}
	
		if ($scope.editedNoticeRow) {
			$scope.closeEdit($scope.editedNoticeRow);
		}
		
	    editChildScope = $scope.$new();
	    editChildScope.notice = notice;
	    editChildScope.communityUrlKeyword = communityUrlKeyword;
	    editChildScope.index = index;
	    editChildScope.cancelClick = $scope.closeEdit;
	    editChildScope.afterUpdate = $scope.afterSaveNotice;
        var compiledDirective = $compile('<div edit-directive notice="notice" community-url-keyword="communityUrlKeyword" '+
        		'index="index" cancel-click="closeEdit(arg1)" after-update="afterSaveNotice(noticeId, index, bAdd)"></div>');
        var directiveElement = compiledDirective(editChildScope);
        $document.find('#edit-placeholder' + index).append(directiveElement);
        $scope.editedNoticeRow = index;
	};
	
	$scope.deleteNotice = function(ev, notice, index) {
		 var confirm = $mdDialog.confirm()
	      .parent(angular.element(document.body))
	      .title('Delete notice')
	      .content('Are you sure you want to delete ' + notice.subject +  ' ?.')
	      .ariaLabel('Delete  notice')
	      .ok('YES')
	      .cancel('NO')
	      .targetEvent(ev);
	    $mdDialog.show(confirm).then(function() {
	    	noticeBoardService.deleteNotice(communityUrlKeyword, notice).then(function() {
	    			console.log('notice is deleted');
	    			showMsg("Notice is deleted.");
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
	
	$scope.onCommentAdded = function(commentId, noticeId) {
		if (commentId) {
			noticeBoardService.getComment(communityUrlKeyword, commentId).then(function (result) {
				var i = findIndexById($scope.noticeList, noticeId);
				var notice = $scope.noticeList[i];
				if (!notice.comments) {
					notice.comments = new Array();
				}
				notice.comments.push(result.data);
			}, function() {
			});
		}
	}
	

	
	$scope.toggleDetails = function(notice, index) {

		if ($scope.selectedNoticeId) {
			if (commentsChildScope) {
				commentsChildScope.$destroy();
				
			}
			if (detailsChildScope) {
				detailsChildScope.$destroy();
			}
			
			$document.find('#comments-placeholder'+ $scope.selectedNoticeId).empty();
			$document.find('#notice-placeholder'+ $scope.selectedNoticeId).empty();
		}
		
		var showExpanded = $scope.selectedNoticeId != notice.noticeId;
		
		if (showExpanded) {
			$scope.selectedNoticeId = notice.noticeId;
			
			commentsChildScope = $scope.$new();
			commentsChildScope.notice = notice;
			commentsChildScope.communityUrlKeyword = communityUrlKeyword;
			commentsChildScope.onSuccessAddComment = $scope.onCommentAdded;
			var compiledDirective = $compile('<div comments-directive community-url-keyword="communityUrlKeyword" notice="notice" ' + 
					'on-add-comment="onCommentAdded(commentId, noticeId)"></div>');
			var directiveElement = compiledDirective(commentsChildScope);
			$document.find('#comments-placeholder' + notice.noticeId).append(directiveElement);
			
			detailsChildScope = $scope.$new();
			detailsChildScope.notice = notice;
			compiledDirective = $compile('<div notice-directive notice="notice"></div>');
			directiveElement = compiledDirective(detailsChildScope);
			$document.find('#notice-placeholder' + notice.noticeId).append(directiveElement);
			$scope.profilepic = Session.getprofileimage();

		} else {
			$scope.selectedNoticeId = null;
		}
	};
	
	$scope.publishNotice = function(ev, notice, index) {
		
		    var confirm = $mdDialog.confirm()
		          .title('Publish Notice')
		          .content('You are about to send out email with this notice to all subscribers in this community. Are you sure you want to proceed?')
		          .ariaLabel('Publish Notice')
		          .targetEvent(ev)
		          .ok('Yes')
		          .cancel('No');
		          
		    $mdDialog.show(confirm).then(function() {
		    	noticeBoardService.publish(communityUrlKeyword, notice.noticeId).then(function () {
		    		notice.statusId = NOTICE_STATUS.approved;
		    		showMsg("Notice is published.");
		    	}, function() {
		    		showMsg("Error while publishing notice.");
		    	});
		    }, function() {
		    });
	};
	
	function findIndexById(source, id) {
		for (var i = 0; i < source.length; i++) {
		    if (source[i].noticeId == id) {
		      return i;
		    }
		 }
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

angular.module('hiveInTown.noticeboard').controller("editNoticeController", function($scope, $mdDialog, noticeBoardService,
		notice,  communityUrlKeyword, NOTICE_STATUS, $mdToast) {
	
	$scope.notice = notice;
	
	if (notice) {
		$scope.title = notice.subect;
	}
	
	  $scope.close = function() {
		  $mdDialog.cancel();
	  };
	  
	  $scope.add = function(notice, statusId) {
			 
		 if (!statusId) {
			 statusId = 1;
		 }
		 
		 if (notice.statusId != statusId) {
			 notice.dateStatusUpdated = new Date();
		 }
		  notice.statusId = statusId;
		  notice.categoryId = 1;
		  noticeBoardService.createNotice(notice, communityUrlKeyword).
			 success(function(data, status, headers, config) {
				 notice.noticeId = data;
				 $scope.notice = notice;
				 if (notice.statusId == NOTICE_STATUS.draft) {
					 showMsg('Notice is saved as draft.')
				 } else if (notice.statusId == NOTICE_STATUS.approved){ 
					 showMsg('Notice is sent out.')
				 }
			 }).
			 error(function(data, status, headers, config) {
				 $scope.message = 'A server error occurred.';
			});
		  
		  $mdDialog.hide($scope.notice);
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



angular.module('hiveInTown.noticeboard').controller("viewNoticeController", function($scope, $mdDialog,$sce, notice) {
	
	$scope.notice = notice;
	$scope.title = $scope.notice.subect;
	 $scope.textNotice =  $sce.trustAsHtml(notice.details);
	console.log($scope.textNotice);
	
	$scope.close = function() {
		   $mdDialog.hide();
	  };
});

angular.module('hiveInTown').filter('noticeFilter', function() {
	return function(noticeList, selectedFilter, scope) {
		if (!angular.isDefined(selectedFilter)) {
			//scope.update(noticeList);
			return noticeList;
		} 
		var results = [];
		angular.forEach(noticeList, function(notice) {
			if (selectedFilter == 0 && notice.statusId == 1) {
				results.push(notice);
			} else if (selectedFilter == 1 && notice.statusId == 2) {
				results.push(notice);
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



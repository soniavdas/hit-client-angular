angular.module('hiveInTown.noticeboard').directive("commentsDirective", function($http, $compile, noticeBoardService,$mdDialog, Session, USER_ROLES, $mdToast) {
	 return {
	        templateUrl: 'components/noticeboard/comments.html',
	        scope : {
	        	notice: '=',
	        	communityUrlKeyword: '=',
	        	onAddComment: '&'
	        },
	        link: function($scope, el, attrs){
	        	$scope.profilepic = Session.getprofileimage();
	        	$scope.addComment = function(newComment) {
	        		console.log(newComment);
	        		noticeBoardService.addComment($scope.communityUrlKeyword, $scope.notice.noticeId, newComment).then(function(result) {
	        			var commentId = result.data;
	        			console.log("commentId:" + commentId);
	        			$scope.onAddComment({commentId: commentId, noticeId: $scope.notice.noticeId});
	        		}, function(error) {
	        			console.log(error);
	        			
	        		});
	        	};
	        	
				$scope.deleteComment = function(ev, commentId, index) {
					var confirm = $mdDialog.confirm()
					.title('Are you sure you want to delete this comment?')
					.ariaLabel('Delete comment')
					.targetEvent(ev)
					.ok('Yes')
					.cancel('No');
					$mdDialog.show(confirm).then(function() {
							noticeBoardService.deleteComment($scope.communityUrlKeyword, commentId).then(function() {
								$scope.notice.comments.splice(index, 1);
							}, function(e) {
								$mdToast.show($mdToast.simple().content(e.message).hideDelay(3000));
							});
						}, function() {
					});
				};
	        	
	        	$scope.editComment = function(ev, commentId) {
	        		noticeBoardService.editComment($scope.communityUrlKeyword, commentId, newComment).then(function(result) {
	        			//var commentId = result.data;
	        			//console.log("commentId:" + commentId);
	        		}, function(e) {
	        			$mdToast.show($mdToast.simple().content(e.message).hideDelay(3000));
	        		}); 
	        	};

	        	$scope.isAuthorizedDelete = function(comment) {
	        		if (comment.commentedBy.userId == Session.getUser().userId) {
	        			return true;
	        		}
	        		return (Session.getUser().role == USER_ROLES.admin);
	        	}
	        	
	        	$scope.isAuthorizedEdit = function(comment) {
	        		if (comment.commentedBy.userId == Session.getUser().userId) {
	        			return true;
	        		}
	        		return false;
	        	}
	        	
	        }
	    }

});

angular.module('hiveInTown.noticeboard').directive("noticeDirective", function($http, $compile) {

	 return {
	        template:  '<div ng-bind-html="notice.details | sanitize">',
	        scope : {
	        	notice: '='
	        },
	        link: function(scope, el, attrs) {
	        }
	    }

});

angular.module('hiveInTown.noticeboard').directive("editDirective", function($http, $compile, $rootScope, $mdDialog, noticeBoardService, NOTICE_STATUS, $mdToast) {

	 return {
	        templateUrl:  'components/noticeboard/add_notice.html',
	        scope : {
	        	notice: '=',
	        	communityUrlKeyword: '=',
	        	index: '=',
	        	cancelClick : '&',
	        	afterUpdate: '&'	
	        },
	        link: function($scope, el, attrs) {
	        	$scope.close = function(ev) {
	        		
	        		if ($scope.noticeForm.details.$dirty || $scope.noticeForm.subject.$dirty) {
        				    var confirm = $mdDialog.confirm()
        				          .title('Unsaved Changes')
        				          .content('There are unsaved changes. Are you sure you want to cancel your changes?')
        				          .ariaLabel('Unsaved changes')
        				          .targetEvent(ev)
        				          .ok('Yes')
        				          .cancel('No');
        				          
        				    $mdDialog.show(confirm).then(function() {
        				    	$scope.cancelClick({arg1 : $scope.index});
        				    }, function() {
        				    });
	        		} else {
	        			$scope.cancelClick({arg1 : $scope.index});
	        		}
	        	}
	        	
	        	$scope.add = function(statusId) {
		       		 var notice = $scope.notice;
		       		 var communityUrlKeyword = $scope.communityUrlKeyword;
		       		 
		       		 var bAdd = (!notice.noticeId);
		       		 if (notice.statusId != statusId) {
		       			 notice.dateStatusUpdated = new Date();
		       		 }
		       		 
		       		  notice.statusId = statusId;
		       		  notice.categoryId = 1;
		       		  
		       		  noticeBoardService.saveNotice(notice, communityUrlKeyword).
		       			 success(function(data, status, headers, config) {
		       				 notice.noticeId = data;
		       				 if (notice.statusId == NOTICE_STATUS.draft) {
		       					 $mdToast.show($mdToast.simple().content("Notice "+notice.subject+" is saved as draft.").hideDelay(3000));
		       				 } else if (notice.statusId == NOTICE_STATUS.approved){ 
		       					$mdToast.show($mdToast.simple().content("Notice "+notice.subject+" is published.").hideDelay(3000));
		       				 }
		       				$scope.afterUpdate({noticeId: notice.noticeId, index: $scope.index, bAdd: bAdd});
		       			 }).
		       			 error(function(data, status, headers, config) {
		       				$mdToast.show($mdToast.simple().content("Saving of notice failed due to server error.").hideDelay(3000));
		       				 console.log('A server error occurred.');
		       				 console.log(data);
		       			});
	       	    };
	        }
	    }
});
/*angular.module('hiveInTown.noticeboard').factory('noticeBoardService', function($http) {
	
	 var nbAPI = {};

    nbAPI.getNotice = function() {
      return $http({
        method: 'JSONP', 
        url: 'http://hiveInTown.com/api/getNotice.json?callback=JSON_CALLBACK'
      });
    }

    return nbAPI;
});*/

angular.module('hiveInTown.noticeboard').service("noticeBoardService", function($http) {
	
	var NOTICE_URL_BASE = "/HiveInTown/server/noticeboard/{urlKeyword}";
	var GET_NOTICE_URL_PATH = '/notice/{id}';
	var GET_NOTICES_BY_STATUS_URL_PATH = "/notices?status="
	var GET_ALL_NOTICES = "/notices?status=any"
	var UPDATE_NOTICE_URL_PATH = "/notice/{id}";
	var ADD_COMMENT_URL_PATH = "/notice/{id}/comment";
	var DELETE_COMMENT_URL_PATH = "/comment/{comment-id}";
	var GET_SUMMARY_URL_PATH = "/notices/summary";    
	var DELETE_NOTICE_URL_PATH = "/notice/{id}";
	var GET_COMMENT_URL_PATH = "/comment/{id}";
	var PUBLISH_URL_PATH = "/notice/{id}/publish";
	var EDIT_COMMENT_URL_PATH = "/comment/{id}";
	
	this.saveNotice = function(notice, urlKeyword) {
		 
		 var postParam = { noticeId : notice.noticeId, 
				  		   subject: notice.subject,
				  	       details : notice.details, 
				  	       fromDate: notice.fromDate,
				  	       toDate: notice.toDate,
				  	       statusId: notice.statusId,
				  	       categoryId : notice.categoryId,
				  	       urlKeyword: urlKeyword};
		 
		 if (!notice.noticeId) {
			 notice.noticeId = 0;
		 }
		 var url = NOTICE_URL_BASE.replace('{urlKeyword}', urlKeyword) + UPDATE_NOTICE_URL_PATH.replace('{id}', notice.noticeId);
		 return $http.post(url, postParam);
	};
	
	
	this.getNotices = function(urlKeyword, status) {
		var url = NOTICE_URL_BASE.replace('{urlKeyword}', urlKeyword);
		
		if (status) {
			url = url + GET_NOTICES_BY_STATUS_URL_PATH + status;
		} else {
			url = url + GET_ALL_NOTICES;
		}
		return $http.get(url);
	};
	
	this.countOfNotices = function(urlKeyword) {
		var url = NOTICE_URL_BASE.replace('{urlKeyword}', urlKeyword) + GET_SUMMARY_URL_PATH;
		return $http.get(url);
	}
	
	this.deleteNotice = function(urlKeyword, notice) {
		var url = NOTICE_URL_BASE.replace('{urlKeyword}', urlKeyword) + DELETE_NOTICE_URL_PATH.replace('{id}', notice.noticeId);
		return $http.delete(url, null);
	}
	
	this.addComment = function(urlKeyword, noticeId, commentText) {
		if (commentText && noticeId > 0) {
			var url =  NOTICE_URL_BASE.replace('{urlKeyword}', urlKeyword) + ADD_COMMENT_URL_PATH.replace('{id}', noticeId);
			var req = {
				 method: 'POST',
				 url: url,
				 headers: {
				   'Content-Type': 'text/plain'
				 },
				 data: commentText
			};

			return $http(req);
					
		}
					
	}
	
	this.getNotice = function(urlKeyword, noticeId) {
		var url = NOTICE_URL_BASE.replace('{urlKeyword}', urlKeyword) + GET_NOTICE_URL_PATH.replace('{id}', noticeId);
		return $http.get(url);
	}
	
	this.getComment = function(urlKeyword, commentId) {
		var url = NOTICE_URL_BASE.replace('{urlKeyword}', urlKeyword) + GET_COMMENT_URL_PATH.replace('{id}', commentId);
		return $http.get(url);
	}
	
	this.deleteComment = function(urlKeyword, commentId) {
		var url = NOTICE_URL_BASE.replace('{urlKeyword}', urlKeyword) + DELETE_COMMENT_URL_PATH.replace('{comment-id}', commentId);
		return $http.delete(url);
	}
	
	this.editComment = function(urlKeyword, commentId, commentText) {
		if (commentText && noticeId > 0) {
			var url =  NOTICE_URL_BASE.replace('{urlKeyword}', urlKeyword) + EDIT_COMMENT_URL_PATH.replace('{id}', commentId);
			var req = {
				 method: 'POST',
				 url: url,
				 headers: {
				   'Content-Type': 'text/plain'
				 },
				 data: commentText
			};

			return $http(req);
					
		}
					
	};
	
	this.publish = function(urlKeyword, noticeId) {
		var url = NOTICE_URL_BASE.replace('{urlKeyword}', urlKeyword) + PUBLISH_URL_PATH.replace('{id}', noticeId);
		return $http.post(url);
	}
});
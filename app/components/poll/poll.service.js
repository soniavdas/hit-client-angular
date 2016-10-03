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

angular.module('hiveInTown.poll').service("pollService", function($http) {
	
	
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

	
	this.createPoll = function(poll, urlKeyword) {
		 
		 var postParam = { noticeId : poll.pollId, 
				  		   subject: poll.subject,
				  	       details : poll.details, 
				  	       fromDate: poll.fromDate,
				  	       toDate: poll.toDate,
				  	       statusId: poll.statusId,
				  	       categoryId : poll.categoryId,
				  	       urlKeyword: urlKeyword};
		 
		 if (!poll.pollId) {
			 poll.pollId = 0;
		 }
		 var url = NOTICE_URL_BASE.replace('{urlKeyword}', urlKeyword) + UPDATE_NOTICE_URL_PATH.replace('{id}', poll.pollId);
		 return $http.post(url, postParam);
	};
	
	
	this.getPoll = function(urlKeyword, status) {
		var url = NOTICE_URL_BASE.replace('{urlKeyword}', urlKeyword);
		
		if (status) {
			url = url + GET_NOTICES_BY_STATUS_URL_PATH + status;
		} else {
			url = url + GET_ALL_NOTICES;
		}
		return $http.get(url);
	};
	
	this.countOfPolls = function(urlKeyword) {
		var url = NOTICE_URL_BASE.replace('{urlKeyword}', urlKeyword) + GET_SUMMARY_URL_PATH;
		return $http.get(url);
	}
	
	this.deletePoll = function(urlKeyword, poll) {
		var url = NOTICE_URL_BASE.replace('{urlKeyword}', urlKeyword) + DELETE_NOTICE_URL_PATH.replace('{id}', poll.noticeId);
		return $http.delete(url, null);
	}
});
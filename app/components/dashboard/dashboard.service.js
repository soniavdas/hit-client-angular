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

angular.module('hiveInTown.dashboard').service("dashboardService", function($http) {
	
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
	
	
});
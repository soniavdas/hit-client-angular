
angular.module('hiveInTown.service_request').service("serviceRequestService", function($http) {
	
	
	var SERVICEREQUEST_URL_BASE = "/HiveInTown/server/noticeboard/{urlKeyword}";
	var GET_SERVICEREQUEST_URL_PATH = '/notice/{id}';
	var GET_SERVICEREQUESTS_BY_STATUS_URL_PATH = "/notices?status="
	var GET_ALL_SERVICEREQUESTS = "/notices?status=any"
	var UPDATE_SERVICEREQUEST_URL_PATH = "/notice/{id}";
	var ADD_COMMENT_URL_PATH = "/notice/{id}/comment";
	var DELETE_COMMENT_URL_PATH = "/notice/{id}/comment/{comment-id}";
	var GET_SUMMARY_URL_PATH = "/notices/summary";    
	var DELETE_SERVICEREQUEST_URL_PATH = "/notice/{id}";
	
	this.createServiceRequest = function(serviceRequest, urlKeyword) {
		 
		 var postParam = { noticeId : serviceRequest.noticeId, 
				  		   subject: serviceRequest.subject,
				  	       details : serviceRequest.details, 
				  	       fromDate: serviceRequest.fromDate,
				  	       toDate: serviceRequest.toDate,
				  	       statusId: serviceRequest.statusId,
				  	       categoryId : serviceRequest.categoryId,
				  	       urlKeyword: urlKeyword};
				  	       
	/*		   		      		 var postParam = { serviceRequestId : serviceRequest.serviceRequestId, 
				  		   description: serviceRequest.description,
				  	       createdByUser : serviceRequest.createdByUser, 
				  	       asssignedUser: serviceRequest.assignedUser,
				  	       status: serviceRequest.status,
				  	       expectedResTime: serviceRequest.expectedResolutionTime,
				  	       createdTime : serviceRequest.createTime,
				  	       updatedTime: serviceRequest.updateTime,
				  	       comments:serviceRequest.comments,
				  	       urlKeyword: urlKeyword};*/

		 
		 if (!serviceRequest.noticeId) {
			 serviceRequest.noticeId = 0;
		 }
		 var url = SERVICEREQUEST_URL_BASE.replace('{urlKeyword}', urlKeyword) + UPDATE_SERVICEREQUEST_URL_PATH.replace('{id}', notice.noticeId);
		 return $http.post(url, postParam);
	};
	
	
	this.getServiceRequests = function(urlKeyword, status) {
		var url = SERVICEREQUEST_URL_BASE.replace('{urlKeyword}', urlKeyword);
		
		if (status) {
			url = url + GET_SERVICEREQUESTS_BY_STATUS_URL_PATH + status;
		} else {
			url = url + GET_ALL_SERVICEREQUESTS;
		}
		return $http.get(url);
	};
	
	this.countOfServiceRequests = function(urlKeyword) {
		var url = SERVICEREQUEST_URL_BASE.replace('{urlKeyword}', urlKeyword) + GET_SUMMARY_URL_PATH;
		return $http.get(url);
	}
	
	this.deleteNotice = function(urlKeyword, serviceRequest) {
		var url = SERVICEREQUEST_URL_BASE.replace('{urlKeyword}', urlKeyword) + DELETE_SERVICEREQUEST_URL_PATH.replace('{id}', serviceRequest.noticeId);
		return $http.delete(url, null);
	}
});
angular.module('hiveInTown.core').service('coreService', function($http) {
	
	var COMMUNITY_URL_BASE = "/HiveInTown/server/community/"
		
    this.getCommunityName = function(keyword) {
		return $http.get(COMMUNITY_URL_BASE + keyword);
	};

});
angular.module('hiveInTown').factory('httpResponseInterceptor',['$q', '$rootScope', 'Session', function($q, $rootScope, Session, AUTH_EVENTS){
   return {
	   'request': function(config) {

		   config.headers["HTToken"] = Session.getToken();
		   
		   return config;
	   },
	  'response': function(response) {
		  if (response.data && response.data.code ) {
			  console.log("error code: *" + response.data.code);
			  return $q.reject(response.data);
		  } else {
			  return $q.when(response);
		  }
		  return response;
	    },
	  'responseError': function (response) {
          // do something on error
		  if (response.status == 401 || response.status == 403) {
			 $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated, null);
			 return $q.reject(response);
	      }
		  $rootScope.$broadcast("ERROR", {'errorCode' : response.status, 'errorDesc' : 'server error', 'errorDetails': ''});
		  return $q.reject(response);
      	}
	}
}]);

angular.module('hiveInTown.login').factory('loginService', function($http, $q, $rootScope, $timeout, 
								$location, USER_ROLES, AUTH_EVENTS, Session, $cookies) {
	
	//var gplusClientId = '808023600922-4g49t1fr2e95snifu6hu4q9ddvcr17vr.apps.googleusercontent.com';
	
	var LOGIN_URL_BASE = '/HiveInTown/server/HTServer';
	var LOGIN_URL_PATH = LOGIN_URL_BASE + '/loginUser/';
	var SIGNUP_URL_PATH = LOGIN_URL_BASE + '/signup/';
	var RESEND_LINK_URL_PATH = LOGIN_URL_BASE + '/sendinvite/';
	var EMAIL_SETTINGS_URL_PATH = LOGIN_URL_BASE + '/settings?unsubscribe_all={1}&unsubscribe_comments={2}';
	    
	var loginAPI = {};
	loginAPI.deferred = {};
	
	loginAPI.GPLUS_CLIENT_ID = '440552030142-espjv0v8daj6r4o225n0v072r2uuiemg.apps.googleusercontent.com';
	
/*	loginAPI.init = function() {
		var deferred = $q.defer();
			window.fbAsyncInit = function() {
					FB.init({
					appId      : '1539428346317116',
					cookie     : true,  // enable cookies to allow the server to access 
										// the session
					xfbml      : true,  // parse social plugins on this page
					version    : 'v2.2' // use version 2.1
				});
				$timeout(function() {deferred.resolve(FB);}, 1000);
				
			};
		return deferred.promise;
	};*/
	
	loginAPI.isAuthenticated = function() {	
		if (Session.getUser().userId) {
			return true;
		}
		return false;
	};
	
	loginAPI.isAuthorized = function (authorizedRoles) {
	    if (!angular.isArray(authorizedRoles)) {
	      authorizedRoles = [authorizedRoles];
	    }
	    if (authorizedRoles.indexOf(USER_ROLES.any) != -1) {
	    	return true;
	    }
	    return (loginAPI.isAuthenticated() &&
	      authorizedRoles.indexOf(Session.getUser().role) != -1);
	  };
	
	loginAPI.login2 = function(loginType, urlKeyword, socialEmail, accessToken) {
			var postParam = { emailId : socialEmail, 
					  token: accessToken, 
					  loginAPI: loginType, 
					  urlKeyword: urlKeyword };
			var url = LOGIN_URL_PATH;
			return $http.post(url, postParam);
	}
	
	loginAPI.signup2 = function(loginType, urlKeyword, roleId, ecode, emailId, profileUrl, socialEmail, accessToken ) {
		
			var postParam = { emailId : emailId,
					  socialEmail : socialEmail,
					  token: accessToken, 
					  loginAPI: loginType, 
					  urlKeyword: urlKeyword,
					  ecode: ecode,
					  role: roleId,
					  profileUrl: profileUrl};
			var url = SIGNUP_URL_PATH;
			return $http.post(url, postParam);
	};
	
	loginAPI.resend = function(email, urlKeyword) {
		var url = RESEND_LINK_URL_PATH + urlKeyword + "/" + email;
		return $http.post(url, null);
	}
	
	loginAPI.deferred = {};
	
	loginAPI.logout = function() {
		if ($location.host() == 'localhost') { //do not go to social server if localhost
			logout();
		} else if (Session.getLoginChoice() == 'gplus') {
			console.log("google singout");
			var auth2 = gapi.auth2.getAuthInstance();
	    	auth2.signOut();
	    	logout();
		} else if (Session.getLoginChoice() == 'fb') {
			FB.logout(function(response) {
				console.log("FB log off");
			});
			logout();
		}
	};
	
	loginAPI.setEmailPreferences = function(unsubscribe_all, unsubscribe_comments) {
		var url = EMAIL_SETTINGS_URL_PATH.replace('{1}', unsubscribe_all).replace('{2}', unsubscribe_comments);
		return $http.post(url);
	}

	function logout() {
		Session.destroy();
		$rootScope.$broadcast(AUTH_EVENTS.logoutSuccess, null);
	}
	
	function setLoginError(sel, error) {
		console.log('Error:' + error);
		loginAPI.deferred.reject(error);
	}
    return loginAPI;
});



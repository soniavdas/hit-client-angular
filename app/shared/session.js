angular.module('hiveInTown').factory('Session', function() {
	
    var session = {};
    
    session.currentUser = {};
    session.authToken = '';
    session.profilepic='';
    session.loginChoice='';
    
	session.create = function (user, token) {
		session.currentUser = user;
		session.authToken = token;	
	};
	session.setprofileimage = function(profilepic){
		session.profilepic=profilepic;
	}
    session.getprofileimage = function () {
		return session.profilepic;    
    };
    
	session.setLoginChoice = function(loginChoice){
		session.loginChoice=loginChoice;
	}
    session.getLoginChoice = function () {
		return session.loginChoice;    
    };
    
	session.destroy = function () {
		session.currentUser = {};
		session.authToken = '';
	};
  
	session.getUser = function() {
		return session.currentUser;
	};
	
	session.getToken = function() {
		return session.authToken;
	}
	
	return session;
});
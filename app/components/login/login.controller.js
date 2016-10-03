angular.module('hiveInTown.login').controller('loginController', function($q, $scope, $rootScope, $cookies, loginService, 
								$stateParams, $state, communityName, AUTH_EVENTS, USER_ROLES, Session, $timeout) {

	var MESSAGE_NORMAL = "info";
	var MESSAGE_WARNING = "warning";
	var MESSAGE_ERROR = "error";
	    
	$scope.isLoggedIn = false;
	$scope.communityName = communityName ? communityName.data : null;
	$scope.showGplus = true;
	$scope.showFb = true; //false;
	$scope.messagetype = "info"; 
	
	//$scope.showGplus = $cookies.loginChoice ? ($cookies.loginChoice == 'gplus') : true;
	//$scope.showFb = $cookies.loginChoice ? ($cookies.loginChoice == 'fb') : true;
	$scope.showResend = false;
	
	var roleId = $stateParams.r;
	var emailId = $stateParams.e;
	var ecode = $stateParams.c;
	var communityUrlKeyword = $stateParams.communityUrlKeyword;
	var bSignUp =($state.current.name == 'default.signup');
	
	
	if (communityName) {
		$scope.welcomeText = 'Welcome to ' + $scope.communityName + ' community';
		$scope.message = 'Sign in to connect with ' + $scope.communityName + ' residential community.';
	}
	
	
	if (bSignUp) { 
		if (communityUrlKeyword && roleId && ecode) {
			if (roleId == USER_ROLES.admin) {
				$scope.message = 'You are invited to manage ' + $scope.communityName + ' community as admin. Proceed to login with your Google ID.';
				$scope.messagetype = "warning";
				$scope.showGplus = true;
				$scope.showFb = false;
			}
			else {
				$scope.message = 'You are invited to join ' + $scope.communityName  + ' residential community. Proceed to login.';
				$scope.messagetype = "info";
				$scope.showGplus = true;
				$scope.showFb = true;
			} 
		} else {
			$scope.message = 'Invalid Url. Your sign up url is invalid. Please click on the url that has been emailed to you.';
			$scope.messagetype = "error";
			$scope.showGplus = $scope.showFb = false;
		}
	} 
	
    var startGoogleSignin = function() {
    	var auth2 = gapi.auth2.getAuthInstance();
		auth2.then(onInit, onFailure);
	    function onInit() {
	    	if (auth2.isSignedIn.get()) {
	    		var googleUser = auth2.currentUser.get();
	    		if (googleUser) {
	    			var socialLogin = onGoogleLoginSuccess(googleUser);
	    			appLogin(socialLogin);
	    		}
	    	} else {
	    		console.log("not signed into google");
	    		showGplusLogin();
	    	}
	    }
	    
	    function onFailure() {
	    	showGplusLogin();
        	console.log("google login failed");
        	$scope.messagetype = "error";
        }
 	
    };
    
    function onGoogleLoginSuccess(googleUser) {
    	var socialLogin = {};
    	var profile = googleUser.getBasicProfile();
    	var authResponse = googleUser.getAuthResponse();
    	console.log("gplus login success for:" + profile.getEmail());
    	socialLogin.access_token = authResponse.id_token;
    	socialLogin.profileUrl = profile.getImageUrl();
    	socialLogin.name = profile.getName();
    	socialLogin.socialEmail = profile.getEmail();
    	socialLogin.loginType = "gplus";
    	$scope.messagetype = "info";
    	return socialLogin;
    }

    var startFbSignIn = function() {
    	FB.getLoginStatus(function(response) {
    		onFbstatusChangeCallback(response);
    	  });
    	//FB.Event.subscribe('auth.authResponseChange', onFbstatusChangeCallback);
    };
    
    function onFbstatusChangeCallback(response) {
	    console.log('fb statusChangeCallback');
	    console.log(response);
	    if (response.status === 'connected') {
	      // Logged into your app and Facebook.
	      onFbLoginSuccess(response.authResponse.accessToken);
	    } else {
	    	$scope.showFb = true;
	    }
	  };
	  
	  function onFbLoginSuccess(accessToken) {
		  var socialLogin = {};
		  FB.api('/me', {fields: 'name,email'}, function(response) {
				console.log(response);
		    	console.log("fb login success for:" + response.email);
		    	$scope.messagetype = "info";
		    	socialLogin.access_token = accessToken;
		    	//$scope.socialLogin.profileUrl = profile.getImageUrl();
		    	socialLogin.name = response.name
		    	socialLogin.socialEmail = response.email;
		    	socialLogin.loginType = "fb";
		    	var link="/" + response.id + '/picture';
		    	FB.api(link, function(response) {
		    		if (response && !response.error) {
		    			console.log("got profile url");
		    			socialLogin.profileUrl = response.data.url;
		    		}
		    		appLogin(socialLogin);
		    	});
		    	
			});
	  };
    
    // Start function in this example only renders the sign in button.
    $scope.start = function() {
    	if (!gapi.auth2) {
    		gapi.load('auth2', function() {
    			//$timeout(
    			gapi.auth2.init({client_id: loginService.GPLUS_CLIENT_ID})
    			//, 1000);
    			if ($cookies.loginChoice && !bSignUp) {
    				if ($cookies.loginChoice == 'gplus') {
    					startGoogleSignin();
    				} else if ($cookies.loginChoice == 'fb') {
    					startFbSignIn();
    				}
    			} else {
    				//$scope.showGplus = $scope.showFb = true;
    			}
    		});
    	} else {
    		//$scope.showGplus = $scope.showFb = true;
    	}
    };
    
    function showGplusLogin() {
    	//$scope.$apply(function() {
		//	$scope.showGplus = true;
		//});
    }
    
    // Call start function on load.
    $scope.start();
    
    $scope.doGoogleLogin = function() {
    	var auth2 = gapi.auth2.getAuthInstance();
    	auth2.signIn().then(function(){
    		var googleUser = auth2.currentUser.get();
    		var socialLogin = onGoogleLoginSuccess(googleUser);
    		$scope.messagetype = "info";
    		appLogin(socialLogin);
    	}, function() {
    		console.log("error signIn() in to google");
    		$scope.messagetype = "error";
    	});
    };
 
  
    
	
    $scope.doFbLogin = function() {
    	FB.login(function(response) {
    		onFbstatusChangeCallback(response);
  	  }, {scope: 'public_profile,email'});
    }
  
    
	$scope.$on(AUTH_EVENTS.loginSuccess, function(event, data) {
		//$scope.isLoggedIn = true;
		//$scope.currentUser = Session.getUser();
	});
	
	$scope.$on(AUTH_EVENTS.loginFailed, function(event, data) {
		$scope.message =  data.message;
		if (data.code == 'LOGIN_USER_NOT_FOUND' ) {
			$scope.showResend = true;
			$scope.messagetype = "error";
		} //else if (data.code == 'EMAIL_NOT_VERIFIED')
		// show resend link 
		
    });
	
	$scope.resend = function() {
		console.log("resend link");
		$state.go('^.resendLink', {'communityUrlKeyword' : communityUrlKeyword});
	}
	
	$scope.logout = function(){
		loginService.logout();
	}
	
	var appLogin = function(socialLogin) {
		console.log("app login");
		var promise;
    	if (bSignUp) {
    		promise = loginService.signup2(socialLogin.loginType, 
							communityUrlKeyword, roleId, ecode, emailId,
							socialLogin.profileUrl,
							socialLogin.socialEmail, 
							socialLogin.access_token);
    	} else {
    		promise = loginService.login2(socialLogin.loginType, 
							communityUrlKeyword, 
							socialLogin.socialEmail, 
							socialLogin.access_token);
    	}
    	promise.then(function(result) {
    		$scope.isLoggedIn = true;
			$cookies.loginChoice = socialLogin.loginType;
			Session.create(result.data, result.data.token);
			Session.setLoginChoice(socialLogin.loginType);
			Session.setprofileimage(socialLogin.profileUrl);
			$rootScope.$broadcast(AUTH_EVENTS.loginSuccess, {'communityUrlKeyword' : result.data.communityUrlKeyword});
		}, function(error) {
			console.log("login Failed:" + error);
			$scope.messagetype = "error";
			$rootScope.$broadcast(AUTH_EVENTS.loginFailed, error);
		});
	}
})

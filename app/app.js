angular.module('hiveInTown.core', []);
angular.module('hiveInTown.login', []);
angular.module('hiveInTown.noticeboard', ["ngTextTruncate"]);
angular.module('hiveInTown.discussion',[]);
angular.module('hiveInTown.dashboard',[]);
angular.module('hiveInTown.residents', []);
angular.module('hiveInTown.poll', []);
angular.module('hiveInTown.service_request', []);
angular.module('hiveInTown.serviceprovider', []);
angular.module('hiveInTown.accounts', []);
angular.module('hiveInTown.association', []);
angular.module('hiveInTown.myapt', []);
angular.module('hiveInTown.hit', []);

angular.module("hiveInTown", [
                'hiveInTown.hit',
				'hiveInTown.core',
				'hiveInTown.login',
				'hiveInTown.noticeboard',
				'hiveInTown.discussion',
				'hiveInTown.residents',
				'hiveInTown.poll',
				'hiveInTown.dashboard',
				'hiveInTown.service_request',
				'hiveInTown.serviceprovider',
				'hiveInTown.accounts',
				'hiveInTown.association',
				'hiveInTown.myapt',
				'ngRoute',
				'ngMaterial',
				'ngSanitize',
				'ngCookies',
				'ui.router',
				'ngMessages',
				'infinite-scroll',
				])
	.constant('USER_ROLES', {
			any: 'ANY',
			admin: 'ADMIN',
			office_bearer: 2,
			association_manager: 3,
			association_employee: 4,	
			resident: 'RESIDENT'
		})		
	.constant('AUTH_EVENTS', {
		notAuthorized: 'auth-not-authorized',
		loginSuccess: 'auth-login-success',
		loginFailed: 'auth-login-failed',
		logoutSuccess: 'auth-logout-success',
		notAuthenticated: 'auth-not-authenticated'
	})
	.constant('NOTICE_STATUS', {
		draft: 1,
		approved: 2,
	})
	.constant('POLL_STATUS', {
		open: 1,
		closed: 2,
	})
	.constant('SERVICEREQUEST_STATUS', {
		draft: 1,
		approved: 2,
	})
	.run(
		[ 	'$rootScope', '$state', '$stateParams', '$location', 'loginService', 'AUTH_EVENTS',
			function ($rootScope, $state, $stateParams, $location, loginService, AUTH_EVENTS) {
				
				$rootScope.$state = $state;
				$rootScope.$stateParams = $stateParams;
				
				$rootScope.$on('$stateChangeStart', 
					function(event, toState, toParams, fromState, fromParams){ 
						if (!loginService.isAuthenticated() && toState.data.authRequired) {
							console.log('DENY');
							event.preventDefault();
							$rootScope.$broadcast(AUTH_EVENTS.notAuthenticated, toParams.communityUrlKeyword);
						}
						
						if (loginService.isAuthenticated() && !loginService.isAuthorized(toState.data.authorizedRoles)) {
							console.log('AUTHORIZATION ERROR');
							event.preventDefault();
							$rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
						}
						
						if (loginService.isAuthenticated() && toState.name == 'default.login') {
							event.preventDefault();
							$rootScope.$broadcast(AUTH_EVENTS.loginSuccess, {'communityUrlKeyword' : toParams.communityUrlKeyword});
						}
					}); 
				
				$rootScope.$on('$stateChangeError', 
						function(event, toState, toParams, fromState, fromParams, error){
					console.log(error);
				});
				
				$rootScope.$on(AUTH_EVENTS.notAuthorized, function(event, data) {
					$state.go('error', 
							  {'errorCode' : '403', 'errorDesc' : 'Forbidden', 'errorDetails': 'You don\'t have permissions to access this page'}, {location:false});
				});
				$rootScope.$on(AUTH_EVENTS.notAuthenticated, function(event, data) {
					$state.go("default.login", {communityUrlKeyword : data});
				});
				$rootScope.$on(AUTH_EVENTS.loginSuccess, function(event, data) {
					$state.go('default.main.noticeboard', data);
				});
				$rootScope.$on(AUTH_EVENTS.logoutSuccess, function(event, data) {
					$state.go('default.login',  {'communityUrlKeyword' : $stateParams.communityUrlKeyword});
				});
				$rootScope.$on('ERROR', function(event, data) {
					$state.go('error', 
							{'errorCode' : data.errorCode, 'errorDesc': data.errorDesc, 'errorDetails': data.errorDetails}, 
							{location:false});
				  });
			}
		]
	)
	
	.config(['$mdThemingProvider', function($mdThemingProvider) {
		$mdThemingProvider.theme('default').primaryPalette('blue').accentPalette('amber').warnPalette('red');
		$mdThemingProvider.theme('themeadmin').primaryPalette('orange').accentPalette('amber').warnPalette('red');
		$mdThemingProvider.theme('themecom').primaryPalette('purple').accentPalette('amber').warnPalette('red');
		$mdThemingProvider.theme('themeuser').primaryPalette('light-green').accentPalette('amber').warnPalette('red');
		$mdThemingProvider.alwaysWatchTheme(true);
	}])
	.config(['$urlRouterProvider', '$stateProvider',  '$httpProvider', 'USER_ROLES', function($urlRouterProvider, $stateProvider, $httpProvider, USER_ROLES) {		
				$urlRouterProvider.otherwise('/');
		        $httpProvider.interceptors.push('httpResponseInterceptor');
		        //$httpProvider.defaults.headers.common = {'HTToken' : ''}; 
				$stateProvider
				
				.state('hit_home', {
					url:"/",
					templateUrl: 'components/hit/homepage.html',
					controller: 'hitController',
					/*resolve: {
						communities: function($http) {
							return $http.get("/HiveInTown/server/community/all");
						}
					}, */
					data : {
						authorizedRoles: [USER_ROLES.any],
						authRequired: false
					}
				})
				.state('version', {
					url:"/version",
					templateUrl: 'components/hit/version.html',
					controller: function($scope, version) {
						$scope.version = version.data;
					},
					resolve: {
						version : function($http) {
							return $http.get("/HiveInTown/server/app/version");
						}
					},
					data : {
						authorizedRoles: [USER_ROLES.any],
						authRequired: false
					}
				})
				.state('about_us', {
					url:"/aboutus",
					templateUrl: 'components/hit/hitprofile.html',
					controller: 'hitController',
					data : {
						authorizedRoles: [USER_ROLES.any],
						authRequired: false
					}
				})
				.state("error", {
					url:"/error/{errorCode}/{errorDesc}",
					templateUrl : 'components/core/error.html',
					controller : function($scope, errorCode, errorDesc) {
						console.log("error " + errorCode);
						$scope.errorCode = errorCode;
						$scope.errorDesc = errorDesc;
					},
					resolve : {
						errorCode : ['$stateParams', function($stateParams){
							  return $stateParams.errorCode;
						  }],
						  errorDesc: ['$stateParams', function($stateParams){
							  return $stateParams.errorDesc;
						  }],
					},
					data : {
						authorizedRoles: [USER_ROLES.any],
						authRequired: false
					}
				})
				.state("login", {
					url:"/login",
					templateUrl : 'components/login/login.html',
					controller: 'loginController',
					data : {
						authorizedRoles: [USER_ROLES.any],
						authRequired: false
					},
					resolve : {
						communityName : function() {
							  return null;
						  }
					}
				})
				.state("unsubscribe", {
					url:"/unsubscribe?code=&action=",
					templateUrl: 'components/core/unsubscribe.html',
					controller: function($scope, $http) {
						$scope.unsubscribe = function() {
							var url = "/HiveInTown/server/HTServer/email_preference?code=" + $stateParams.code + "&action=unsubscribe";
							$http.get(url).then(function() {
								$scope.message="You have been unsubscribed.";
							}, function() {
					    		console.log("Could not unsubscribe using this url.");
					    	});
						}
					},
					data : {
						authorizedRoles: [USER_ROLES.any],
						authRequired: false
					}
				})
				.state('default', {
					url:"/{communityUrlKeyword:string}",
					abstract:true,
					templateUrl : 'components/core/main.html',
					controller: 'mainController',
					resolve : {
						communityName : function(coreService, $stateParams) {
							  return coreService.getCommunityName($stateParams.communityUrlKeyword);
						  },
						communityUrlKeyword : function($stateParams) {
							 return $stateParams.communityUrlKeyword;
						}
					},
					data : {
						authorizedRoles: [USER_ROLES.any],
						authRequired: false
					}
					
				})
				.state('default.login', { 
						url:"",
						templateUrl : 'components/login/login.html',
						controller: 'loginController',
					})
				.state('default.resendLink', {
					url:"/resend",
					templateUrl : 'components/login/resend_link.html',
					controller: 'resendLinkController',
				})
				.state('default.signup', {
					url: "/signup?r&e&c",
					templateUrl : 'components/login/login.html',
					controller: 'loginController',
				})
				.state("default.main", { 
					url:"/main", 
					abstract: true,
					template: '<ui-view></ui-view>',
					data : {
						authRequired: true
					}
				})
				.state("default.main.manageRecords", { 
					url:"/records", 
					templateUrl : 'components/residents/list_residents.html',
					controller: 'residentController',
				})
				.state("default.main.manageRecords.upload", { 
					templateUrl : 'components/residents/upload_file.html',
					controller: 'residentController',
					data: {
						authorizedRoles: [USER_ROLES.admin],
					}
				})
				.state("default.main.serviceprovider", { 
					url:"/sp", 
					templateUrl : 'components/serviceprovider/list_sp.html',
					controller: 'serviceproviderController',
				})
				.state("default.main.serviceprovider.upload", { 
					templateUrl : 'components/serviceprovider/upload_file.html',
					controller: 'serviceproviderController',
					data: {
						authorizedRoles: [USER_ROLES.admin],
					}
				})
				.state("default.main.noticeboard", { 
					url:"/nb",
					templateUrl : 'components/noticeboard/noticeboard.html',
					controller: 'noticeBoardController'
				})
				.state("default.main.noticeboard.add", { 
					templateUrl : 'components/noticeboard/add_notice.html',
					controller: 'noticeBoardController'
				})
				.state("default.main.discussion", { 
					url:"/disc",
					templateUrl : 'components/discussion/discussion.html',
					controller: 'noticeBoardController'
				})
				.state("default.main.discussion.add", { 
					templateUrl : 'components/discussion/add_discussion.html',
					controller: 'noticeBoardController'
				})
				.state("default.main.dashboard", { 
					url:"/db",
					templateUrl : 'components/dashboard/dashboard.html',
					controller: function() {},
				})
				.state("default.main.servicerequest", { 
					url:"/sr", 
					templateUrl : 'components/service_request/service_request.html',
					controller: 'serviceRequestController'
				})
				.state("default.main.servicerequest.add", { 
					templateUrl : 'components/service_request/add_servicerequest.html',
					controller: 'serviceRequestController'
				})
				.state("default.main.poll", { 
					url:"/poll", 
					templateUrl : 'components/poll/poll.html',
					controller: 'pollController'
				})
				.state("default.main.poll.add", { 
					templateUrl : 'components/poll/add_poll.html',
					controller: 'pollController'
				})
				.state("default.main.myApartment", { 
					url:"/ma", 
					templateUrl : 'components/myapartment/myapt.html',
					controller: 'myaptController'
				})
				.state("default.main.myApartment.add", { 
					templateUrl : 'components/myapartment/add_familymem.html',
					controller: 'myaptController'
				})

				.state("default.main.accounts", { 
					url:"/acc", 
					templateUrl : 'components/accounts/accounts.html',
					controller: 'accountsController'
				})
				.state("default.main.association", { 
					url:"/as", 
					templateUrl : 'components/association/association.html',
					controller: 'associationController'
				});
				
				
		}]);
		

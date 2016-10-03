angular.module('hiveInTown.core').controller("mainController", function($scope, $mdSidenav,$mdDialog, menuService, $timeout,  
		$stateParams, $state, AUTH_EVENTS, loginService, communityName, Session, $mdComponentRegistry) {
	
  var allmenus = [];
  
  $scope.isLoggedIn = loginService.isAuthenticated();
  $scope.selected = null;
  $scope.menus = allmenus;
  $scope.currentUser = Session.getUser();
  $scope.profilepic = Session.getprofileimage();

  $scope.communityName = communityName.data;
  $scope.selection = "0";
  $scope.showOptions = true;
  $scope.toggle = angular.noop;
  $scope.isOpen = function() { return true };
  $scope.menuselected="Residents";
  $scope.theme="default";
  
  $scope.$watch('selection', function(newVal, oldVal){
	console.log("newval:" + newVal);
    switch(newVal){
        case '0':
           // [do Some Stuff]
            break;
        case '2':
            loginService.logout();
            break;
        default:
            //[well, do some stuff]
            break;
    }
  });
	
	loadmenus();
  //*******************
  // Internal Methods
  //*******************
  function loadmenus() {
    menuService.loadAll()
      .then(function(menus){
    	  allmenus = menus;
    	  $scope.menus = [].concat(menus);
        
	      $scope.selected = $scope.menus[0];
	      setSelectionByState($state.current.name);
       
      });
  }
  
  $scope.toggleLeft = function() {
    $mdSidenav('left').toggle().then(function(){
        console.log("toggle left is done");
    });
  };
  
     	$scope.showcontact = function(ev) {
		$mdDialog.show({
			controller: ContactsController,
			templateUrl: 'components/core/view_contacts.html',
			parent: angular.element(document.body),
		    targetEvent: ev
		}) .then(function(answer) {
		     // $scope.alert = 'You said the information was "' + answer + '".';
	    }, function(e) {
	    	console.log(e);
	    });
	};

   	$scope.showprofile = function(ev) {
		$mdDialog.show({
			controller: ProfileController,
			templateUrl: 'components/login/view_profile.html',
			parent: angular.element(document.body),
		    targetEvent: ev
		}) .then(function(answer) {
		     // $scope.alert = 'You said the information was "' + answer + '".';
	    }, function(e) {
	    	console.log(e);
	    });
	};

  
  $scope.selectMenu = function(menu) {
	  $scope.selected = angular.isNumber(menu) ? $scope.menus[menu] : menu;
	  //$scope.theme= $scope.selected.theme;
	 // $scope.menuselected= $scope.selected.name;
	  $state.go('^.' + $scope.selected.state);
  };
  
  $scope.$on('$stateChangeSuccess', function(event, toState) {
	  setSelectionByState(toState.name)
  });
  
  $scope.$on(AUTH_EVENTS.loginSuccess, function(event, data) {
	  $mdSidenav('left').open().then(function(){
	        console.log("left nav is open");
	    });
	  $scope.isLoggedIn = true;
	  $scope.currentUser = Session.getUser();
	  $scope.profilepic = Session.getprofileimage();
  });
  
  $scope.$on(AUTH_EVENTS.logoutSuccess, function(event, data) {
	  $mdSidenav('left').close();
	  $scope.isLoggedIn = false;
	  $scope.currentUser = Session.getUser();
	  $scope.profilepic = Session.getprofileimage();

  });
  
  function setSelectionByState(stateName) {
	  for(var i = 0; i < $scope.menus.length; i++) {
      	var name = 'default.main.' + $scope.menus[i].state;
      	if (name == stateName) {
      		 $scope.selected  = $scope.menus[i];
      		 $scope.theme= $scope.selected.theme;
      		 $scope.menuselected= $scope.selected.name;
      		break;
      	}
      }
  }
  
});

function ProfileController($scope, $mdDialog, Session, loginService) {
	  var UNSUBSCRIBE_ALL = "0";
	  var UNSUBSCRIBE_COMMENTS = "1";
	  $scope.currentUser = Session.getUser();
	  $scope.profilepic = Session.getprofileimage();
	  $scope.unsubscribedComments = Session.getUser().unsubscribedComments;
	  $scope.unsubscribedAll = Session.getUser().unsubscribedAll;
	  
	  $scope.close = function() {
	    $mdDialog.hide();
	  };
	  $scope.logout = function() {
		  $mdDialog.hide();
		  loginService.logout();
	  };
	  
	  $scope.toggleAll = function() {
		  $scope.unsubscribedAll = !$scope.unsubscribedAll;
		  Session.getUser().unsubscribedAll = $scope.unsubscribedAll;
		  loginService.setEmailPreferences($scope.unsubscribedAll, $scope.unsubscribedComments).then(function() {});
	  }
	  
	  $scope.toggleComments = function() {
		  $scope.unsubscribedComments = !$scope.unsubscribedComments;
		  Session.getUser().unsubscribedComments = $scope.unsubscribedComments;
		  loginService.setEmailPreferences($scope.unsubscribedAll, $scope.unsubscribedComments).then(function() {});
	  }
}

function ContactsController($scope, $mdDialog,Session) {
 

    var imagePath = 'img/finance.png';
     $scope.contacts = [
      {
        face : 'img/finance.png',
        name: 'Sanjay',
        role: 'Facility',
        contact: '9999999999'
      },
      {
       face : imagePath,
        name: 'Sanjay',
        role: 'President',
        contact: '9999999999'

      },
      {
        face : imagePath,
        name: 'Sanjay',
        role: 'Secretary',
        contact: '9999999999'
      },
      {
       face : imagePath,
        name: 'Sanjay',
        role: 'Security',
        contact: '9999999999'
      }
    ];
      $scope.close = function() {
    $mdDialog.hide();
  };
  

};






angular.module('hiveInTown').directive('loadingSign', function($rootScope, $mdToast) {
  return {
    restrict: 'A',
    
    link: function(scope, elem, attrs) {
      scope.isStateLoading = false;
 
      $rootScope.$on('$stateChangeStart', function() {
        scope.isStateLoading = true;
        $mdToast.show($mdToast.simple().content("Loading...."));
      });
      $rootScope.$on('$stateChangeSuccess', function() {
        scope.isStateLoading = false;
        $mdToast.hide();
      });
    }
  };
});
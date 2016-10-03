
/*angular.module('hiveInTown.residents').directive("residentList", function() {

	 return {
	        restrict: 'A',
	        scope:  false,
	        controller: function($scope) {
	        	$scope.rowList = [];
	        
	        	this.addRow = function(row) {
	        		$scope.rowList.push(row);
	        	};
	        	
	        	this.removeEditElement = function() {
	        		angular.forEach($scope.rowList, function(row) {
	        			row.find('resident-edit').remove();	
	        			console.log("row: " + row.scope().$index + " " +row.scope().showEdit);
	        			//row.scope().showEdit = false;
	        		});
	        	};
	        	
	        	
	        }
	    };
}); */

angular.module('hiveInTown.residents').directive("residentRow", function($http, $compile) {

	 return {
	        restrict: 'E',
	        transclude: true,
	        scope: {
	            user: '='
	        },
	        //require: '^residentList',
	        templateUrl: 'components/residents/resident_row.html',
	        controller: function($scope) {
	        	
	        	$scope.edit = function(user) {
	        		//var tpl = '<resident-edit></resident-edit>';
	        		//$scope.removeEdit();
	        	};
	        	
	        	$scope.view = function(user) {
	        		
	        	}
	        },
	        /*link: function(scope, elem, attrs, residentListCtrl) {
	        	residentListCtrl.addRow(elem);
	        	scope.removeEdit = residentListCtrl.removeEditElement;
	        	scope.showEdit = false;
	        	
	        	var tpl = '<resident-edit></resident-edit>';
	        	 elem.on("click", function() {
	                 scope.$apply(function() {
	                	 scope.removeEdit();
	                	 elem.append($compile(tpl)(scope));
	                	 // $http.get(tpl)
	                     //.then(function(response){
	                     //  elem.append($compile(response.data)(scope));
	                     //});
	                });
	        	 });
	        },*/
	       
	    };
});

/*angular.module('hiveInTown.residents').directive("residentEdit", function() {
	return {
        restrict: 'E',
        //require : '^residentRow',
        scope: false,
        controller: 'addResidentController',
        templateUrl: 'components/residents/add_resident.html',
    };
}); */

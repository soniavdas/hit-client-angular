angular.module('hiveInTown')
    .filter("sanitize", ['$sce', function($sce) {
        return function(htmlCode){
            return $sce.trustAsHtml(htmlCode);
        }
}]);


angular.module('hiveInTown')
.filter("truncate", function() {
     return function(trustedTextHolder, limit){
    	var t =  trustedTextHolder.toString();
    	if (limit > 3 && t.length > limit) {
    		return t.substring(0, limit - 3) + "...";
    	} else {
    		return t.substring(0, limit);
    	}
    }
});
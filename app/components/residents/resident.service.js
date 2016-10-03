angular.module('hiveInTown.residents').service("residentService", function($http, $q) {
	
	var CREATE_USER_URL_PATH = "/HiveInTown/server/HTServer/updateResidentDetail";
	var UPLOAD_URL_PATH = '/HiveInTown/server/file/upload/';
	var COMMUNITY_URL_BASE = "/HiveInTown/server/community/"
	var LIST_RESIDENTS_URL_PATH = "/residents";
	var COUNT_RESIDENTS_URL_PATH = "/residents/count";
	var GET_RESIDENT_URL_PATH = "/resident/";
	var SAVE_RESIDENT_URL_PATH = "/resident";
	var SEND_LINK_URL_PATH = "/HiveInTown/server/HTServer/sendinvites/{urlKeyword}";
	var REMOVE_USER_URL_PATH = "/HiveInTown/server/HTServer/removeuser/{urlKeyword}/{id}";
	
	var SERVER_QUERY_LIMIT = 500;
	var NUM_PER_PAGE = 30;
	
	this.saveUser = function(user, urlKeyword, customMessage) {
		var postParam = { residentDetails : user, 
						  customMessage : customMessage }; 
		var url = COMMUNITY_URL_BASE + urlKeyword + SAVE_RESIDENT_URL_PATH;
		console.log("saving resident:" + user.userId);
		if (!user.userId) {
			user.userId = 0;
		}
		return $http.post(url, postParam);
	};
	
	this.getUser = function(userId, urlKeyword) {
		var url = COMMUNITY_URL_BASE + urlKeyword + GET_RESIDENT_URL_PATH + userId;
		return $http.get(url);
	}
	
	this.upload = function(file, urlkeyword){
        var fd = new FormData();
        fd.append('file', file);	
        fd.append('urlkeyword', urlkeyword);
        $http.defaults.headers.post['Content-Type'] = 'multipart/form-data';
        
        var url = UPLOAD_URL_PATH + urlkeyword;
        return $http.post(url, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
       
    };
		
	this.sendInvites = function(urlKeyword) {
		var url = SEND_LINK_URL_PATH.replace('{urlKeyword}', urlKeyword);
		return $http.post(url, null);
	}
	
	this.removeUser = function(urlKeyword, user) {
		var url = REMOVE_USER_URL_PATH.replace('{urlKeyword}', urlKeyword).replace('{id}', user.userId);
		return $http.post(url, null);
	}
	
	this.getMembers = function(urlKeyword, pageIndex, pageLimit) {
		var url = COMMUNITY_URL_BASE + urlKeyword + LIST_RESIDENTS_URL_PATH + "?page=" + pageIndex + "&limit=" + pageLimit;
		return $http.get(url);
		//return this.getMembers2();
	};
	
	this.countOfResidents = function(urlKeyword) {
		return $http.get(COMMUNITY_URL_BASE + urlKeyword + COUNT_RESIDENTS_URL_PATH);
	};
	
	this.getMembers2 = function(id) {
		var promise = $q.defer();
			promise.resolve([		
				{
					email:'hiveintown@gmail.com',
					displayName:'Padma MR',
					role:'ADMIN',
					apartmentNum: '5011',
					isVerified:true
				},
				{
					email:'appusree@gmail.com',
					displayName:'Aparna P',
					role:'RESIDENT',
					apartmentNum: '2013',
					isVerified:true
				},
				{
					email:'soniavdas@gmail.com',
					displayName:'Sonia Sharma',
					role:'resident',
					apartmentNum: '2189',
					isVerified:true
				},
				{
					email:'chetana@yahoo.com',
					displayName:'Chetana',
					role:'ADMIN',
					apartmentNum: '9175',
					isVerified:false
				},
			
				{
					email:'rekhak@gmail.com',
					displayName:'Rekha',
					lastName:'K',
					role:'ADMIN',
					apartmentNum: '1201',
					isVerified:true
				},
				{
					email:'sriraj@gmail.com',
					displayName:'Sriraj',
					lastdisplayName:'P',
					role:'RESIDENT',
					apartmentNum: '1201',
					isVerified:true
				},
				{
					email:'soniavdas@gmail.com',
					displayName:'Sonia',
					role:'RESIDENT',
					apartmentNum: '5678',
					isVerified:true
				},
				{
					email:'Maria@yahoo.com',
					displayName:'Maria',
					role:'ADMIN',
					apartmentNum: '3190',
					isVerified:false
				},
				{
					email:'Mary@yahoo.com',
					displayName:'Tanya',
					role:'ADMIN',
					apartmentNum: '2235',
					isVerified:false
				},
				{
					email:'asma@yahoo.com',
					displayName:'Asma S',
					role:'ADMIN',
					apartmentNum: '1056',
					isVerified:false
				},
				{
					email:'hiveintown@gmail.com',
					displayName:'Padma MR 2',
					role:'ADMIN',
					apartmentNum: '5011',
					isVerified:true
				},
				{
					email:'appusree@gmail.com',
					displayName:'Aparna P 2',
					role:'RESIDENT',
					apartmentNum: '2013',
					isVerified:true
				},
				{
					email:'soniavdas@gmail.com',
					displayName:'Sonia Sharma 2',
					role:'RESIDENT',
					apartmentNum: '2189',
					isVerified:true
				},
				{
					email:'chetana@yahoo.com',
					displayName:'Chetana 2',
					role:'ADMIN',
					apartmentNum: '9175',
					isVerified:false
				},
			
				{
					email:'rekhak@gmail.com',
					displayName:'Rekha 2',
					lastdisplayName:'K',
					role:'ADMIN',
					apartmentNum: '1201',
					isVerified:true
				},
				{
					email:'sriraj@gmail.com',
					displayName:'Sriraj 2',
					lastdisplayName:'P',
					role:'RESIDENT',
					apartmentNum: '1201',
					isVerified:true
				},
				{
					email:'soniavdas@gmail.com',
					displayName:'Sonia 2',
					role:'RESIDENT',
					apartmentNum: '5678',
					isVerified:true
				},
				{
					email:'Maria@yahoo.com',
					displayName:'Maria 2',
					role:'ADMIN',
					apartmentNum: '3190',
					isVerified:false
				},
				{
					email:'Mary@yahoo.com',
					displayName:'Tanya 2',
					role:'ADMIN',
					apartmentNum: '2235',
					isVerified:false
				},
				{
					email:'asma@yahoo.com',
					displayName:'Asma S 2',
					role:'ADMIN',
					apartmentNum: '1056',
					isVerified:false
				},
				{
					email:'hiveintown@gmail.com',
					displayName:'Padma MR 3',
					role:'ADMIN',
					apartmentNum: '5011',
					isVerified:true
				},
				{
					email:'appusree@gmail.com',
					displayName:'Aparna P 3',
					role:'RESIDENT',
					apartmentNum: '2013',
					isVerified:true
				},
				{
					email:'soniavdas@gmail.com',
					displayName:'Sonia Sharma 3',
					role:'RESIDENT',
					apartmentNum: '2189',
					isVerified:true
				},
				{
					email:'chetana@yahoo.com',
					displayName:'Chetana 3',
					role:'ADMIN',
					apartmentNum: '9175',
					isVerified:false
				},
			
				{
					email:'rekhak@gmail.com',
					displayName:'Rekha3',
					lastdisplayName:'K',
					role:'ADMIN',
					apartmentNum: '1201',
					isVerified:true
				},
				{
					email:'sriraj@gmail.com',
					displayName:'Sriraj3',
					lastdisplayName:'P',
					role:'RESIDENT',
					apartmentNum: '1201',
					isVerified:true
				},
				{
					email:'soniavdas@gmail.com',
					displayName:'Sonia3',
					role:'RESIDENT',
					apartmentNum: '5678',
					isVerified:true
				},
				{
					email:'Maria@yahoo.com',
					displayName:'Maria3',
					role:'RESIDENT',
					apartmentNum: '3190',
					isVerified:false
				},
				{
					email:'Mary@yahoo.com',
					displayName:'Tanya3',
					role:'ADMIN',
					apartmentNum: '2235',
					isVerified:false
				},
				{
					email:'asma@yahoo.com',
					displayName:'Asma S3',
					role:'ADMIN',
					apartmentNum: '1056',
					isVerified:false
				},
				{
					email:'hiveintown@gmail.com',
					displayName:'Padma MR4',
					role:'ADMIN',
					apartmentNum: '5011',
					isVerified:true
				},
				{
					email:'appusree@gmail.com',
					displayName:'Aparna P4',
					role:'RESIDENT',
					apartmentNum: '2013',
					isVerified:true
				},
				{
					email:'soniavdas@gmail.com',
					displayName:'Sonia Sharma4',
					role:'RESIDENT',
					apartmentNum: '2189',
					isVerified:true
				},
				{
					email:'chetana@yahoo.com',
					displayName:'Chetana4',
					role:'ADMIN',
					apartmentNum: '9175',
					isVerified:false
				},
			
				{
					email:'rekhak@gmail.com',
					displayName:'Rekha4',
					lastdisplayName:'K',
					role:'ADMIN',
					apartmentNum: '1201',
					isVerified:true
				},
				{
					email:'sriraj@gmail.com',
					displayName:'Sriraj4',
					lastdisplayName:'P',
					role:'RESIDENT',
					apartmentNum: '1201',
					isVerified:true
				},
				{
					email:'soniavdas@gmail.com',
					displayName:'Sonia4',
					role:'RESIDENT',
					apartmentNum: '5678',
					isVerified:true
				},
				{
					email:'Maria@yahoo.com',
					displayName:'Maria4',
					role:'ADMIN',
					apartmentNum: '3190',
					isVerified:false
				},
				{
					email:'Mary@yahoo.com',
					displayName:'Tanya4',
					role:'ADMIN',
					apartmentNum: '2235',
					isVerified:false
				},
				{
					email:'asma@yahoo.com',
					displayName:'Asma S4',
					role:'ADMIN',
					apartmentNum: '1056',
					isVerified:false
				},
		] );
			return promise.promise;
		//}
	};

});
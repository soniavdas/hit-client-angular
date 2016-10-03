angular.module('hiveInTown.core').service('menuService', ['$q', function($q) {

  var menus = [{
      name: 'Dashboard',
      disable:'true',
      state: 'dashboard',
      update:'false',
      icon_color:'green',
      icon_type:'dashboard',
      num:'0',
	  divider:'false',
	  headerreq:'false',
      headername:'ManageRecords',
      theme:'themeuser'
   },{
      name: 'Residents',
      disable:'false',
      state:'manageRecords',
      update:'false',
      icon_color:'blue',
      icon_type:'people',
      num:'0',
      divider:'false',
      headerreq:'false',
      headername:'Manage Records',
      theme:'default'
   },/*{
      name: 'ServiceProvider',
      disable:'true',
      state:'serviceprovider',
      update:'false',
      icon_color:'blue',
      icon_type:'face',
      num:'0',
      divider:'false',
      headerreq:'false',
      headername:'ManageRecords',
      theme:'default'
   }, */{
      name: 'NoticeBoard',
      disable:'false',
      state:'noticeboard',
      update:'false',
      icon_color:'purple',
      icon_type:'announcement',
      num:'2',
	  divider:'false',
	  headerreq:'false',
      headername:'Communication',
      theme:'themecom'
   },/*{
      name: 'Discussion',
      disable:'false',
      state:'discussion',
      update:'false',
      icon_color:'purple',
      icon_type:'chat_bubble_outline',
      num:'2',
	  divider:'false',
	  headerreq:'false',
      headername:'Communication',
      theme:'themecom'
   }, {
      name: 'Poll',
      disable:'true',
      state: 'poll',
      update:'false',
      icon_color:'purple',
      icon_type:'poll',
      num:'1',
	  divider:'false',
	  headerreq:'false',
      headername:'ManageRecords',
      theme:'themecom'
   }, {
      name: 'ServiceRequest',
      disable:'true',
      state: 'servicerequest',
      update:'false',
      icon_color:'purple',
      icon_type:'report_problem',
      num:'3',
	  divider:'false',
	  headerreq:'false',
      headername:'ManageRecords',
      theme:'themecom'
   }, {
      name: 'MyApartment',
      disable:'true',
      state:'myApartment',
      update:'false',
      icon_color:'green',
      icon_type:'home',
      num:'0',
	  divider:'false',
	  headerreq:'false',
      headername:'MyDetails',
      theme:'themeuser'
   },{
      name: 'Visitors',
      disable:'true',
      state:'myApartment',
      update:'false',
      icon_color:'green',
      icon_type:'card_travel',
      num:'0',
	  divider:'false',
	  headerreq:'false',
      headername:'ManageRecords',
      theme:'themeuser'
   },{
      name: 'Accounts',
      disable:'true',
      state: 'accounts',
      update:'false',
      icon_color:'orange',
      icon_type:'account_balance',
      num:'3',
	  divider:'false',
	  headerreq:'false',
      headername:'Admin Desk',
      theme:'themeadmin'
   },{
      name: 'Association',
      disable:'true',
      state: 'association',
      update:'false',
      icon_color:'orange',
      icon_type:'people_outline',
      num:'2',
	  divider:'false',
	  headerreq:'false',
      headername:'ManageRecords',
      theme:'themeadmin'
   },{
      name: 'Settings',
      disable:'true',
      state: 'settings',
      update:'false',
      icon_color:'orange',
      icon_type:'settings',
      num:'2',
	  divider:'false',
	  headerreq:'false',
      headername:'ManageRecords',
      theme:'themeadmin'
   }*/];

  // Promise-based API
  return {
      loadAll: function() {
          // Simulate async nature of real remote calls
          return $q.when(menus);
      }
  };
}]); 

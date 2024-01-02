/* Solutions Factory
======================================================================================
======================================================================================
*/

scsFamilyApp.factory('scsFamilyData', function($http){
	return {
		getHeroData: function(){
	    	return $http.get("siteUrl/_api/web/lists/getByTitle('Lst_Intro-Section')/items?$select=*", { 
				headers: { "Accept": "application/json;odata=verbose" }
			})
			.then(function(response) {
				return response.data;
			});
		},
		getMyGroupsData: function(){
	    	return $http.get("siteUrl/_api/web/lists/getByTitle('My-Groups')/items?$select=*", { 
				headers: { "Accept": "application/json;odata=verbose" }
			})
			.then(function(response) {
				return response.data;
			});
		},
		getResourcesQuickLinksData: function(){
	    	return $http.get("siteUrl/_api/web/lists/getByTitle('Lst_ResourceQuickListMenu')/items?$select=*", { 
				headers: { "Accept": "application/json;odata=verbose" }
			})
			.then(function(response) {
				return response.data;
			});
		},
		getTemplateData: function(pageName){
			return $http.get("siteUrl/_api/web/lists/getByTitle('Lst_Family-Template-Pages')/items?$filter=URL_x002d_Name eq'" + pageName + "'", { 
				headers: {"Accept": "application/json;odata=verbose"}}).then(function(response){
				return response.data;
			});
			
		},
		getAboutSCSData: function(){
			return $http.get("siteUrl/_api/web/lists/getByTitle('Lst_AboutSCS-section')/items?$select=*", {
				headers: {"Accept": "application/json;odata=verbose"}}).then(function(response){
				return response.data;
			});
		},
		getSecondaryTemplateData: function(){
			return $http.get("siteUrl/_api/web/lists/getByTitle('Lst_Family-Secondary-Template-Pages')/items?$select=*", {
				headers: {"Accept": "application/json;odata=verbose"}}).then(function(response){
				return response.data;
			});
		},
		getQuickLinksData: function(){
	    	return $http.get("siteUrl/_api/web/lists/getByTitle('Lst_QuickLinks')/items?$select=*", { 
				headers: { "Accept": "application/json;odata=verbose" }
			})
			.then(function(response) {
				return response.data;
			});
		},
		getServicesData: function(){
			return $http.get("https://eygb.sharepoint.com/sites/supplychainservices/_api/web/lists/getByTitle('Our Services')/items?$select=*", { 
				headers: { "Accept": "application/json;odata=verbose" }
			})
			.then(function(response) {
				return response.data;
			});
		},
		getSCSExperienceData: function(){
	    	return $http.get("siteUrl/_api/web/lists/getByTitle('SCS_Family-Experience')/items?$select=*", { 
				headers: { "Accept": "application/json;odata=verbose" }
			})
			.then(function(response) {
				return response.data;
			});
		},
		getSCSExperienceLinksData: function(){
	    	return $http.get("siteUrl/_api/web/lists/getByTitle('SCS_Family-Experience-Links')/items?$select=*", { 
				headers: { "Accept": "application/json;odata=verbose" }
			})
			.then(function(response) {
				return response.data;
			});
		},
		getCalendarData: function(){
	    	return $http.get("siteUrl/_api/web/lists/getByTitle('Events-Calendar')/items?$select=*", { 
				headers: { "Accept": "application/json;odata=verbose" }
			})
			.then(function(response) {
				return response.data;
			});
		},
		getSiteUsersData: function(){
	    	return $http.get("https://eygb.sharepoint.com/sites/supplychainservices/_api/web/siteusers?", { 
				headers: { "Accept": "application/json;odata=verbose" }
			})
			.then(function(response) {
				return response.data;
			});
		},
		getLeadershipTeamData: function(){
	    	return $http.get("https://eygb.sharepoint.com/sites/supplychainservices/_api/web/lists/getByTitle('ProcurementTeam')/items?$select=*", { 
				headers: { "Accept": "application/json;odata=verbose" }
			})
			.then(function(response) {
				return response.data;
			});
		},
		getTeamData: function(){
	    	return $http.get("https://eygb.sharepoint.com/sites/supplychainservices/_api/web/lists/getByTitle('Team')/items?$select=*", { 
				headers: { "Accept": "application/json;odata=verbose" }
			})
			.then(function(response) {
				return response.data;
			});
		},
		getTeamDataInd: function(teamName){
	    	return $http.get("https://eygb.sharepoint.com/sites/supplychainservices/_api/web/lists/getByTitle('Team')/items?$filter=Title eq'" + teamName + "'", { 
				headers: { "Accept": "application/json;odata=verbose" }
			})
			.then(function(response) {
				return response.data;
			});
		},
		getKnowledgeCenterData: function(){
	    	return $http.get("siteUrl/_api/web/lists/getByTitle('Lst_Family-Knowledge-Center')/items?$select=*", { 
				headers: { "Accept": "application/json;odata=verbose" }
			})
			.then(function(response) {
				return response.data;
			});
		},
		getGroupUsersData: function(){
			return $http.get(_spPageContextInfo.webAbsoluteUrl + "/_api/web/sitegroups/getbyname('Engagement & Messaging Leads')/users", {
				headers: {"Accept": "application/json;odata=verbose"}
			})
			.then(function(response){
				return response.data
			});
		},
		getSubscriptionData: function(email){
			return $http.get("siteUrl/_api/web/lists/getByTitle('Lst_Subscriptions')/items?$filter=Email eq'" + email + "'", {
				headers: {"Accept": "application/json;odata=verbose"}
			})
			.then(function(response){
				return response.data
			});
		}
	}
	
});
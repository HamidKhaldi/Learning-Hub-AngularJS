/* SCS Family Article Factory
======================================================================================
======================================================================================
*/

scsFamilyApp.factory('articleData', function($http, $q){
	return {
		getTopStoriesData: function(){
	    	return $http.get("siteUrl/_api/web/lists/getByTitle('Lst_Top-Stories')/items?$select=*", { 
				headers: { "Accept": "application/json;odata=verbose" }
			})
			.then(function(response) {
				return response.data;
			});
		},
		getDidYouKnowData: function(){
	    	return $http.get("siteUrl/_api/web/lists/getByTitle('Lst_My-News')/items?$select=*", { 
				headers: { "Accept": "application/json;odata=verbose" }
			})
			.then(function(response) {
				return response.data;
			});
		},
		getCelebrationData: function(){
	    	return $http.get("siteUrl/_api/web/lists/getByTitle('Lst_Kudos-Celebrations')/items?$select=*", { 
				headers: { "Accept": "application/json;odata=verbose" }
			})
			.then(function(response) {
				return response.data;
			});
		},
		getNewsData: function(){
	    	return $http.get("siteUrl/_api/web/lists/getByTitle('Lst_Team-Update')/items?$select=*", { 
				headers: { "Accept": "application/json;odata=verbose" }
			})
			.then(function(response) {
				return response.data;
			});
		},
		getHeadlineData: function(){
	    	return $http.get("siteUrl/_api/web/lists/getByTitle('Lst_Headlines')/items?$select=*", { 
				headers: { "Accept": "application/json;odata=verbose" }
			})
			.then(function(response) {
				return response.data;
			});
		},
		getNewsletterData: function(){
	    	return $http.get("siteUrl/_api/web/lists/getByTitle('Newsletter')/items?$select=*", { 
				headers: { "Accept": "application/json;odata=verbose" }
			})
			.then(function(response) {
				return response.data;
			});
		},
		getKeywordData: function(){
	    	return $http.get("siteUrl/_api/web/lists/getByTitle('Lst_Keywords')/items?$select=*", { 
				headers: { "Accept": "application/json;odata=verbose" }
			})
			.then(function(response) {
				return response.data;
			});
		},
		getHeadlineDataTags: function(){
	    	return $http.get("siteUrl/_api/web/lists/getByTitle('Lst_Data-Tags')/items?$select=*", { 
				headers: { "Accept": "application/json;odata=verbose" }
			})
			.then(function(response) {
				return response.data;
			});
		},
		getMyNewsDataTags: function(){
	    	return $http.get("siteUrl/_api/web/lists/getByTitle('Lst_My-News-Data-Tags')/items?$select=*", { 
				headers: { "Accept": "application/json;odata=verbose" }
			})
			.then(function(response) {
				return response.data;
			});
		},
		getUpdatesDataTags: function(){
	    	return $http.get("siteUrl/_api/web/lists/getByTitle('Lst_Updates-Data-Tags')/items?$select=*", { 
				headers: { "Accept": "application/json;odata=verbose" }
			})
			.then(function(response) {
				return response.data;
			});
		},
		getKudosDataTags: function(){
	    	return $http.get("siteUrl/_api/web/lists/getByTitle('Lst_Kudos-Data-Tags')/items?$select=*", { 
				headers: { "Accept": "application/json;odata=verbose" }
			})
			.then(function(response) {
				return response.data;
			});
		},
		// Get multiple choice options of field/column in list
		getChoiceFieldValues: function(listName, fieldName){
            
            var deferred = $q.defer();

            $http({
            method: 'GET',
            url:"siteUrl/_api/web/lists/GetByTitle('" + listName + "')/fields?$filter=EntityPropertyName eq '" + fieldName + "'",
            headers: {
                "Accept": "application/json;odata=verbose"
            }
            })
            .then(function success(response){
                //console.log('response ', response);
                response.data.d.results[0] ? deferred.resolve(response.data.d.results[0].Choices.results) : deferred.resolve([]);
            }
            ,function error(error, status){
                deferred.reject(error);
                
            });
            // .catch(error => console.log(error.message));
            
            return deferred.promise;
        },
		getAttachmentsData: function(){
			return $http.get("siteUrl/_api/web/lists/getByTitle('Lst_Attachments')/items?$select=*", { 
				headers: { "Accept": "application/json;odata=verbose" }
			})
			.then(function(response) {
				return response.data;
			});
		},
		getPersonalisedData: function(){
			return $http.get("siteUrl/_api/web/lists/getByTitle('Lst_Personalized-News')/items?$select=*", { 
				headers: { "Accept": "application/json;odata=verbose" }
			})
			.then(function(response) {
				return response.data;
			});
		},
		getComments: function() {
			return $http.get("siteUrl/_api/web/lists/getByTitle('Lst_comments')/items?$top=5000", {
				headers: { "Accept": "application/json;odata=verbose" }
			})
			.then(function(response) {
				return response.data;
			});
		}

	}
	
});
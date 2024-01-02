/* Experience Controller
====================================================================================================
==================================================================================================*/

scsFamilyApp.controller('experienceCtrl', function (scsFamilyData, articleData, $scope, $sce, $http, $state, $stateParams, $localStorage, $window, $filter, $timeout, $q) {
    'use strict';
  
    $window.scrollTo(0, 0);
    $scope.$sce = $sce;
   
    $scope.pageURLName = $stateParams.pageURLName;
    $scope.userDetails = $localStorage.userDetails;
    $scope.showLink = $scope.userDetails.userInGroup;

    scsFamilyData.getTemplateData('scs-experience').then(function(data){
        //$scope.selectedPage = $filter('filter')(data.d.results, {URL_x002d_Name: 'scs-experience' }, true)[0];
        angular.forEach(data.d.results, function(value, key){
            if(value.URL_x002d_Name === 'scs-experience'){
                $scope.selectedPage = value;
            }
        });
        //console.log("selectedPage new:: ", $scope.selectedPage.Experience_x002d_CardsId);

        scsFamilyData.getSCSExperienceData().then(function(data){
            //console.log('getSCSExperienceData ', data.d.results);
            $scope.experienceArr = data.d.results;
    
            scsFamilyData.getSCSExperienceLinksData().then(function(data){
                //console.log('experience links ', data.d.results);
                $scope.experienceLinksArr = data.d.results;
                $scope.experienceArr.forEach(function(value, key){
                    let experienceValue = value;
                    experienceValue.linkDetailsArr = [];
                    if(experienceValue.Experience_x002d_LinksId){
                        angular.forEach(experienceValue.Experience_x002d_LinksId.results, function(value, key){
                            let expLinkId = value;
                            angular.forEach($scope.experienceLinksArr, function(value, key){
                                if(value.ID == parseInt(expLinkId)){
                                    let linkObj = {
                                        Title: value.Title,
                                        Url: value.URL ? value.URL : null
                                    }
                                    experienceValue.linkDetailsArr.push(linkObj);
                                }
                            });
                        });   
                    }              
                });
            });
    
            if($scope.selectedPage.Experience_x002d_CardsId.results){
                //console.log("resources populated");
                $scope.pageExperienceArr = [];
                angular.forEach($scope.selectedPage.Experience_x002d_CardsId.results, function(value, key){
                    let experienceCardId = value;
                    angular.forEach($scope.experienceArr, function(value, key){
                        if(value.ID == parseInt(experienceCardId)){
                            $scope.pageExperienceArr.push(value);
                        }
                    });
                });
    
                //console.log("$scope.pageExperienceArr:: ", $scope.pageExperienceArr);
            }
      
        });
    });

    scsFamilyData.getSiteUsersData().then(function(data){
        $scope.siteUsersArr = data.d.results;

        scsFamilyData.getTeamData().then(function(data){
            $scope.teamArr = data.d.results;
            //Get 'Site User' ServiceMemberId for the Lead from the Team List first, using the Team list ID
            angular.forEach($scope.teamArr, function(value, key){
                if(value.field_2 == 'Lead' && value.field_3 == 'Experience'){
                    let leadUserSiteId = value.ServiceMemberId;

                    //Get Lead details
                    let teamLeadEmail = $filter('filter')($scope.siteUsersArr, {Id: leadUserSiteId}, true)[0]['Email'];
                    $.ajax({
                        url: _spPageContextInfo.webAbsoluteUrl + "/_api/SP.UserProfiles.PeopleManager/GetPropertiesFor(accountName=@v)?@v='i:0%23.f|membership|" + teamLeadEmail + "'",                        
                        headers: {                        
                        "Accept": "application/json; odata=verbose"                        
                        },                        
                        async: false,                        
                        contentType: "application/json; odata=verbose",                        
                        success: function(data){                            
                            if(data.d){
                                let userProfilePropertiesArr = data.d.UserProfileProperties.results;
                                for (let i = 0; i < userProfilePropertiesArr.length; i++){
                                    if(userProfilePropertiesArr[i]['Key'] == 'EYWorkLocationAddressCountry'){
                                        $scope.Country = userProfilePropertiesArr[i]['Value'];
                                    }
                                }
                                let userDetails = {
                                    DisplayName : data.d.DisplayName,
                                    PictureUrl : data.d.PictureUrl,
                                    Title : data.d.Title,
                                    Email: data.d.Email,
                                    Country: $scope.Country
                                }
                                $scope.leaderDetails = userDetails;
                                scsFamilyData.getTeamDataInd(data.d.DisplayName).then(function(data){
                                        $scope.teamArr.Title = data.d.results[0].field_1;
                                    });
                            }
                        }   
                    });   
                }
            });

            //Get 'Site User' ServiceMemberId for the team members from the Team List first, using the Team list ID
            $scope.experienceTeamArr = [];
            angular.forEach($scope.teamArr, function(value, key){
               
                if(value.field_2 === 'Member' && value.field_3 === 'Experience'){
                    //Get Team details                           
                    let teamMbrEmail = $filter('filter')($scope.siteUsersArr, {Id: value.EY_x002d_EmailId}, true)[0]['Email'];
                    $.ajax({
                        url: _spPageContextInfo.webAbsoluteUrl + "/_api/SP.UserProfiles.PeopleManager/GetPropertiesFor(accountName=@v)?@v='i:0%23.f|membership|" + teamMbrEmail + "'",
                        
                        headers: {                                
                        "Accept": "application/json; odata=verbose"                                
                        },
                        
                        async: false,                                
                        contentType: "application/json; odata=verbose",                                
                        success: function(data){                                                      
                            if (data.d) {
                                let userProfilePropertiesArr = data.d.UserProfileProperties.results;
                                for (let i = 0; i < userProfilePropertiesArr.length; i++){
                                    if(userProfilePropertiesArr[i]['Key'] == 'EYWorkLocationAddressCountry'){
                                        $scope.Country = userProfilePropertiesArr[i]['Value'];
                                    }
                                }
                                $scope.returnedUserDetails = {};

                                scsFamilyData.getTeamDataInd(data.d.DisplayName).then(function(data){

                                    $scope.userTitle = data.d.results[0].field_1;
                                });

                                let userDetails = {
                                    DisplayName : data.d.DisplayName,
                                    PictureUrl : data.d.PictureUrl,
                                    Title : data.d.Title,
                                    Email: data.d.Email,
                                    Country: $scope.Country
                                }
                                $scope.returnedUserDetails = userDetails;
                                $scope.experienceTeamArr.push(userDetails);
                            }

                            
                        }
                    });                    
                } 
            });                    
        });
    });

});  


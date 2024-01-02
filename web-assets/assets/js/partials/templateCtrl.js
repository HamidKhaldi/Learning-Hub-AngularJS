/* Template Controller
====================================================================================================
==================================================================================================*/

scsFamilyApp.controller('templateCtrl', function (scsFamilyData, $scope, $sce, $http, $state, $stateParams, $localStorage, $window, $filter, $timeout, $q) {
    'use strict';
  
    $window.scrollTo(0, 0);
    $scope.$sce = $sce;
    $scope.user = {};
    $localStorage.userDetails = {};
    $scope.CurrentDate = new Date();
    // $scope.selectedPage.teamArr = [];
    $scope.siteUsersArr = [];
    $scope.teamEmailsArr = [];
    $scope.aboutArr = [];
    $scope.servicesArr = [];
    $scope.experienceArr = [];
    $scope.hideTeam = false;
    $scope.hideResources = false;
    $scope.pageURLName = $stateParams.pageURLName;

    scsFamilyData.getQuickLinksData().then(function(data){
        $scope.quickLinksArr = data.d.results;
    });

    scsFamilyData.getSCSExperienceData().then(function(data){
        $scope.experienceArr = data.d.results;
        //console.log("$scope.experienceArr:: ", $scope.experienceArr);

        scsFamilyData.getSCSExperienceLinksData().then(function(data){
            $scope.experienceLinksArr = data.d.results;
            console.log("$scope.experienceLinksArr:: ", $scope.experienceLinksArr);
            
            $scope.experienceArr.forEach(function(value, key){
                let experienceValue = value;
                experienceValue.linkDetailsArr = [];

                //console.log("experienceValue:: ", experienceValue);

                if(experienceValue.Experience_x002d_LinksId){
                    console.log("experienceValue not empty:: ", experienceValue)
                    angular.forEach(experienceValue.Experience_x002d_LinksId.results, function(value, key){
                        let linkMatch = $filter('filter')($scope.experienceLinksArr, {ID: parseInt(value)}, true)[0];
                        //console.log('linkMatch ', linkMatch);
                        let linkObj = {
                            Title: linkMatch.Title,
                            Url: linkMatch.URL ? linkMatch.URL : null
                        }
                        experienceValue.linkDetailsArr.push(linkObj)
                    });   
                } 
                //console.log(" experienceValue:: ", experienceValue)             
            });
           
        });
    });

    scsFamilyData.getTemplateData().then(function(data){
        $scope.selectedPage = $filter('filter')(data.d.results, {URL_x002d_Name: $scope.pageURLName }, true)[0];
        console.log("selected page:: ", $scope.selectedPage);
        $scope.selectedVideoURL = $scope.selectedPage.Page_x002d_Video_x002d_URL;
        $scope.selectedPageVideo = $sce.trustAsResourceUrl($scope.selectedVideoURL);
        scsFamilyData.getSiteUsersData().then(function(data){
            $scope.siteUsersArr = data.d.results;

            scsFamilyData.getTeamData().then(function(data){
                $scope.teamArr = data.d.results;
                //Get 'Site User' ServiceMemberId for the Lead from the Team List first, using the Team list ID
                angular.forEach($scope.teamArr, function(value, key){
                    if(value.ID == $scope.selectedPage.Team_x002d_Lead_x002d_LookupId){
                        $scope.hideTeam = false;
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
                                    $scope.selectedPage.leaderDetails = userDetails;
                                    scsFamilyData.getTeamDataInd(data.d.DisplayName).then(function(data){
                                            $scope.selectedPage.teamArr.Title = data.d.results[0].field_1;
                                    });
                                }
                            }   
                        });   
                    } else {
                        $scope.hideTeam = true;
                    }
                });

                //Get 'Site User' ServiceMemberId for the team members from the Team List first, using the Team list ID
                if($scope.selectedPage.Team_x002d_Members_x002d_LookupId.results.length > 0){
					$scope.hideTeam = false;
                    $scope.selectedPage.teamArr = [];
                    $scope.userSiteIdArr = [];            
                    angular.forEach($scope.selectedPage.Team_x002d_Members_x002d_LookupId.results, function(value, key){
                        let teamMbrsIdValue = value;
                        angular.forEach($scope.teamArr, function(value, key){
                            if(value.ID == teamMbrsIdValue){
                                //Get Team details                           
                                let teamMbrEmail = $filter('filter')($scope.siteUsersArr, {Id: value.ServiceMemberId}, true)[0]['Email'];
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
                                            $scope.selectedPage.teamArr.push(userDetails);
                                        }  
                                    }
                                });                    
                            } 
                        });                    
                    });
                }
                else {
                   $scope.hideTeam = true;
                }
            });
        });

        if($scope.selectedPage.Quicklinks_x002d_LookupId.results.length > 0){
            $scope.selectedPage.quickLinksArr = [];
            angular.forEach($scope.selectedPage.Quicklinks_x002d_LookupId.results, function(value, key){
                let quickLinkDetails = $filter('filter')($scope.quickLinksArr, {ID:value}, true)[0];
                $scope.selectedPage.quickLinksArr.push(quickLinkDetails);
            });
        }

        if($scope.selectedPage.Experience_x002d_CardsId.results.length > 0){
            $scope.hideResources = true;
            $scope.selectedPage.experienceArr = [];
            angular.forEach($scope.selectedPage.Experience_x002d_CardsId.results, function(value, key){
                let experienceCardDetails = $filter('filter')($scope.experienceArr, {ID:value}, true)[0];
                $scope.selectedPage.experienceArr.push(experienceCardDetails);
            });
        } else {
            $scope.hideResources = false;
        }

    });
});  


/* About Controller
====================================================================================================
==================================================================================================*/

scsFamilyApp.controller('aboutCtrl', function (scsFamilyData, $scope, $sce, $http, $state, $stateParams, $localStorage, $window, $filter, $timeout, $q) {
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
    $scope.impactArr = [];
    $scope.hideTeam = false;

    $scope.pageURLName = $stateParams.pageURLName;

    scsFamilyData.getQuickLinksData().then(function(data){
        $scope.quickLinksArr = data.d.results;
        //console.log('$scope.quickLinksArr', $scope.quickLinksArr);
    });

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
                        let linkMatch = $filter('filter')($scope.experienceLinksArr, {ID: parseInt(value)}, true)[0];
                        let linkObj = {
                            Title: linkMatch.Title,
                            Url: linkMatch.URL ? linkMatch.URL : null
                        }
                        experienceValue.linkDetailsArr.push(linkObj)
                    });   
                }              
            });

            //console.log('getSCSExperienceData final', $scope.experienceArr);

        });
    });

    scsFamilyData.getAboutSCSData().then(function(data){
        $scope.selectedPage = data.d.results[0];
        //console.log('$scope.selectedPage ', $scope.selectedPage);
        $scope.selectedVideoURL = $scope.selectedPage.Page_x002d_Video_x002d_URL;
        $scope.selectedPageVideo = $sce.trustAsResourceUrl($scope.selectedVideoURL);

        scsFamilyData.getSiteUsersData().then(function(data){
            $scope.siteUsersArr = data.d.results;

            scsFamilyData.getTeamData().then(function(data){
                $scope.teamArr = data.d.results;
                angular.forEach($scope.teamArr, function(value, key){
                    if(value.ID == $scope.selectedPage.Team_x002d_Lead_x002d_LookupId){
                        let leadUserSiteId = value.ServiceMemberId;
                        angular.forEach($scope.siteUsersArr, function(value, key){
                            if(value.Id == leadUserSiteId){
                                $scope.teamLeadEmail = value.Email;
                            }
                        });
                        $.ajax({
                            url: _spPageContextInfo.webAbsoluteUrl + "/_api/SP.UserProfiles.PeopleManager/GetPropertiesFor(accountName=@v)?@v='i:0%23.f|membership|" + $scope.teamLeadEmail + "'",                        
                            headers: {                        
                            "Accept": "application/json; odata=verbose"                        
                            },                        
                            async: false,                        
                            contentType: "application/json; odata=verbose",                        
                            success: function(data){                            
                                //console.log('profile data ', data.d);
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
                                        $scope.selectedPage.leaderDetails.Title = data.d.results[0].field_1;
                                    });

                                }
                            }   
                        });   
                    }
                });

                //Get 'Site User' ServiceMemberId for the team members from the Team List first, using the Team list ID
                if($scope.selectedPage.Team_x002d_Members_x002d_LookupId.results.length > 0){
                    $scope.selectedPage.teamArr = [];
                    $scope.userSiteIdArr = [];            
                    angular.forEach($scope.selectedPage.Team_x002d_Members_x002d_LookupId.results, function(value, key){
                        let teamMbrsIdValue = value;
                        angular.forEach($scope.teamArr, function(value, key){
                            if(value.ID == teamMbrsIdValue){
                                //Get Team details                           
                                let teamMbrEmail = $filter('filter')($scope.siteUsersArr, {Id: value.ServiceMemberId}, true)[0]['Email'];
                                //console.log('teamMbrEmail ', teamMbrEmail);
                                $.ajax({
                                    url: _spPageContextInfo.webAbsoluteUrl + "/_api/SP.UserProfiles.PeopleManager/GetPropertiesFor(accountName=@v)?@v='i:0%23.f|membership|" + teamMbrEmail + "'",
                                    
                                    headers: {                                
                                    "Accept": "application/json; odata=verbose"                                
                                    },
                                    
                                    async: false,                                
                                    contentType: "application/json; odata=verbose",                                
                                    success: function(data){                                    
                                        //console.log('profile data ', data.d);                    
                                        if (data.d) {
                                            let userProfilePropertiesArr = data.d.UserProfileProperties.results;
                                            for (let i = 0; i < userProfilePropertiesArr.length; i++){
                                                if(userProfilePropertiesArr[i]['Key'] == 'EYWorkLocationAddressCountry'){
                                                    $scope.Country = userProfilePropertiesArr[i]['Value'];
                                                }
                                            }
                                            $scope.returnedUserDetails = {};

                                            $scope.userDetails = {
                                                DisplayName : data.d.DisplayName,
                                                PictureUrl : data.d.PictureUrl,
                                                Title : '',
                                                Email: data.d.Email,
                                                Country: $scope.Country
                                            }

                                            $scope.returnedUserDetails = $scope.userDetails;
                                            $scope.selectedPage.teamArr.push($scope.userDetails);
                                        }
                                    }
                                }).then((response) => {
                                    angular.forEach($scope.selectedPage.teamArr, function(value, key){
                                        scsFamilyData.getTeamDataInd(value.DisplayName).then(function(data){
                                            $scope.userTitle = data.d.results[0].field_1;
                                            var arrayPosition = key;
                                            $scope.selectedPage.teamArr[arrayPosition].Title = $scope.userTitle;
                                        });
                                    });
                                });                    
                            } 
                        });                    
                    }); 
                }

            });
        });

        if($scope.selectedPage.Quick_x002d_LinksId.results.length > 0){
            $scope.selectedPage.quickLinksArr = [];
            angular.forEach($scope.selectedPage.Quick_x002d_LinksId.results, function(value, key){
                let quickLinkId = value;
                angular.forEach($scope.quickLinksArr, function(value, key){
                    if(value.ID == parseInt(quickLinkId)){
                        $scope.selectedPage.quickLinksArr.push(value);
                    }
                });
            }); 
            //console.log('quickLinksArr ', $scope.selectedPage.quickLinksArr);
        }

        if($scope.selectedPage.Experience_x002d_CardsId.results.length > 0){
            $scope.selectedPage.experienceArr = [];
            angular.forEach($scope.selectedPage.Experience_x002d_CardsId.results, function(value, key){
                let experienceCardId = value;
                angular.forEach($scope.experienceArr, function(value, key){
                    if(value.ID == parseInt(experienceCardId)){
                        $scope.selectedPage.experienceArr.push(value);
                    }
                });
            });
        }

    });


});  



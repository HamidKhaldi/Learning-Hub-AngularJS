/* Home Controller
====================================================================================================
==================================================================================================*/

scsFamilyApp.controller('headerCtrl', function (scsFamilyData, articleData, $scope, $sce, $http, $state, $stateParams, $localStorage, $window, $filter, $timeout, $q) {
    'use strict';
  
    $window.scrollTo(0, 0);
    $scope.$sce = $sce;
    $scope.user = {};
    $localStorage.userDetails = {};
    $scope.searchDisplayClass = 'hide-section';
    $scope.allArticleArr = [];
    $scope.docArr = [];
    $scope.filteredKeywordsArr = [];
    $localStorage.searchResultsArr = [];
   
    $scope.removeDuplicates = function(myArray){ 
        var newArray = [];
        for(var i=0; i< myArray.length; i++){
            if(newArray.indexOf(myArray[i]) == -1){
            newArray.push(myArray[i])
            }
        }
        return newArray;
    };

    $scope.checkMemberGroups = function(userGroup){
        let absoluteUri = 'siteUrl/',
            userInGroup = false;

        $.ajax({
                async: false,
                headers: {
                    "accept": "application/json; odata=verbose"
                },
                method: "GET",
                url: absoluteUri + "_api/Web/CurrentUser/Groups",                
                success: function(data) {
                        for (var i = 0; i < data.d.results.length; i++) {    
                            if (data.d.results[i].Title == userGroup) {
                                userInGroup = true;
                            }
                        }
                    },
                    error: function(response) {
                        console.log(response.status);
                    },
            });
            $localStorage.userInGroup = userInGroup;
            return $localStorage.userInGroup;
    }

    $scope.getUserData = function(){
        return $http({
            url: _spPageContextInfo.webAbsoluteUrl + "/_api/SP.UserProfiles.PeopleManager/GetMyProperties",
            method: "GET",
            headers: { "Accept": "application/json; odata=verbose" },
            cache: false
        })
        .then(function (response) {
            $localStorage.userDetails.userID = _spPageContextInfo.userId;
            $localStorage.userDetails.userFullName = response.data.d.DisplayName;
            $localStorage.userDetails.userEmail = response.data.d.Email;
            $localStorage.userDetails.userTitle = response.data.d.Title;
            $localStorage.userDetails.userInGroup = $scope.checkMemberGroups('Engagement & Messaging Leads');

            scsFamilyData.getSubscriptionData($localStorage.userDetails.userEmail).then(function(data){
                if(data.d.results.length > 0){
                    $localStorage.userDetails.ElectiveSubscription = JSON.parse(data.d.results[0]['Elective_x002d_Subscription']);
                    $localStorage.userDetails.subscriptionListId = data.d.results[0]['ID'];
                    $localStorage.userDetails.existingUser = true;
                } else {
                    $localStorage.userDetails.existingUser = false;
                }
                $scope.userDetails = $localStorage.userDetails;
                $scope.userInGroup = $localStorage.userDetails.userInGroup;
            });

            
        },
        function (errorThrown) {
                // Log errors in browsers console if any
                //console.info('http Request failed in getUserProfileProperties function :' + errorThrown.statusText + ' || ' + errorThrown.responseText);
            }
        );
    }

    

    $scope.searchCont = function(){
        $scope.searchDisplayClass == 'hide-section' ? $scope.searchDisplayClass = '': $scope.searchDisplayClass = 'hide-section' ;
        $scope.selectedKeyword = '';
    }


    scsFamilyData.getQuickLinksData().then(function(data){
        $scope.quickLinksArr = data.d.results;
    });

    scsFamilyData.getHeroData().then(function(data){
        $scope.heroData = data.d.results[0]; 
    });

    scsFamilyData.getResourcesQuickLinksData().then(function(data){
        $scope.resourcesQuickLinksData = data.d.results; 
        //console.log("$scope.resourcesQuickLinksData:: ", $scope.resourcesQuickLinksData);
    });

    scsFamilyData.getMyGroupsData().then(function(data){
        $scope.myGroupsArr = [];
        $scope.showAllGroups = false;
        $scope.myGroupsData = data.d.results; 

        scsFamilyData.getGroupUsersData().then(function(data){

            angular.forEach(data.d.results, function(value, key){
                if(value.Email == $localStorage.userDetails.userEmail){
                    $scope.showAllGroups = true;
                }
            });
            
            setTimeout(function(){
                if($scope.showAllGroups == true){
                    $scope.myGroupsArr = $scope.myGroupsData;
                } else {
                    angular.forEach($scope.myGroupsData, function(value, key){
                        if(!value.Restricted0){
                            $scope.myGroupsArr.push(value);
                        }
                    });
                } 
            }, 500);
            
        });
    });

    articleData.getHeadlineData().then(function(data){
        $scope.headlinesArr = data.d.results;

        articleData.getHeadlineDataTags().then(function(data){
            $scope.headlinesTagsArr = data.d.results;      
            angular.forEach($scope.headlinesArr, function(value, key){
                let headlineValue = value;
                if(headlineValue.Publish){
                    if(headlineValue.Article_x002d_TopicId){
                        headlineValue.tagArr = [];
                        angular.forEach(headlineValue.Article_x002d_TopicId.results, function(value, key){                            
                            let valueId = value;
                            angular.forEach($scope.headlinesTagsArr, function(value, key){
                                if(value.ID == parseInt(valueId)){
                                    headlineValue.tagArr.push(value.Title);
                                    $scope.filteredKeywordsArr.push(value.Title);
                                }
                            });
                        });
                    }
                    headlineValue.ArticleType = 'headline';
                    headlineValue.borderColor = 'headlines';
                    $scope.filteredKeywordsArr.push(value.Title);
                    $scope.filteredKeywordsArr.push(value.Sub_x002d_Title);
                    $scope.filteredKeywordsArr.push(value.ArticleType);
                    $scope.allArticleArr.push(value);
                }
            });
        });

        scsFamilyData.getKnowledgeCenterData().then(function(data){
            angular.forEach(data.d.results, function(value, key){
                $scope.docArr.push(value);
                $scope.filteredKeywordsArr.push(value.Title);
                $scope.filteredKeywordsArr.push(value.Document_x002d_Category);
            });

            articleData.getAttachmentsData().then(function(data){
                angular.forEach(data.d.results, function(value, key){
                    $scope.docArr.push(value);
                    $scope.filteredKeywordsArr.push(value.Title);
                });
            });
        });

        articleData.getMyNewsData().then(function(data){
            $scope.myNewsArr = data.d.results;
            articleData.getMyNewsDataTags().then(function(data){
                $scope.myNewsTagsArr = data.d.results;         
                angular.forEach($scope.myNewsArr, function(value, key){
                    let myNewsValue = value;
                    if(myNewsValue.Publish){
                        if(myNewsValue.Article_x002d_TopicId){
                            myNewsValue.tagArr = [];
                            angular.forEach(myNewsValue.Article_x002d_TopicId.results, function(value, key){
                                let valueId = value;
                                angular.forEach($scope.myNewsTagsArr, function(value, key){
                                    if(value.ID == parseInt(valueId)){
                                        myNewsValue.tagArr.push(value.Title);
                                        $scope.filteredKeywordsArr.push(value.Title);
                                    }
                                });
                            });
                        }
                        myNewsValue.ArticleType = 'my-news';
                        myNewsValue.borderColor = 'my-news';
                        $scope.filteredKeywordsArr.push(value.Title);
                        $scope.filteredKeywordsArr.push(value.Sub_x002d_Title);
                        $scope.filteredKeywordsArr.push(value.ArticleType);
                        $scope.allArticleArr.push(value);
                    }   
                });
            });
    
            articleData.getCelebrationData().then(function(data){
                $scope.kudosArr = data.d.results;
                articleData.getKudosDataTags().then(function(data){
                    $scope.kudosTagsArr = data.d.results;
                    angular.forEach($scope.kudosArr, function(value, key){
                        let kudosValue = value;
                        if(kudosValue.Publish){
                            if(kudosValue.Article_x002d_TopicId){
                                kudosValue.tagArr = [];
                                angular.forEach(kudosValue.Article_x002d_TopicId.results, function(value, key){
                                    let valueId = value;
                                    angular.forEach($scope.kudosTagsArr, function(value, key){
                                        if(value.ID == parseInt(valueId)){
                                            kudosValue.tagArr.push(value.Title);
                                            $scope.filteredKeywordsArr.push(value.Title);
                                        }
                                    });
                                });
                            }

                            kudosValue.ArticleType = 'kudos';
                            kudosValue.borderColor = 'kudos';
                            $scope.filteredKeywordsArr.push(value.Title);
                            $scope.filteredKeywordsArr.push(value.Sub_x002d_Title);
                            $scope.filteredKeywordsArr.push(value.ArticleType);
                            $scope.allArticleArr.push(value);
                        }
                    });
                });

                articleData.getTeamUpdateData().then(function(data){
                    $scope.updatesArr = data.d.results;
                    articleData.getUpdatesDataTags().then(function(data){
                        $scope.updatesTagsArr = data.d.results;                    
                        angular.forEach($scope.updatesArr, function(value, key){
                            let updatesValue = value;
                            if(updatesValue.Publish){
                                if(updatesValue.Article_x002d_TopicId){
                                    updatesValue.tagArr = [];
                                    angular.forEach(updatesValue.Article_x002d_TopicId.results, function(value, key){
                                        let valueId = value;
                                        angular.forEach($scope.updatesTagsArr, function(value, key){
                                            if(value.ID == parseInt(valueId)){
                                                updatesValue.tagArr.push(value.Title);
                                                $scope.filteredKeywordsArr.push(value.Title);
                                            }
                                        });
                                    });
                                }
                                updatesValue.ArticleType = 'team-update';
                                updatesValue.borderColor = 'team-update';
                                $scope.filteredKeywordsArr.push(value.Title);
                                $scope.filteredKeywordsArr.push(value.Sub_x002d_Title);
                                $scope.filteredKeywordsArr.push(value.ArticleType);
                                $scope.allArticleArr.push(value);
                            }
                        });
                    });
    
    
                    articleData.getKeywordData().then(function(data){
                        $scope.keywordArr = data.d.results;
                    });
                
                    articleData.getTopStoriesData().then(function(data){
                        angular.forEach(data.d.results, function(value, key){
                            let storyValue = value;
                            if(storyValue.KeywordsId){
                                storyValue.Keywords = [];
                                angular.forEach(storyValue.KeywordsId.results, function(value, key){
                                    let keywordId = value;
                                    angular.forEach($scope.keywordArr, function(value, key){
                                        if(value.ID == keywordId){
                                            storyValue.Keywords.push(value.Title);
                                            $scope.filteredKeywordsArr.push(value.Title);
                                        }
                                    });
                                });
                            }
                            $scope.filteredKeywordsArr.push(storyValue.Title);
                            $scope.filteredKeywordsArr.push(storyValue.Sub_x002d_Title);
                            $scope.allArticleArr.push(storyValue);
    
                        });
                        articleData.getAttachmentsData().then(function(data){
                            $scope.attachmentsArr = data.d.results;
                        });
                        
                        $scope.filteredKeywordsArr = $scope.removeDuplicates($scope.filteredKeywordsArr);
                        $localStorage.allArticleArr = $scope.allArticleArr;
    
                        $scope.getKeyword = function(event){              
                            if($scope.selectedKeyword != undefined && $scope.selectedKeyword !=''){
                                $localStorage.selectedKeyword = $scope.selectedKeyword;
                                $localStorage.searchResultsArr = [];
                                angular.forEach($scope.allArticleArr, function(value, key){
                                    if(value.Title == $scope.selectedKeyword || value.Sub_x002d_Title == $scope.selectedKeyword || value.ArticleType == $scope.selectedKeyword){
                                        value.isDoc = false;
                                        $localStorage.searchResultsArr.push(value);
                                    }
                                    if(value.tagArr && value.tagArr.indexOf($scope.selectedKeyword) > -1){
                                        value.isDoc = false;
                                        $localStorage.searchResultsArr.push(value);
                                    }
                                    if(value.Keywords && value.Keywords.indexOf($scope.selectedKeyword) > -1){
                                        value.isDoc = false;
                                        $localStorage.searchResultsArr.push(value);
                                    }
                                });

                                angular.forEach($scope.docArr, function(value, key){
                                    if(value.Title == $scope.selectedKeyword || value.Document_x002d_Category == $scope.selectedKeyword){
                                        value.isDoc = true;
                                        if(value.Attachment_x002d_Link){
                                            value.Url = value.Attachment_x002d_Link.Url;
                                        } else if(value.Document_x002d_Link){
                                            value.Url = value.Document_x002d_Link.Url;
                                        }
                                        $localStorage.searchResultsArr.push(value);
                                    }
                                });
                   
                                $state.go('search', {
                                    searchTerm: $localStorage.selectedKeyword
                                }, {
                                    notify: true
                                });
                                $scope.searchCont();
                            }
                        }
                    });
                
                });
            });
        });   
    });
});

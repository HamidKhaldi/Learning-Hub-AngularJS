/* Home Controller
====================================================================================================
==================================================================================================*/

scsFamilyApp.controller('homeCtrl', function (scsFamilyData, articleData, $scope, $sce, $http, $state, $stateParams, $localStorage, $window, $filter, $timeout, $q) {
    'use strict';
  
    $window.scrollTo(0, 0);
    $scope.$sce = $sce;
    $scope.experienceArr = [];
    $scope.displayClass = 'hide-section';
    $localStorage.sessionData = {};
    $scope.allArticlesArr = [];
     $localStorage.subscribedFiltersArr = [];
    $scope.filteredArticlesArr = [];
    $scope.modalMessage = '';

    
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
                        //console.log('group data ', data.d.results);
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
            //console.log('response.data.d in home', response.data.d);
            //console.log('_spPageContextInfo.userId ', _spPageContextInfo.userId);            
            $localStorage.userDetails.userID = _spPageContextInfo.userId;
            $localStorage.userDetails.userFullName = response.data.d.DisplayName;
            $localStorage.userDetails.userEmail = response.data.d.Email;
            $localStorage.userDetails.userTitle = response.data.d.Title;
            $localStorage.userDetails.userInGroup = $scope.checkMemberGroups('Engagement & Messaging Leads');

            scsFamilyData.getSubscriptionData($localStorage.userDetails.userEmail).then(function(data){
                //console.log("subscription data", data.d.results.length);
                if(data.d.results.length > 0){
                    $localStorage.userDetails.ElectiveSubscription = JSON.parse(data.d.results[0]['Elective_x002d_Subscription']);
                    $localStorage.userDetails.subscriptionListId = data.d.results[0]['ID'];
                    $localStorage.userDetails.existingUser = true;
                } else {
                    $localStorage.userDetails.existingUser = false;
                }
                
                return $localStorage.userDetails;
            });

            
        },
        function (errorThrown) {
                // Log errors in browsers console if any
                //console.info('http Request failed in getUserProfileProperties function :' + errorThrown.statusText + ' || ' + errorThrown.responseText);
            }
        );
    }


    console.log('$localStorage.userDetails home', $localStorage.userDetails);
    if($localStorage.userDetails == {}){
        // $scope.user = {};
        $scope.getUserData();
        console.log('$localStorage.userDetails if statement', $localStorage.userDetails);
    }
    //console.log('$localStorage.userInGroup home', $localStorage.userDetails.userInGroup);
    $scope.userDetails = $localStorage.userDetails;
    $scope.userInGroup = $localStorage.userDetails.userInGroup;

    $scope.showPersonalisation = function(){
        $scope.displayClass = '';
    }

    $scope.hidePersonalisation = function(){
        $scope.displayClass = 'hide-section';

        
        console.log('$localStorage.subscribedFiltersArr ', $localStorage.subscribedFiltersArr);
        console.log('$scope.userDetails', $scope.userDetails);

        
        setTimeout(function(){

            $scope.subscribedFilterArr = $localStorage.subscribedFiltersArr;
            $scope.subscribedElectiveArr = [];
            angular.forEach($scope.subscribedFilterArr, function(value, key){
                if(value.Subscription == 'Elective'){
                    $scope.subscribedElectiveArr.push(value);
                }
            });

            console.log('subscribedElectiveArr ', $scope.subscribedElectiveArr);
            if($scope.userDetails.existingUser == true){                                                
                $.ajax
                ({
                    url: _spPageContextInfo.siteAbsoluteUrl + "/Family/_api/web/lists/getbytitle('Lst_Subscriptions')/items("+ $scope.userDetails.subscriptionListId +")",
                    type: "POST",
                    data: JSON.stringify
                ({
                    __metadata: 
                {
                    type: 'SP.Data.Lst_x005f_SubscriptionsListItem'
                },
                
                    'Elective_x002d_Subscription' : JSON.stringify($scope.subscribedElectiveArr) 
                }),
                headers:
                {
                    "Accept": "application/json;odata=verbose",
                    "Content-Type": "application/json;odata=verbose",
                    "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                    "X-HTTP-Method": "MERGE",
                    "If-Match": "*"
                },
                success: function(data, status, xhr){
                    console.log('data sent ', data);
                    // $('#newsLetterModal'). modal('show');
                    // $scope.modalMessage = "Your subscription has been successfully updated!'";
                    // $scope.resetFields();
                    // $scope.$apply();
                },
                error: function(xhr, status, error){
                    // $scope.modalMessage = 'There appears to be an issue in updating your subscription, please refresh the page and submit again.';
                    // $('#newsLetterModal').modal('show');
                }
                });
            } else {
                $.ajax
                ({
                    url: _spPageContextInfo.siteAbsoluteUrl + "/Family/_api/web/lists/getbytitle('Lst_Subscriptions')/items",
                    type: "POST",
                    data: JSON.stringify
                ({
                    __metadata: 
                {
                    type: 'SP.Data.Lst_x005f_SubscriptionsListItem'
                },
                
                    'Title' : $scope.userDetails.userFullName,
                    'Email' : $scope.userDetails.userEmail,
                    'Elective_x002d_Subscription': JSON.stringify($scope.subscribedElectiveArr)
                }),
                headers:
                {
                    "Accept": "application/json;odata=verbose",
                    "Content-Type": "application/json;odata=verbose",
                    "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                    "X-HTTP-Method": "POST"
                },
                success: function(data, status, xhr){
                    console.log('data sent ', data);
                    // $('#newsLetterModal'). modal('show');
                    // $scope.modalMessage = "Your subscription has been successfully updated!'";
                    // $scope.resetFields();
                    // $scope.$apply();
                },
                error: function(xhr, status, error){
                    // $scope.modalMessage = 'There appears to be an issue in updating your subscription, please refresh the page and submit again.';
                    // $('#newsLetterModal').modal('show');
                    console.log('submission error ', error);
                }
                });
            }                   

        }, 800);  
    }

    //Remove value from Array
    $scope.arrayRemove = function(arr, value) {     
        return arr.filter(function(ele){ 
            return ele != value; 
        });
    }

    $scope.removeDuplicates = function(myArray){ 
        var newArray = [];
        for(var i=0; i< myArray.length; i++){
            if(newArray.indexOf(myArray[i]) == -1){
            newArray.push(myArray[i])
            }
        }
        return newArray;
    };


    $q.all($scope.userDetails).then(function(){
        console.log('$scope.userDetails ', $scope.userDetails);
        articleData.getTopStoriesData().then(function(data){
            //console.log('top stories ', data.d.results);
            $scope.topStoriesArr = data.d.results;
    
            articleData.getAttachmentsData().then(function(data){
                $scope.attachmentsArr = data.d.results;
                ///console.log('$scope.attachmentsArr ', $scope.attachmentsArr);
            });
    
            $scope.getTopStory = function(id){
                angular.forEach($scope.topStoriesArr, function(value, key){
                    if(value.ID == id){
                        $localStorage.topStory = value;
                    }
                });
    
                if($localStorage.topStory.Attachment_x002d_FilesId){
                    $localStorage.topStory.AttachArr = [];
                    angular.forEach($localStorage.topStory.Attachment_x002d_FilesId.results, function(value, key){
                        let attachID = value;
                        angular.forEach($scope.attachmentsArr, function(value, key){
                            if(value.ID == attachID){
                                let attachObj = {
                                    Title: value.Title,
                                    Link: value.Attachment_x002d_Link.Url
                                }
                                $localStorage.topStory.AttachArr.push(attachObj);
                            }
                            
                        });
                    });
    
                }
    
                //console.log('top story 334', $localStorage.topStory);
                $scope.storyData = $localStorage.topStory;
            }
        });
    
        articleData.getHeadlineData().then(function(data){
            //console.log('headlines ', data.d.results);
            $scope.headlinesArr = data.d.results;
    
            articleData.getHeadlineDataTags().then(function(data){
                //console.log(' headline tags ', data.d.results);
                $scope.headlinesTagsArr = data.d.results;
    
                 $localStorage.subscribedFiltersArr =  $localStorage.subscribedFiltersArr.concat($scope.headlinesTagsArr);
    
        
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
                                    }
                                });
                            });
                        }
                        headlineValue.ArticleType = 'headline';
                        headlineValue.borderColor = 'headlines';
                        $scope.allArticlesArr.push(headlineValue);
                    }   
                });
                //console.log(' $scope.allArticlesArr headlines', $scope.allArticlesArr);
                articleData.getMyNewsData().then(function(data){
                    //console.log('my news ', data.d.results);
                    $scope.myNewsArr = data.d.results;
                    
        
                    articleData.getMyNewsDataTags().then(function(data){
                        console.log('$scope.userDetails.ElectiveSubscription', $scope.userDetails.ElectiveSubscription); 
                        $scope.myNewsTagsData = data.d.results;       
                        $scope.myNewsTagsArr = [];
                        if($scope.userDetails.ElectiveSubscription && $scope.userDetails.ElectiveSubscription.length > 0){
                            alert('user exists');
                            angular.forEach($scope.myNewsTagsData, function(value, key){
                                let tagValue = value;
                                if(tagValue.Subscription == 'Elective'){
                                    angular.forEach($scope.userDetails.ElectiveSubscription, function(value, key){
                                        if(value.Title == tagValue.Title){
                                            tagValue.inputClass = 'scs__mandatory-sub-input';
                                            $localStorage.subscribedFiltersArr.push(tagValue);                                            
                                            console.log('match', tagValue);
                                        } else {
                                            tagValue.inputClass = '';
                                            console.log('NO match', tagValue);
                                        }

                                        if($scope.myNewsTagsArr.indexOf(tagValue == -1)){
                                            $scope.myNewsTagsArr.push(tagValue);
                                        }
                                    });
                                }
                                if(tagValue.Subscription == 'Managed'){
                                    tagValue.inputClass = 'scs__mandatory-sub-input';
                                    $scope.myNewsTagsArr.push(tagValue);
                                    $localStorage.subscribedFiltersArr.push(tagValue);
                                }
                            });
                            $scope.myNewsTagsArr = $scope.removeDuplicates($scope.myNewsTagsArr);
                        } else {
                            alert('user doesnt exist');
                            angular.forEach($scope.myNewsTagsData, function(value, key){
                                if(value.Subscription == 'Elective'){
                                    if(value.Subscribed_x002d_By_x002d_Defaul == false){
                                        value.inputClass = '';                        
                                    } else {
                                        value.inputClass = 'scs__mandatory-sub-input';
                                            $localStorage.subscribedFiltersArr.push(value);
                                    }
                                    $scope.myNewsTagsArr.push(value);
                                }
                                if(value.Subscription == 'Managed' && $localStorage.userInGroup){
                                    $scope.myNewsTagsArr.push(value);
                                    $localStorage.subscribedFiltersArr.push(value);
                                }
                            });
                        }

                        $q.all($scope.myNewsTagsArr).then(function(){
                            console.log('$scope.myNewsTagsArr after $q.all', $scope.myNewsTagsArr);
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
                                                }
                                            });
                                        });
                                    }
                                    myNewsValue.ArticleType = 'my-news';
                                    myNewsValue.borderColor = 'my-news';
                                    $scope.allArticlesArr.push(myNewsValue);
                                }   
                            });
                            // console.log(' $scope.allArticlesArr headlines+myNews', $scope.allArticlesArr);
                            articleData.getCelebrationData().then(function(data){
                                //console.log('kudos celebrations ', data.d.results);
                
                                $scope.kudosArr = data.d.results;
                
                                articleData.getKudosDataTags().then(function(data){
                                    //console.log('kudos tags ', data.d.results);
                                    $scope.kudosTagsArr = data.d.results;
                                     $localStorage.subscribedFiltersArr =  $localStorage.subscribedFiltersArr.concat($scope.kudosTagsArr);
        
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
                                                        }
                                                    });
                                                });
                                            }
                                            kudosValue.ArticleType = 'kudos';
                                            kudosValue.borderColor = 'kudos';
                                            $scope.allArticlesArr.push(kudosValue);
                                        }
                                    });
                                    //console.log(' $scope.allArticlesArr headlines+myNews+kudos', $scope.allArticlesArr);
                                    articleData.getTeamUpdateData().then(function(data){
                                        //console.log('team updates ', data.d.results);
                    
                                        $scope.updatesArr = data.d.results;
                    
                                        articleData.getUpdatesDataTags().then(function(data){
                                            $scope.updatesTagsArr = data.d.results;
                                             $localStorage.subscribedFiltersArr =  $localStorage.subscribedFiltersArr.concat($scope.updatesTagsArr);
                                        
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
                                                                }
                                                            });
                                                        });
                                                    }
                                                    updatesValue.ArticleType = 'team-update';
                                                    updatesValue.borderColor = 'team-update';
                                                    $scope.allArticlesArr.push(updatesValue);
                                                }
                                            });
                                            //console.log(' $scope.allArticlesArr headlines+myNews+kudos+updates', $scope.allArticlesArr);
                                            $q.all($scope.allArticlesArr).then(function(){
                                                //console.log('all articles final', $scope.allArticlesArr);
                                                setTimeout(function(){
                                                    $('.scs__mandatory-sub-input').prop('checked', true);
                                                    // $('.scs__mandatory-sub-input').attr('disabled', 'disabled')
                                                }, 500);
        
                                                //console.log(' $localStorage.subscribedFiltersArr on landing ',  $localStorage.subscribedFiltersArr);
                                                angular.forEach($scope.allArticlesArr, function(value, key){
                                                    let articleValue = value;
                                                    angular.forEach( $localStorage.subscribedFiltersArr, function(value, key){
                                                        if(articleValue.tagArr && articleValue.tagArr.indexOf(value.Title) > -1 && $scope.filteredArticlesArr.indexOf(articleValue) == -1){
                                                            $scope.filteredArticlesArr.push(articleValue);
                                                        }
                                                    });
                                                });
                                                //console.log('initial filteredArticlesArr ', $scope.filteredArticlesArr);
                                                
                                                $scope.updateSubscription = function(filterValue){
                                                
                                                    console.log('subscription filter value ', filterValue);
        
                                                    $localStorage.subscribedFiltersArr.indexOf(filterValue) > -1 ? $localStorage.subscribedFiltersArr = $scope.arrayRemove($localStorage.subscribedFiltersArr, filterValue) : $localStorage.subscribedFiltersArr.push(filterValue);
                                                }
                        
                                                $scope.filterArticles = function(filterValue){
        
                                                     $localStorage.subscribedFiltersArr.indexOf(filterValue) == -1 ?  $localStorage.subscribedFiltersArr.push(filterValue) :  $localStorage.subscribedFiltersArr = $scope.arrayRemove( $localStorage.subscribedFiltersArr, filterValue);
                                                    //console.log('filter ', filterValue);
                                                    console.log('subscribedFiltersArr after click ',  $localStorage.subscribedFiltersArr);
                    
                                                    if( $localStorage.subscribedFiltersArr.length == 0){
                                                        $scope.filteredArticlesArr = $scope.allArticlesArr;
                                                    } else {
                                                        $scope.filteredArticlesArr = [];
                                                        angular.forEach($scope.allArticlesArr, function(value, key){
                                                            let articleValue = value;
                                                            angular.forEach( $localStorage.subscribedFiltersArr, function(value, key){
                                                                if(articleValue.tagArr && articleValue.tagArr.indexOf(value.Title) > -1 && $scope.filteredArticlesArr.indexOf(articleValue) == -1){
                                                                    $scope.filteredArticlesArr.push(articleValue);
                                                                }
                                                            });
                                                        });
        
                                                        console.log('filtered article arr 3 ', $scope.filteredArticlesArr);
                                                    }
                                                }
        
                                                $scope.getArticle = function(id, type){
                                                    //console.log('clicked id & type ', id, type);
                                                    angular.forEach($scope.allArticlesArr, function(value, key){
                                                        if(value.ID == id && value.ArticleType == type){
                                                            $localStorage.articleData = value;
                                                        }
                                                    });
                                                    //console.log('article data ', $localStorage.articleData);
                                                }
                                            })
                                        }); 
                                    
                                    });
                
                                });
                    
                            });

                        });

                    });
                
                });
    
            });
    
            
    
        });
    
        scsFamilyData.getCalendarData().then(function(data){
            //console.log('calendar data ', data.d.results);
            $scope.eventsArr = data.d.results;
        });
    });
      
});  


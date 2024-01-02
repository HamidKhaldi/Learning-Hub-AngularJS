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

    console.log('$localStorage.userDetails home', $localStorage.userDetails);
    $scope.userDetails = $localStorage.userDetails;

    $scope.showPersonalisation = function(){
        $scope.displayClass = '';
    }

    $scope.hidePersonalisation = function(){
        $scope.displayClass = 'hide-section';
    }

    // articleData.getDataTags().then(function(data){
    //     console.log(' data tags ', data.d.results);
    // });

    articleData.getUpdatesDataTags().then(function(data){
        console.log(' updates tags ', data.d.results);
    });

    articleData.getKudosDataTags().then(function(data){
        console.log(' kudos tag ', data.d.results);
    });

    // articleData.getChoiceFieldValues('Lst_My-News', 'Publisher').then(function(data){
    //     //console.log('know pub', data);
    //     $scope.newsPublisherArr = data;
    // });

    // articleData.getChoiceFieldValues('Lst_Team-Update', 'Publisher').then(function(data){
    //     //console.log('team pub', data);
    //     $scope.teamPublisherArr = data;

    //     articleData.getChoiceFieldValues('Lst_Kudos-Celebrations', 'Publisher').then(function(data){
    //         //console.log('kudos pub', data);
    //         $scope.kudosPublisherArr = data;
    
    //         articleData.getChoiceFieldValues('Lst_Headlines', 'Publisher').then(function(data){
    //             //console.log('headline pub', data);
    //             $scope.headlinePublisherArr = data;

    //             setTimeout(function(){
    //                 $('.scs__mandatory-sub-input').prop('checked', true);
    //                 // $('.scs__mandatory-sub-input').attr('disabled', 'disabled');
    //             }, 500);
    //         });
    //     });
    // });

    

    // articleData.getChoiceFieldValues('Lst_Personalized-News','Elective_x002d_Subscription').then(function(data){
    //     $scope.electiveSubArr = data;
    //     //console.log('elective ', $scope.electiveSubsArr);

    //     articleData.getChoiceFieldValues('Lst_Personalized-News','Managed_x002d_Subscription').then(function(data){
    //         $scope.managedSubArr = data;
    //         //console.log('managed ', $scope.managedSubsArr);
    
    //         // articleData.getPersonalisedData().then(function(data){
    //         //     console.log('personalised data ', data.d.results);
    //         //     console.log('$scope.userDetails in personalised', $scope.userDetails);
    //         //     angular.forEach(data.d.results, function(value, key){
    //         //         if(value.Email == $scope.userDetails.userEmail){
    //         //             console.log('match');
    //         //             if(value.Managed_x002d_Subscription.results.length > 0){
    //         //                 $scope.managedSubArr = [];
    //         //                 angular.forEach(value.Managed_x002d_Subscription.results, function(value, key){
    //         //                     $scope.managedSubArr.push(value);
    //         //                 });                    
    //         //             }
    //         //             console.log('customised managed sub ', $scope.managedSubArr);

    //         //             if(value.Managed_x002d_Subscription.results.length > 0){
    //         //                 $scope.electiveSubArr = [];
    //         //                 angular.forEach(value.Elective_x002d_Subscription.results, function(value, key){
    //         //                     $scope.electiveSubArr.push(value);
    //         //                 });                    
    //         //             }
    //         //             console.log('customised elective sub ', $scope.electiveSubArr);
    //         //         }
    //         //     });
    //         // });
    //     });
    // });

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
            console.log(' headline tags ', data.d.results);
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
                                }
                            });
                        });
                    }
                    value.ArticleType = 'headline';
                    value.borderColor = 'headlines';
                    $scope.allArticlesArr.push(value);
                }   
            });

            articleData.getDidYouKnowData().then(function(data){
                //console.log('my news ', data.d.results);
                $scope.myNewsArr = data.d.results;
    
                articleData.getMyNewsDataTags().then(function(data){
                    //console.log('my news tags ', data.d.results);
                    $scope.myNewsTagsArr = data.d.results;
        
                    angular.forEach(data.d.results, function(value, key){
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
                            value.ArticleType = 'did-know';
                            value.borderColor = 'my-news';
                            $scope.allArticlesArr.push(value);
                        }   
                    });

                    articleData.getCelebrationData().then(function(data){
                        //console.log('kudos celebrations ', data.d.results);
        
                        $scope.kudosArr = data.d.results;
        
                        articleData.getKudosDataTags().then(function(data){
                            //console.log('kudos tags ', data.d.results);
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
                                                }
                                            });
                                        });
                                    }
                                    value.ArticleType = 'kudos';
                                    value.borderColor = 'kudos';
                                    $scope.allArticlesArr.push(value);
                                }
                            });

                            articleData.getNewsData().then(function(data){
                                //console.log('team updates ', data.d.results);
            
                                $scope.updatesArr = data.d.results;
            
                                articleData.getUpdatesDataTags(function(data){
                                    //console.log(' update tags ', data.d.results);
                                    $scope.updatesTagArr = data.d.results;
                                
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
                                            value.ArticleType = 'team-news';
                                            value.borderColor = 'team-update';
                                            $scope.allArticlesArr.push(value);
                                        }
                                    });
                                });
                            
                                $q.all($scope.allArticlesArr).then(function(){
                                    console.log('all articles 345555', $scope.allArticlesArr);
                
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

    scsFamilyData.getCalendarData().then(function(data){
        //console.log('calendar data ', data.d.results);
        $scope.eventsArr = data.d.results;
    });

      
});  


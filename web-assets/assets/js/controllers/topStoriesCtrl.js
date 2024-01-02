/* Top Stories Controller
====================================================================================================
==================================================================================================*/

scsFamilyApp.controller('topStoriesCtrl', function (articleData, $scope, $sce, $http, $state, $stateParams, $localStorage, $window, $filter, $timeout, $q) {
    'use strict';
  
    $window.scrollTo(0, 0);
    $scope.$sce = $sce;
    $scope.filterValuesArr = [];
    $scope.filteredStoriesArr = [];

    //Remove value from Array
    $scope.arrayRemove = function(arr, value) {     
        return arr.filter(function(ele){ 
            return ele != value; 
        });
    }
    articleData.getKeywordData().then(function(data){
        $scope.keywordArr = data.d.results;
    });

    articleData.getTopStoriesData().then(function(data){

        $scope.topStoriesArr = data.d.results;
        angular.forEach($scope.topStoriesArr, function(value, key){
            let storyValue = value;
            if(storyValue.KeywordsId){
                storyValue.Keywords = [];
                angular.forEach(storyValue.KeywordsId.results, function(value, key){
                    let keywordId = value;
                    angular.forEach($scope.keywordArr, function(value, key){
                        if(value.ID == keywordId){
                            storyValue.Keywords.push(value.Title);
                        }
                    });
                });
            }
        });
        console.log("$scope.topStoriesArr:: ", $scope.topStoriesArr);
        $scope.filteredStoriesArr = $scope.topStoriesArr;
       
        $scope.filterData = function(filterValue){
            $scope.filterValuesArr.indexOf(filterValue) == -1 ? $scope.filterValuesArr.push(filterValue) : $scope.filterValuesArr = $scope.arrayRemove($scope.filterValuesArr, filterValue);
            if($scope.filterValuesArr.length == 0){
                $scope.filteredStoriesArr = $scope.topStoriesArr;
            } else {
                $scope.filteredStoriesArr = [];
                angular.forEach($scope.topStoriesArr, function(value, key){
                    let storyValue = value;
                    if(storyValue.Keywords && storyValue.Keywords.length > 0){
                        angular.forEach(storyValue.Keywords, function(value, key){
                            if($scope.filterValuesArr.indexOf(value) > -1){
                                $scope.filteredStoriesArr.push(storyValue);
                            }
                        });
                    }
                });
            }
        }

        articleData.getAttachmentsData().then(function(data){
            $scope.attachmentsArr = data.d.results;
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
                    let attachmentId = value;
                    angular.forEach($scope.attachmentsArr, function(value, key){
                        if(value.ID == attachmentId){
                            let attachObj = {
                                Title: value.Title,
                                Link: value.Attachment_x002d_Link.Url
                            }
                            $localStorage.topStory.AttachArr.push(attachObj);
                        }
                    });
                });
            }
        }
    });
});  


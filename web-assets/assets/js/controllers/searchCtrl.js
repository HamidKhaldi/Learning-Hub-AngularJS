/* Search Controller
====================================================================================================
==================================================================================================*/

scsFamilyApp.controller('searchCtrl', function (scsFamilyData, articleData, $scope, $sce, $http, $state, $stateParams, $localStorage, $window, $filter, $timeout, $q) {
    'use strict';
  
    $window.scrollTo(0, 0);
    $scope.$sce = $sce;
    $scope.searchArr = [];
    $scope.searchResultsArr = $localStorage.searchResultsArr;
    $scope.resultsArr = $localStorage.searchResultsArr;
    
    // Remove duplicates from results array of objects
    $scope.removeDuplicates = function(myArray){ 
        var newArray = [];
        for(var i=0; i< myArray.length; i++){
            if(newArray.indexOf(myArray[i]) == -1){
            newArray.push(myArray[i])
            }
        }
        return newArray;
    };
    

    $scope.clearInput = function(){
        $scope.searchTerm = '';
        $sessionStorage.searchTerm = '';
        $scope.docArr = [];
        $localStorage.searchResultsArr = [];
        $state.go('search', {
            searchTerm: ''
        }, {
            notify: true
        });
    }

    scsFamilyData.getKnowledgeCenterData().then(function(data){
        $scope.docArr = data.d.results;
    });

    $scope.getArticle = function(id, ArticleType){

        articleData.getAttachmentsData().then(function(data){
            $scope.attachmentsArr = data.d.results;
        });

        angular.forEach($localStorage.searchResultsArr, function(value, key){
            if(value.ID == id){
                $localStorage.searchArticle = value;
            }
        });

        if($localStorage.searchArticle.Attachment_x002d_FilesId){
            $localStorage.searchArticle.AttachArr = [];
            angular.forEach($localStorage.searchArticle.Attachment_x002d_FilesId.results, function(value, key){
                let attachmentId = value;
                angular.forEach($scope.attachmentsArr, function(value, key){
                    if(value.ID == attachmentId){
                        let attachObj = {
                            Title: value.Title,
                            Link: value.Attachment_x002d_Link.Url
                        }
                        $localStorage.searchArticle.AttachArr.push(attachObj);
                    }
                });
            });
        }

        if(ArticleType != undefined){
            $localStorage.articleData = $localStorage.searchArticle;
            console.log("ArticleType:: ", ArticleType)
            $state.go('other-news-child', {
                articleType:$localStorage.searchArticle.ArticleType,
                articleTitle: $localStorage.searchArticle.Title
            }, {
                notify: true
            });
        } else {
            $localStorage.topStory = $localStorage.searchArticle;
            $state.go('top-stories-child', {
                articleType: 'top-story',
                articleTitle: $localStorage.searchArticle.Title
            }, {
                notify: true
            });
        }     

    }
});  


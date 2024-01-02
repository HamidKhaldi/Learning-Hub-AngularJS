/*  Secondary Template Controller
====================================================================================================
==================================================================================================*/

scsFamilyApp.controller('secondaryTemplateCtrl', function (scsFamilyData, articleData, $scope, $sce, $http, $state, $stateParams, $localStorage, $window, $filter, $timeout, $q) {
    'use strict';
  
    $window.scrollTo(0, 0);
    $scope.$sce = $sce;
    $scope.aboutArr = [];
    $scope.servicesArr = [];
    $scope.experienceArr = [];
    $scope.hideTeam = false;

    $scope.pageURLName = $stateParams.pageURLName;
   

    scsFamilyData.getQuickLinksData().then(function(data){
        $scope.quickLinksArr = data.d.results;
    });

    articleData.getAttachmentsData().then(function(data){
        $scope.attachmentArr = data.d.results;
    });

    scsFamilyData.getSecondaryTemplateData().then(function(data){
        angular.forEach(data.d.results, function(value, key){
            if(value.URL_x002d_Name == $scope.pageURLName){
                $scope.selectedPage = value;
            }
        });        
        if($scope.selectedPage.Quicklinks_x002d_LookupId.results.length > 0){
            $scope.selectedPage.quickLinksArr = [];
            angular.forEach($scope.selectedPage.Quicklinks_x002d_LookupId.results, function(value, key){
                let quicklinksId = value;
                angular.forEach($scope.quickLinksArr, function(value, key){
                    if(value.ID == quicklinksId){
                        $scope.selectedPage.quickLinksArr.push(value);
                    }
                });
            });
        }

        if($scope.selectedPage.Attachments_x002d_LookupId.results.length > 0){
            $scope.selectedPage.attachmentArr = [];
            angular.forEach($scope.selectedPage.Attachments_x002d_LookupId.results, function(value, key){
                let attachmentId = value;
                angular.forEach($scope.attachmentArr,function(value, key){
                    if(value.ID == attachmentId){
                        $scope.selectedPage.attachmentArr.push(value);
                    }
                });
            });
        }
    });
});  


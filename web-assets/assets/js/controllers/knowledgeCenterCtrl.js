/* Knowledge Center Controller
====================================================================================================
==================================================================================================*/

scsFamilyApp.controller('knowledgeCenterCtrl', function (scsFamilyData, articleData, $scope, $sce, $http, $state, $stateParams, $localStorage, $window, $filter, $timeout, $q) {
    'use strict';
  
    $window.scrollTo(0, 0);
    $scope.$sce = $sce;
 
    scsFamilyData.getKnowledgeCenterData().then(function(data){
        $scope.knowledgeArr = data.d.results;
        console.log('$scope.knowledgeArr ', data.d.results);
    });


});  


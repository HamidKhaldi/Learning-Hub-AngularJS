/* Home Controller
====================================================================================================
==================================================================================================*/

scsFamilyApp.controller('articleChildCtrl', function (scsFamilyData, articleData, $scope, $sce, $http, $state, $stateParams, $localStorage, $window, $filter, $timeout, $q, $location) {
    'use strict';

    $window.scrollTo(0, 0);
    $scope.$sce = $sce;
    $scope.usingVideo = false;
    $scope.locationURL = $window.location.href;
    $scope.articleTypeSplit = $scope.locationURL.split('/');
    const addQuotes = (str) => {
        return `"${str}"`;   
    }

    //console.log('$stateParams ', $stateParams);

    if ($stateParams.articleType) {
        $scope.articleType = $stateParams.articleType;
    } else {
        $scope.articleType = $scope.articleTypeSplit[8];
    }
    $scope.articleName = encodeURIComponent($stateParams.articleTitle);
    $scope.articleData = $localStorage.articleData;
    $scope.commentsArr = [];


    $scope.sendMail = function () {
        $scope.locationURL = encodeURIComponent($window.location.href);
        var mail = 'mailto:?subject=Check out this link&body=' + $scope.locationURL;
        $window.open(mail);
    }

    if ($scope.articleData) {
        //console.log('$localStorage.articleData ', $localStorage.articleData);
        return true;
    } else {
        if ($scope.articleType === 'my-news') {
            $scope.listName = 'Lst_My-News';
        } else if ($scope.articleType === 'team-update') {
            $scope.listName = 'Lst_Team-Update';
        } else if ($scope.articleType === 'kudos') {
            $scope.listName = 'Lst_Kudos-Celebrations';
        } else if ($scope.articleType === 'headline') {
            $scope.listName = 'Lst_Headlines';
        } else if ($scope.articleType === 'top-story' || $scope.articleType === 'Top-Stories') {
            $scope.listName = 'Lst_Top-Stories';
        }

        //console.log('$scope.listName ', $scope.listName);

        articleData.getArticleChildData($scope.listName).then(function (data) {
            console.log('data ', data.d.results);
            angular.forEach(data.d.results, function(value, key){
                if(value.Title === $stateParams.articleTitle){
                    $scope.articleData = value;
                }
            });
            //$scope.articleData = data.d.results[0];
            if ($scope.articleData.IsVideo === null) {
                $scope.usingVideo = true;
            } else {
                $scope.usingVideo = false;
            }
            
            articleData.getComments().then(function (data) {
                $scope.articleCommentsAll = data.d.results;
                angular.forEach($scope.articleCommentsAll, function (value, key) {
                    if ($scope.articleData.ID === parseInt(value.article)) {
                        $scope.commentsArr.push(value);
                    }
                });
            });

        });

    }

    $scope.updateListLikes = function (id, type, likes) {
        if (type === 'my-news') {
            $scope.listName = 'Lst_My-News';
            $scope.listType = 'SP.Data.Lst_x005f_DidYouKnowListItem';
        } else if (type === 'team-update') {
            $scope.listName = 'Lst_Team-Update';
            $scope.listType = 'SP.Data.Lst_x005f_TeamNewsListItem';
        } else if (type === 'kudos') {
            $scope.listName = 'Lst_Kudos-Celebrations';
            $scope.listType = 'SP.Data.Lst_x005f_KudosCelebrationsListItem';
        } else if (type === 'headline') {
            $scope.listName = 'Lst_Headlines';
            $scope.listType = 'SP.Data.Lst_x005f_HeadlinesListItem';
        } else if (type === 'top-story') {
            $scope.listName = 'Lst_Top-Stories';
            $scope.listType = 'SP.Data.Lst_x005f_TopStoriesListItem';
        }

        $.ajax
            ({
                url: "siteUrl/_api/web/lists/getbytitle('" + $scope.listName + "')/items(" + id + ")",
                type: "POST",
                data: JSON.stringify
                    ({
                        __metadata:
                        {
                            type: $scope.listType
                        },

                        'Likes': likes,
                    }),
                headers:
                {
                    "Accept": "application/json;odata=verbose",
                    "Content-Type": "application/json;odata=verbose",
                    "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                    "X-HTTP-Method": "MERGE",
                    "If-Match": "*"
                },
                success: function (data, status, xhr) {
                    // alert("like added!");
                },
                error: function (xhr, status, error) {
                    alert(JSON.stringify(error));
                }
            });

    }

    $scope.storyData = $localStorage.topStory;
    //console.log("$scope.articleData:: ", $scope.articleData);
    $scope.addLike = function (likes) {
        console.log("button pressed:: ", likes);
        console.log("$scope.articleType:: ", $scope.articleType);
        console.log("$scope.articleData:: ", $scope.articleData);
        if ($scope.articleType == 'top-story') {
            $scope.articleData.Likes = likes + 1;
            $scope.updateListLikes($scope.articleData.ID, 'top-story', $scope.articleData.Likes);
        } else {
            $scope.articleData.Likes = likes + 1;
            $scope.updateListLikes($scope.articleData.ID, $scope.articleType, $scope.articleData.Likes);
        }
    }

    $scope.addComments = function () {
        console.log("button pressed");
        let newDate = new Date();
        $scope.commentArticle = $scope.comment;
        $scope.commentArticleID = $scope.articleData.ID.toString();

        $scope.getUserData = function () {
            return $http({
                url: _spPageContextInfo.webAbsoluteUrl + "/_api/SP.UserProfiles.PeopleManager/GetMyProperties",
                method: "GET",
                headers: { Accept: "application/json; odata=verbose" },
                cache: false,
            }).then(
                function (response) {
                    $localStorage.userDetails.userFullName = response.data.d.DisplayName;
                },
                function (errorThrown) {
                    // Log errors in browsers console if any
                    //console.info('http Request failed in getUserProfileProperties function :' + errorThrown.statusText + ' || ' + errorThrown.responseText);
                }
            );
        };

        $.ajax({
            url: "siteUrl/_api/web/lists/GetByTitle('Lst_comments')/items",
            type: "POST",
            data: JSON.stringify({
                '__metadata': {
                    'type': 'SP.Data.Lst_x005f_commentsListItem'
                },
                'Title': '1',
                'article': $scope.commentArticleID,
                'comment': $scope.commentArticle,
                'commentUser': $localStorage.userDetails.userFullName
            }),
            headers: {
                "accept": "application/json;odata=verbose",
                "content-type": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val()
            },
            success: function (data) {
                console.log(data);
                $scope.commentsArr =[];
                articleData.getComments().then(function (data) {
                    $scope.articleCommentsAll = data.d.results;
                    angular.forEach($scope.articleCommentsAll, function (value, key) {
                        if ($scope.articleData.ID === parseInt(value.article)) {
                            $scope.commentsArr.push(value);
                        }
                    });
                });

            },
            error: function (error) {
                alert(JSON.stringify(error));
            }
        });
    }
});


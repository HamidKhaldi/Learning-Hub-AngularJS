/* Home Controller
====================================================================================================
==================================================================================================*/

scsFamilyApp.controller("newsCtrl", function (scsFamilyData, articleData, $scope, $sce, $http, $state, $stateParams, $localStorage, $window, $filter, $timeout, $q) {
	"use strict";

	$window.scrollTo(0, 0);
	$scope.$sce = $sce;
	$scope.allArticlesArr = [];
	$scope.filterValuesArr = [];
	$scope.filteredArticlesArr = [];

	//Remove value from Array
	$scope.arrayRemove = function (arr, value) {
		return arr.filter(function (ele) {
			return ele != value;
		});
	};

	articleData.getHeadlineData().then(function (data) {
		$scope.headlinesArr = data.d.results;

		articleData.getHeadlineDataTags().then(function (data) {
			$scope.headlinesTagsArr = data.d.results;
			angular.forEach($scope.headlinesArr, function (value, key) {
				let headlineValue = value;
				if (headlineValue.Publish) {
					if (headlineValue.Article_x002d_TopicId) {
						headlineValue.tagArr = [];
						angular.forEach(headlineValue.Article_x002d_TopicId.results, function (value, key) {
							let valueId = value;
							angular.forEach($scope.headlinesTagsArr, function (value, key) {
								if (value.ID == parseInt(valueId)) {
									headlineValue.tagArr.push(value.Title);
								}
							});
						});
					}
					headlineValue.ArticleType = "headline";
					headlineValue.borderColor = "headlines";
					$scope.allArticlesArr.push(value);
				}
			});
		});

		articleData.getMyNewsData().then(function (data) {
			$scope.myNewsArr = data.d.results;
			articleData.getMyNewsDataTags().then(function (data) {
				$scope.myNewsTagsArr = data.d.results;
				$scope.userDetails = $localStorage.userDetails;
				$scope.userInGroup = $scope.userDetails.userInGroup;
				angular.forEach($scope.myNewsArr, function (value, key) {
					let myNewsValue = value;
					if (myNewsValue.Publish) {
						if (myNewsValue.Article_x002d_TopicId) {
							myNewsValue.tagArr = [];
							myNewsValue.tagSubsArr = [];
							angular.forEach(myNewsValue.Article_x002d_TopicId.results, function (value, key) {
								let valueId = value;
								angular.forEach($scope.myNewsTagsArr, function (value, key) {
									if (value.ID == parseInt(valueId)) {
										myNewsValue.tagArr.push(value.Title);
										myNewsValue.tagSubsArr.push({ Title: value.Title, Subscription: value.Subscription });
									}
								});
							});
						}
						myNewsValue.ArticleType = "my-news";
						myNewsValue.borderColor = "my-news";
						$scope.allArticlesArr.push(value);
					}
				});
			});

			articleData.getCelebrationData().then(function (data) {
				$scope.kudosArr = data.d.results;
				articleData.getKudosDataTags().then(function (data) {
					$scope.kudosTagsArr = data.d.results;
					angular.forEach($scope.kudosArr, function (value, key) {
						let kudosValue = value;
						if (kudosValue.Publish) {
							if (kudosValue.Article_x002d_TopicId) {
								kudosValue.tagArr = [];
								angular.forEach(kudosValue.Article_x002d_TopicId.results, function (value, key) {
									let valueId = value;
									angular.forEach($scope.kudosTagsArr, function (value, key) {
										if (value.ID == parseInt(valueId)) {
											kudosValue.tagArr.push(value.Title);
										}
									});
								});
							}

							kudosValue.ArticleType = "kudos";
							kudosValue.borderColor = "kudos";
							$scope.allArticlesArr.push(value);
						}
					});
				});

				articleData.getTeamUpdateData().then(function (data) {
					$scope.updatesArr = data.d.results;
					articleData.getUpdatesDataTags().then(function (data) {
						$scope.updatesTagsArr = data.d.results;

						angular.forEach($scope.updatesArr, function (value, key) {
							let updatesValue = value;
							if (updatesValue.Publish) {
								if (updatesValue.Article_x002d_TopicId) {
									updatesValue.tagArr = [];
									angular.forEach(updatesValue.Article_x002d_TopicId.results, function (value, key) {
										let valueId = value;
										angular.forEach($scope.updatesTagsArr, function (value, key) {
											if (value.ID == parseInt(valueId)) {
												updatesValue.tagArr.push(value.Title);
											}
										});
									});
								}
								updatesValue.ArticleType = "team-update";
								updatesValue.borderColor = "team-update";
								$scope.allArticlesArr.push(value);
							}
						});
						$q.all($scope.allArticlesArr).then(function () {
							let subscribedArticleArr = [];
							angular.forEach($scope.allArticlesArr, function (value, key) {
								let articleValue = value;
								if (articleValue.ArticleType == "my-news") {
									angular.forEach(articleValue.tagSubsArr, function (value, key) {
										if (value.Subscription == "Elective" && $scope.userDetails.ElectiveSubscription.indexOf(value.Title) > -1) {
											subscribedArticleArr.push(articleValue);
										} else if (value.Subscription == "Managed") {
											subscribedArticleArr.push(articleValue);
										}
									});
								} else {
									subscribedArticleArr.push(articleValue);
								}
							});

							angular.forEach($scope.myNewsTagsArr, function (value, key) {
								if (value.Subscription == "Elective" && $scope.userDetails.ElectiveSubscription.indexOf(value.Title) < 0) {
									let tagTitle = value.Title;
									angular.forEach($scope.myNewsTagsArr, function (value, key) {
										if (value.Title == tagTitle) {
											$scope.myNewsTagsArr = $scope.arrayRemove($scope.myNewsTagsArr, value);
										}
									});
								}
							});

							$scope.allArticlesArr = subscribedArticleArr;
							$scope.filteredArticlesArr = $scope.allArticlesArr;
							$scope.filterArticles = function (filterValue) {
								$scope.filterValuesArr.indexOf(filterValue) == -1 ? $scope.filterValuesArr.push(filterValue) : ($scope.filterValuesArr = $scope.arrayRemove($scope.filterValuesArr, filterValue));
								if ($scope.filterValuesArr.length == 0) {
									$scope.filteredArticlesArr = $scope.allArticlesArr;
								} else {
									$scope.filteredArticlesArr = [];
									angular.forEach($scope.allArticlesArr, function (value, key) {
										let articleValue = value;
										if (articleValue.tagArr.length > 0) {
											angular.forEach(articleValue.tagArr, function (value, key) {
												if ($scope.filterValuesArr.indexOf(value) > -1) {
													$scope.filteredArticlesArr.push(articleValue);
												}
											});
										}
									});
								}
							};

							$scope.filteredArticlesArr = $scope.filteredArticlesArr.sort((a, b) => (new Date(b.Date).getTime() > new Date(a.Date).getTime() ? 1 : -1));

							$scope.getArticle = function (id, type) {
								angular.forEach($scope.allArticlesArr, function (value, key) {
									if (value.ID == id && value.ArticleType == type) {
										$localStorage.articleData = value;
									}
								});
							};
						});
						$localStorage.allArticleArr = $scope.allArticlesArr;
					});
				});
			});
		});
	});
});

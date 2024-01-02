/* Home Controller
====================================================================================================
==================================================================================================*/

scsFamilyApp.controller("homeCtrl", function (scsFamilyData, articleData, $scope, $sce, $http, $state, $stateParams, $localStorage, $window, $filter, $timeout, $q) {
	"use strict";

	$window.scrollTo(0, 0);
	$scope.$sce = $sce;
	$scope.experienceArr = [];
	$scope.displayClass = "hide-section";
	$localStorage.sessionData = {};
	$scope.allArticlesArr = [];
	$scope.tickedFiltersArr = [];
	$scope.filteredArticlesArr = [];
	$scope.modalMessage = "";

	$scope.arrayRemove = function (arr, value) {
		return arr.filter(function (ele) {
			return ele != value;
		});
	};

	$scope.removeDuplicates = function (myArray) {
		var newArray = [];
		for (var i = 0; i < myArray.length; i++) {
			if (newArray.indexOf(myArray[i]) == -1) {
				newArray.push(myArray[i]);
			}
		}
		return newArray;
	};

	$scope.checkMemberGroups = function (userGroup) {
		let absoluteUri = "siteUrl/",
			userInGroup = false;

		$.ajax({
			async: false,
			headers: {
				accept: "application/json; odata=verbose",
			},
			method: "GET",
			url: absoluteUri + "_api/Web/CurrentUser/Groups",
			success: function (data) {
				for (var i = 0; i < data.d.results.length; i++) {
					if (data.d.results[i].Title == userGroup) {
						userInGroup = true;
					}
				}
			},
			error: function (response) {
				//console.log(response.status);
			},
		});
		$scope.userInGroup = userInGroup;
		return $scope.userInGroup;
	};

	$scope.getUserData = function () {
		return $http({
			url: _spPageContextInfo.webAbsoluteUrl + "/_api/SP.UserProfiles.PeopleManager/GetMyProperties",
			method: "GET",
			headers: { Accept: "application/json; odata=verbose" },
			cache: false,
		}).then(
			function (response) {
				$localStorage.userDetails.userID = _spPageContextInfo.userId;
				$localStorage.userDetails.userFullName = response.data.d.DisplayName;
				$localStorage.userDetails.userEmail = response.data.d.Email;
				$localStorage.userDetails.userTitle = response.data.d.Title;
				$localStorage.userDetails.userInGroup = $scope.checkMemberGroups("Engagement & Messaging Leads");

				scsFamilyData.getSubscriptionData($localStorage.userDetails.userEmail).then(function (data) {
					if (data.d.results.length > 0) {
						$localStorage.userDetails.ElectiveSubscription = JSON.parse(data.d.results[0]["Elective_x002d_Subscription"]);
						$localStorage.userDetails.subscriptionListId = data.d.results[0]["ID"];
						$localStorage.userDetails.existingUser = true;
					} else {
						$localStorage.userDetails.existingUser = false;
					}
					$scope.userDetails = $localStorage.userDetails;
					$scope.userInGroup = $localStorage.userDetails.userInGroup;
					$scope.getAllData();
				});
			},
			function (errorThrown) {
				// Log errors in browsers console if any
				//console.info('http Request failed in getUserProfileProperties function :' + errorThrown.statusText + ' || ' + errorThrown.responseText);
			}
		);
	};

	$scope.getAllData = function () {
		$scope.showPersonalisation = function () {
			$scope.displayClass = "";
		};

		$scope.hidePersonalisation = function () {
			$scope.displayClass = "hide-section";
			setTimeout(function () {
				$localStorage.userDetails.ElectiveSubscription = $scope.userDetails.ElectiveSubscription;
				if ($scope.userDetails.existingUser == true) {
					$.ajax({
						url: _spPageContextInfo.siteAbsoluteUrl + "/Family/_api/web/lists/getbytitle('Lst_Subscriptions')/items(" + $scope.userDetails.subscriptionListId + ")",
						type: "POST",
						data: JSON.stringify({
							__metadata: {
								type: "SP.Data.Lst_x005f_SubscriptionsListItem",
							},

							Elective_x002d_Subscription: JSON.stringify($scope.userDetails.ElectiveSubscription),
						}),
						headers: {
							Accept: "application/json;odata=verbose",
							"Content-Type": "application/json;odata=verbose",
							"X-RequestDigest": $("#__REQUESTDIGEST").val(),
							"X-HTTP-Method": "MERGE",
							"If-Match": "*",
						},
						success: function (data, status, xhr) {
							//console.log('data sent ', data);
							// $('#newsLetterModal'). modal('show');
							// $scope.modalMessage = "Your subscription has been successfully updated!'";
							// $scope.resetFields();
							// $scope.$apply();
						},
						error: function (xhr, status, error) {
							// $scope.modalMessage = 'There appears to be an issue in updating your subscription, please refresh the page and submit again.';
							// $('#newsLetterModal').modal('show');
						},
					});
				} else {
					$.ajax({
						url: _spPageContextInfo.siteAbsoluteUrl + "/Family/_api/web/lists/getbytitle('Lst_Subscriptions')/items",
						type: "POST",
						data: JSON.stringify({
							__metadata: {
								type: "SP.Data.Lst_x005f_SubscriptionsListItem",
							},

							Title: $scope.userDetails.userFullName,
							Email: $scope.userDetails.userEmail,
							Elective_x002d_Subscription: JSON.stringify($scope.userDetails.ElectiveSubscription),
						}),
						headers: {
							Accept: "application/json;odata=verbose",
							"Content-Type": "application/json;odata=verbose",
							"X-RequestDigest": $("#__REQUESTDIGEST").val(),
							"X-HTTP-Method": "POST",
						},
						success: function (data, status, xhr) {
							//console.log('data sent ', data);
							// $('#newsLetterModal'). modal('show');
							// $scope.modalMessage = "Your subscription has been successfully updated!'";
							// $scope.resetFields();
							// $scope.$apply();
						},
						error: function (xhr, status, error) {
							// $scope.modalMessage = 'There appears to be an issue in updating your subscription, please refresh the page and submit again.';
							// $('#newsLetterModal').modal('show');
							console.log("submission error ", error);
						},
					});
				}
			}, 800);
		};

		$q.all($scope.userDetails).then(function () {
			articleData.getTopStoriesData().then(function (data) {
				$scope.topStoriesArr = data.d.results;

				articleData.getAttachmentsData().then(function (data) {
					$scope.attachmentsArr = data.d.results;
				});

				$scope.getTopStory = function (id) {
					angular.forEach($scope.topStoriesArr, function (value, key) {
						if (value.ID == id) {
							$localStorage.articleData = value;
						}
					});

					if ($localStorage.articleData.Attachment_x002d_FilesId) {
						$localStorage.articleData.AttachArr = [];
						angular.forEach($localStorage.articleData.Attachment_x002d_FilesId.results, function (value, key) {
							let attachID = value;
							angular.forEach($scope.attachmentsArr, function (value, key) {
								if (value.ID == attachID) {
									let attachObj = {
										Title: value.Title,
										Link: value.Attachment_x002d_Link.Url,
									};
									$localStorage.articleData.AttachArr.push(attachObj);
								}
							});
						});
					}
					$scope.storyData = $localStorage.articleData;
				};
			});

			articleData.getHeadlineData().then(function (data) {
				$scope.headlinesArr = data.d.results;
				articleData.getHeadlineDataTags().then(function (data) {
					$scope.headlinesTagsArr = data.d.results;
					$scope.tickedFiltersArr = $scope.tickedFiltersArr.concat($scope.headlinesTagsArr);

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
							$scope.allArticlesArr.push(headlineValue);
						}
					});

					articleData.getMyNewsData().then(function (data) {
						$scope.myNewsArr = data.d.results;
						articleData.getMyNewsDataTags().then(function (data) {
							$scope.myNewsTagsData = data.d.results;
							$scope.myNewsTagsArr = [];
							if ($scope.userDetails.ElectiveSubscription && $scope.userDetails.ElectiveSubscription.length > 0) {
								console.log("user exists");
								angular.forEach($scope.userDetails.ElectiveSubscription, function (value, key) {
									let subsValue = value;
									angular.forEach($scope.myNewsTagsData, function (value, key) {
										if (value.Title == subsValue) {
											value.inputClass = "scs__mandatory-sub-input";
											$scope.tickedFiltersArr.push(value);
										} else {
											value.inputClass = "";
										}
									});
								});
								angular.forEach($scope.myNewsTagsData, function (value, key) {
									let tagValue = value;
									if (tagValue.Subscription == "Elective") {
										if ($scope.userDetails.ElectiveSubscription.indexOf(tagValue.Title) > -1) {
											tagValue.inputClass = "scs__mandatory-sub-input";
											$scope.tickedFiltersArr.push(tagValue);
										} else {
											tagValue.inputClass = "";
										}
										$scope.myNewsTagsArr.push(tagValue);
									}
									if (tagValue.Subscription == "Managed") {
										tagValue.inputClass = "scs__mandatory-sub-input";
										$scope.myNewsTagsArr.push(tagValue);
										$scope.tickedFiltersArr.push(tagValue);
									}
								});
							} else {
								console.log("user doesnt exist");
								$scope.userDetails.ElectiveSubscription = [];
								angular.forEach($scope.myNewsTagsData, function (value, key) {
									if (value.Subscription == "Elective") {
										if (value.Subscribed_x002d_By_x002d_Defaul == false) {
											value.inputClass = "";
										} else {
											value.inputClass = "scs__mandatory-sub-input";
											$scope.tickedFiltersArr.push(value);
											$scope.userDetails.ElectiveSubscription.push(value.Title);
										}
										$scope.myNewsTagsArr.push(value);
									}
									if (value.Subscription == "Managed" && $scope.userInGroup) {
										$scope.myNewsTagsArr.push(value);
										$scope.tickedFiltersArr.push(value);
									}
								});
							}

							$q.all($scope.myNewsTagsArr).then(function () {
								angular.forEach($scope.myNewsArr, function (value, key) {
									let myNewsValue = value;
									if (myNewsValue.Publish) {
										if (myNewsValue.Article_x002d_TopicId) {
											myNewsValue.tagArr = [];
											angular.forEach(myNewsValue.Article_x002d_TopicId.results, function (value, key) {
												let valueId = value;
												angular.forEach($scope.myNewsTagsArr, function (value, key) {
													if (value.ID == parseInt(valueId)) {
														myNewsValue.tagArr.push(value.Title);
													}
												});
											});
										}
										myNewsValue.ArticleType = "my-news";
										myNewsValue.borderColor = "my-news";
										$scope.allArticlesArr.push(myNewsValue);
									}
								});
								articleData.getCelebrationData().then(function (data) {
									$scope.kudosArr = data.d.results;
									articleData.getKudosDataTags().then(function (data) {
										$scope.kudosTagsArr = data.d.results;
										$scope.tickedFiltersArr = $scope.tickedFiltersArr.concat($scope.kudosTagsArr);
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
												$scope.allArticlesArr.push(kudosValue);
											}
										});
										articleData.getTeamUpdateData().then(function (data) {
											$scope.updatesArr = data.d.results;
											articleData.getUpdatesDataTags().then(function (data) {
												$scope.updatesTagsArr = data.d.results;
												$scope.tickedFiltersArr = $scope.tickedFiltersArr.concat($scope.updatesTagsArr);

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
														$scope.allArticlesArr.push(updatesValue);
													}
												});
												$q.all($scope.allArticlesArr).then(function () {
													setTimeout(function () {
														$(".scs__mandatory-sub-input").prop("checked", true);
													}, 500);

													angular.forEach($scope.allArticlesArr, function (value, key) {
														let articleValue = value;
														angular.forEach($scope.tickedFiltersArr, function (value, key) {
															if (articleValue.tagArr && articleValue.tagArr.indexOf(value.Title) > -1 && $scope.filteredArticlesArr.indexOf(articleValue) == -1) {
																$scope.filteredArticlesArr.push(articleValue);
															}
														});
													});

													$scope.filteredArticlesArr = $scope.filteredArticlesArr.sort((a, b) => (new Date(b.Date).getTime() > new Date(a.Date).getTime() ? 1 : -1));

													$scope.updateSubscription = function (filterValue) {
														$scope.userDetails.ElectiveSubscription.indexOf(filterValue.Title) > -1
															? ($scope.userDetails.ElectiveSubscription = $scope.arrayRemove($scope.userDetails.ElectiveSubscription, filterValue.Title))
															: $scope.userDetails.ElectiveSubscription.push(filterValue.Title);
													};

													$scope.filterArticles = function (filterValue) {
														$scope.tickedFiltersArr.indexOf(filterValue) == -1 ? $scope.tickedFiltersArr.push(filterValue) : ($scope.tickedFiltersArr = $scope.arrayRemove($scope.tickedFiltersArr, filterValue));
														if ($scope.tickedFiltersArr.length == 0) {
															$scope.filteredArticlesArr = $scope.allArticlesArr;
														} else {
															$scope.filteredArticlesArr = [];
															angular.forEach($scope.allArticlesArr, function (value, key) {
																let articleValue = value;
																angular.forEach($scope.tickedFiltersArr, function (value, key) {
																	if (articleValue.tagArr && articleValue.tagArr.indexOf(value.Title) > -1 && $scope.filteredArticlesArr.indexOf(articleValue) == -1) {
																		$scope.filteredArticlesArr.push(articleValue);
																	}
																});
															});
														}
													};

													$scope.getArticle = function (id, type) {
														angular.forEach($scope.allArticlesArr, function (value, key) {
															if (value.ID == id && value.ArticleType == type) {
																$localStorage.articleData = value;
															}
														});
														//console.log('local storage in home', $localStorage.articleData);
													};
												});
											});
										});
									});
								});
							});
						});
					});
				});
			});

			scsFamilyData.getCalendarData().then(function (data) {
				let filteredList = data.d.results.filter((event) => new Date().getTime() < new Date(event.EventDate).getTime());
				$scope.eventsArr = filteredList.sort((a, b) => (new Date(a.EventDate).getTime() > new Date(b.EventDate).getTime() ? 1 : -1));
				//console.log("Calendar events: ", $scope.eventsArr);
			});
		});
	};
});

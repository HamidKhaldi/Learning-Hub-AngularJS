/* Newsletter Controller
====================================================================================================
==================================================================================================*/

scsFamilyApp.controller("submitArticleCtrl", function (scsFamilyData, articleData, $scope, $sce, $http, $state, $stateParams, $localStorage, $window, $filter, $timeout, $q) {
	"use strict";

	$window.scrollTo(0, 0);
	$scope.$sce = $sce;
	$scope.user = {};
	$localStorage.userDetails = {};
	$scope.displayName = "";
	$scope.jobTitle = "";
	$scope.editorialText = "";
	$scope.modalMessage = "";
	$scope.missingValues = true;
	$("#newsLetterTextArea").readonly = false;
	$scope.successUploadedArr = [];
	$scope.fileArrLength = 0;
	$scope.filePickerClass = "";
	$scope.uploadedFilesClass = "hide-asset";
	$scope.uploadedFilesHtml = "";
	$('.tox-statusbar__path').css('display', 'none');

	$("#filePicker").on("change", function () {
		if ($(this).val()) {
			$("#upload-button").removeClass("hide-asset");
		}
	});

	$scope.resetFields = function () {
		$scope.articleType = undefined;
		$scope.articleTopic = undefined;
		$scope.articleTitle = undefined;
		$scope.articleSubTitle = undefined;
		$scope.articleText = undefined;
		$scope.successUploadedArr = [];
		$scope.fileArrLength = 0;
		$scope.filePickerClass = "";
		$scope.uploadedFilesHtml = "";
		$("#filePicker").val("");
		$("#file-picker-cont").removeClass("hide-asset");
		$("#uploaded-files-cont").addClass("hide-asset");
		$("#uploaded-files-list").empty();
	};

	$scope.tinymceOptions = {
		plugins: "link image code",
		readonly: false,
		plugins: "lists",
		lists_indent_on_tab: false,
		browser_spellcheck : true,
		plugins: "lists, link, table",
		toolbar: "undo redo | bold italic | numlist bullist | alignleft aligncenter alignright | code",
		// toolbar: 'table tabledelete | tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol'
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
				});
			},
			function (errorThrown) {
				// Log errors in browsers console if any
				//console.info('http Request failed in getUserProfileProperties function :' + errorThrown.statusText + ' || ' + errorThrown.responseText);
			}
		);
	};

	articleData.getMyNewsData().then(function (data) {
		//console.log('my news ', data.d.results);
	});

	articleData.getCelebrationData().then(function (data) {
		//console.log('kudos-celebrations ', data.d.results);
	});

	articleData.getTeamUpdateData().then(function (data) {
		//console.log('team updates ', data.d.results);
	});

	articleData.getHeadlineData().then(function (data) {
		$scope.headlinesArr = data.d.results;
	});

	articleData.getHeadlineDataTags().then(function (data) {
		$scope.headlinesTagsArr = data.d.results;
	});

	articleData.getMyNewsDataTags().then(function (data) {
		$scope.userDetails = $localStorage.userDetails;
		//console.log('$scope.userDetails ', $scope.userDetails);
		setTimeout(() => {
			if ($scope.userDetails.userInGroup) {
				$scope.myNewsTagsArr = data.d.results;
			} else {
				$scope.myNewsTagsArr = [];
				angular.forEach(data.d.results, function (value, key) {
					if (value.Subscription == "Elective") {
						$scope.myNewsTagsArr.push(value);
					}
				});
			}
		}, 800);
	});

	articleData.getKudosDataTags().then(function (data) {
		$scope.kudosTagsArr = data.d.results;
	});

	articleData.getUpdatesDataTags().then(function (data) {
		$scope.updatesTagsArr = data.d.results;
	});

	$scope.setArticleType = function (type) {
		$scope.topicArr = [];
		if (type === "my-news") {
			$scope.topicArr = $scope.myNewsTagsArr;
			$scope.listName = "Lst_My-News";
			$scope.listType = "SP.Data.Lst_x005f_DidYouKnowListItem";
		} else if (type === "team-update") {
			$scope.topicArr = $scope.updatesTagsArr;
			$scope.listName = "Lst_Team-Update";
			$scope.listType = "SP.Data.Lst_x005f_TeamNewsListItem";
		} else if (type === "kudos") {
			$scope.topicArr = $scope.kudosTagsArr;
			$scope.listName = "Lst_Kudos-Celebrations";
			$scope.listType = "SP.Data.Lst_x005f_KudosCelebrationsListItem";
		} else if (type === "headline") {
			$scope.topicArr = $scope.headlinesTagsArr;
			$scope.listName = "Lst_Headlines";
			$scope.listType = "SP.Data.Lst_x005f_HeadlinesListItem";
		}
		$scope.articleType = type;
		$(".scs__submit-article-select").attr("disabled", false);
	};

	$scope.uploadFile = function () {
		// console.log("files ", $("#filePicker")[0].files);

		let fileArr = [];
		$scope.assetFilesArr = [];

		for (var file in $("#filePicker")[0].files) {
			fileArr.push($("#filePicker")[0].files[file]);
		}

		fileArr.length = fileArr.length - 2;
		$scope.fileArrLength += fileArr.length;

		for (let i = 0; i < fileArr.length; i++) {
			var reader = new FileReader();
			reader.readAsArrayBuffer(fileArr[i]);
			reader.onloadend = function (e) {
				let fileName = fileArr[i].name;
				var strAjaxUrl = "siteUrl/_api/web/lists/getByTitle('Documents')/RootFolder/files/Add(url='" + fileName + "',overwrite=true)";
				sprLib
					.rest({
						type: "POST",
						url: strAjaxUrl,
						data: e.target.result,
					})
					.then(function (arr) {
						$scope.assetFilesArr.push(arr[0].Name);
						$scope.successUploadedArr.push({ FileName: arr[0].Name, FileUrl: arr[0].ServerRelativeUrl });
					})
					.catch(function (strErr) {
						//console.error(strErr);
					});
			};
			reader.onerror = function (e) {
				alert(e.target.error.responseText);
				//console.error(e.target.error);
			};
		}
		$scope.refreshIntervalId = setInterval(function () {
			if ($scope.assetFilesArr.length > 0) {
				for (var l = 0; l < $scope.assetFilesArr.length; l++) {
					$("#uploaded-files-list").append('<li class="scs__uploaded-files-list--item">' + $scope.assetFilesArr[l] + "</li>");
				}
			}

			if ($scope.successUploadedArr.length == $scope.fileArrLength) {
				$scope.uploadedFilesHtml = "";
				$scope.uploadedFilesHtml += "<ul>";
				for (var k = 0; k < $scope.successUploadedArr.length; k++) {
					$scope.uploadedFilesHtml += "<li><a href='" + $scope.successUploadedArr[k].FileUrl + "' target='_blank'>" + $scope.successUploadedArr[k].FileName + "</a></li>";
				}
				$scope.uploadedFilesHtml += "</ul>";
				$("#file-picker-cont").addClass("hide-asset");
				$("#uploaded-files-cont").removeClass("hide-asset");
				clearInterval($scope.refreshIntervalId);
			}
		}, 1000);
	};

	$scope.submitArticle = function () {
		$scope.inputValues = [$scope.articleType, $scope.articleType, $scope.articleType, $scope.articleType, $scope.articleTopic, $scope.articleTitle, $scope.articleSubTitle, $scope.articleText];
		if ($scope.articleTopic != undefined) {
			angular.forEach($scope.topicArr, function (value, key) {
				if (value.Title == $scope.articleTopic) {
					$scope.articleTopicId = value.ID;
				}
			});
		}

		if ($scope.inputValues.includes(undefined)) {
			$scope.missingValues = true;
			for (let input in $scope.inputValues) {
				if ($scope.inputValues[input] === undefined) {
					$(".scs__article-form-control").eq(input).addClass("red-border");
					if (input == 4) {
						$(".scs__assets-file-picker").addClass("red-border");
					}
					if (input == 7) {
						$(".tox").addClass("red-border");
					}
				} else {
					$(".scs__article-form-control").eq(input).removeClass("red-border");
					if (input == 4) {
						$(".scs__assets-file-picker").removeClass("red-border");
					}
					if (input == 7) {
						$(".tox").removeClass("red-border");
					}
				}
			}
		} else {
			$scope.missingValues = false;
			$(".scs__article-form-control").removeClass("red-border");
			$(".tox").removeClass("red-border");
		}

		if (!$scope.missingValues) {
			$(".scs__article-form-control").removeClass("red-border");
			$.ajax({
				url: "siteUrl/_api/web/lists/getbytitle('" + $scope.listName + "')/items",
				type: "POST",
				data: JSON.stringify({
					__metadata: {
						type: $scope.listType,
					},

					Title: $scope.articleTitle,
					Sub_x002d_Title: $scope.articleSubTitle,
					Submitted_x002d_By: $scope.userDetails.userFullName,
					Main_x002d_Content: $scope.articleText,
					Article_x002d_TopicId: { results: [$scope.articleTopicId] },
					Attachment_x002d_Files: $scope.uploadedFilesHtml,
				}),
				headers: {
					Accept: "application/json;odata=verbose",
					"Content-Type": "application/json;odata=verbose",
					"X-RequestDigest": $("#__REQUESTDIGEST").val(),
					"X-HTTP-Method": "POST",
				},
				success: function (data, status, xhr) {
					//console.log('data sent ', data);
					$("#newsLetterModal").modal("show");
					$scope.modalMessage = "Your article '" + $scope.articleTitle + "' has been submitted successfully!'";
					setTimeout(function () {
						$("#newsLetterModal").modal("hide");
						$state.go('home', {notify: true});
					}, 1500);
					
					// window.location.replace("siteUrl/SitePages/Family-Home.aspx");
					$scope.resetFields();
					$scope.$apply();
				},
				error: function (xhr, status, error) {
					$scope.modalMessage = "There appears to be an issue in submitting your article, please refresh the page and submit again.";
					$("#newsLetterModal").modal("show");
				},
			});
		} else {
			$("#newsLetterModal").modal("show");
			$scope.modalMessage = "Some required fields are missing. Please complete and Submit again";
		}
	};
});

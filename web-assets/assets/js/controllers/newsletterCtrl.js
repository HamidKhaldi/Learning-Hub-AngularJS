/* Newsletter Controller
====================================================================================================
==================================================================================================*/

scsFamilyApp.controller("newsletterCtrl", function (articleData, $scope, $sce, $http, $state, $stateParams, $localStorage, $window, $filter, $timeout, $q) {
	"use strict";

	$window.scrollTo(0, 0);
	$scope.$sce = $sce;
	$scope.user = {};
	// $localStorage.userDetails = {};
	$scope.displayName = "";
	$scope.jobTitle = "";
	$scope.editorialText = "";
	$scope.modalMessage = "";
	$scope.missingValues = true;
	$("#newsLetterTextArea").readonly = false;
	$(".tox-statusbar__text-container").css("display", "none !important");

	console.log('$localStorage.userDetails ', $localStorage.userDetails);

	$scope.tinymceOptions = {
		plugins: "link image code",
		readonly: false,
		plugins: "lists",
		lists_indent_on_tab: false,
		plugins: "link",
		toolbar: "undo redo | bold italic | numlist bullist | alignleft aligncenter alignright | code",
	};

	articleData.getTopStoriesData().then(function (data) {
		//$scope.servicesArr = data.d.results;
		console.log("top stories data", data.d.results);
		$scope.topStoriesArr = data.d.results;
		$scope.topStoriesArr = $scope.topStoriesArr.sort(function (a, b) {
			return b.ID - a.ID;
		});
		//$scope.topStoriesArr = $filter("limitTo")($scope.topStoriesArr, 3, 0);

		$scope.topStoriesList = "";
		angular.forEach($scope.topStoriesArr, function (value, key) {
			$scope.topStoriesList +=
				"<tr><td style='padding:30px 30px 15px;'><div class='col-sml' style='display:inline-block;width:25%;max-width:145px;vertical-align:top;text-align:left;font-family:Arial,sans-serif;font-size:14px;color:#363636;'><img src='" + value.Image.Url + "' width='115' style='width:115px;max-width:80%;margin-bottom:20px;'></div><div class='col-lge' style='display:inline-block;width:70%;max-width:395px;vertical-align:top;padding-bottom:20px;font-family:Arial,sans-serif;font-size:16px;line-height:22px;color:#363636;'><p style='padding: 1rem; text-decoration: none; margin-bottom: 1rem; font-family: 'Helvetica Neue', Helvetica, Arial, Sans-serif;'>" +
				value.Title +
				"</p><p><a href='siteUrl/SitePages/Family-Home.aspx/Top-Stories/" +
				value.Title +
				"' target='_blank' style='padding: 1rem; text-decoration: underline; margin-bottom: 1rem; font-family:Arial,sans-serif;font-size:16px;color:#363636;font-weight: bold;'>Read more</a></p></div></td></tr>";
		});

		//console.log('topStoriesList ', $scope.topStoriesList);
	});

	articleData.getMyNewsData().then(function (data) {
		//$scope.servicesArr = data.d.results;
		console.log("did you know data", data.d.results);

		$scope.didYouKnowArr = data.d.results;
		$scope.didYouKnowArr = $scope.didYouKnowArr.sort(function (a, b) {
			return b.ID - a.ID;
		});
		//$scope.didYouKnowArr = $filter("limitTo")($scope.didYouKnowArr, 3, 0);

		$scope.didYouKnowList = "";
		angular.forEach($scope.didYouKnowArr, function (value, key) {
			$scope.didYouKnowList +=
			"<tr><td style='background-color:#F6F6FA;padding:0px 30px 10px;'><p style='padding: 10px 0 3px; text-decoration: none; margin-bottom: 0; font-family: 'Helvetica Neue', Helvetica, Arial, Sans-serif;'>" +
			value.Title +
			"</p><p style='padding: 0 !important; line-height:10px; text-decoration: none; margin: 0 !important; font-family: 'Helvetica Neue', Helvetica, Arial, Sans-serif;'>" + value.Sub_x002d_Title + "</p><a href='siteUrl/SitePages/Family-Home.aspx/News/my-news/" +
			value.Title +
			"' target='_blank' style='padding: 0; text-decoration: underline; margin-bottom: 15px; line-height:16px;font-family:Arial,sans-serif;font-size:15px;color:#363636;font-weight: bold;'>Find out more</a></td></tr>";
		});
	});

	articleData.getTeamUpdateData().then(function (data) {
		$scope.teamNewsArr = data.d.results;
		$scope.teamNewsArr = $scope.teamNewsArr.sort(function (a, b) {
			return b.ID - a.ID;
		});
		//$scope.teamNewsArr = $filter("limitTo")($scope.teamNewsArr, 3, 0);

		$scope.teamNewsList = "";
		angular.forEach($scope.teamNewsArr, function (value, key) {
			$scope.teamNewsList +=
			"<tr><td style='background-color:#F6F6FA;padding:0px 30px 10px;'><p style='padding: 10px 0 3px; line-height:16px;text-decoration: none; margin-bottom: 0; font-family: 'Helvetica Neue', Helvetica, Arial, Sans-serif;'>" +
			value.Title +
			"</p><p style='padding: 0 !important; line-height:10px; text-decoration: none; margin: 0 !important; font-family: 'Helvetica Neue', Helvetica, Arial, Sans-serif;'>" + value.Sub_x002d_Title + "</p><a href='siteUrl/SitePages/Family-Home.aspx/News/team-update/" +
			value.Title +
			"' target='_blank' style='padding: 0; text-decoration: underline; margin-bottom: 15px; line-height:16px;font-family:Arial,sans-serif;font-size:15px;color:#363636;font-weight: bold;'>Find out more</a></td></tr>";
		});
	});

	articleData.getCelebrationData().then(function (data) {
		$scope.celebrationArr = data.d.results;
		$scope.celebrationArr = $scope.celebrationArr.sort(function (a, b) {
			return b.ID - a.ID;
		});
		//$scope.celebrationArr = $filter("limitTo")($scope.celebrationArr, 3, 0);

		$scope.celebrationKudosList = "";
		angular.forEach($scope.celebrationArr, function (value, key) {
			$scope.celebrationKudosList +=
			"<tr><td style='background-color:#F6F6FA;padding:0px 30px 10px;'><p style='padding: 10px 0 3px; line-height:16px;text-decoration: none; margin-bottom: 0; font-family: 'Helvetica Neue', Helvetica, Arial, Sans-serif;'>" +
			value.Title +
			"</p><p style='padding: 0 !important; line-height:10px; text-decoration: none; margin: 0 !important; font-family: 'Helvetica Neue', Helvetica, Arial, Sans-serif;'>" + value.Sub_x002d_Title + "</p><a href='siteUrl/SitePages/Family-Home.aspx/News/kudos/" +
			value.Title +
			"' target='_blank' style='padding: 0; text-decoration: underline; margin-bottom: 15px; line-height:16px;font-family:Arial,sans-serif;font-size:15px;color:#363636;font-weight: bold;'>Find out more</a></td></tr>";
		});
	});

	articleData.getHeadlineData().then(function (data) {
		$scope.headlinesArr = data.d.results;		
		$scope.headlinesArr = $scope.headlinesArr.sort(function (a, b) {
			return b.ID - a.ID;
		});

		console.log('$scope.headlinesArr ', $scope.headlinesArr);
		//$scope.celebrationArr = $filter("limitTo")($scope.celebrationArr, 3, 0);

		$scope.headlinesList = "";
		angular.forEach($scope.headlinesArr, function (value, key) {
			$scope.headlinesList +=
			"<tr><td style='background-color:#F6F6FA;padding:0px 30px 10px;'><p style='padding: 10px 0 3px; line-height:16px;text-decoration: none; margin-bottom: 0; font-family: 'Helvetica Neue', Helvetica, Arial, Sans-serif;'>" +
			value.Title +
			"</p><p style='padding: 0 !important; line-height:10px; text-decoration: none; margin: 0 !important; font-family: 'Helvetica Neue', Helvetica, Arial, Sans-serif;'>" + value.Sub_x002d_Title + "</p><a href='siteUrl/SitePages/Family-Home.aspx/News/headline/" +
			value.Title +
			"' target='_blank' style='padding: 0; text-decoration: underline; margin-bottom: 15px; line-height:16px;font-family:Arial,sans-serif;font-size:15px;color:#363636;font-weight: bold;'>Find out more</a></td></tr>";
		});
	});

	articleData.getNewsletterData().then(function(data){
	    console.log('newsletter data', data.d.results);
	});

	$scope.submitEditorial = function (displayName, jobTitle, editorialText) {
		$scope.inputValues = [displayName, jobTitle, editorialText];
		if ($scope.inputValues.includes("")) {
			$scope.missingValues = true;
			for (let input in $scope.inputValues) {
				if ($scope.inputValues[input] == "") {
					$(".scs__newsletter-form-control").eq(input).addClass("red-border");
					if (input == 2 && $scope.inputValues[2] == "") {
						$(".tox").addClass("red-border");
					}
				} else {
					$(".scs__newsletter-form-control").eq(input).removeClass("red-border");
					if (input == 2 && $scope.inputValues[2] != "") {
						$(".tox").removeClass("red-border");
					}
				}
			}
		} else {
			$scope.missingValues = false;
			$(".scs__newsletter-form-control").removeClass("red-border");
			$(".tox").removeClass("red-border");
		}

		if (!$scope.missingValues) {
			jQuery(".scs__newsletter-form-control").removeClass("red-border");
			$.ajax({
				url: "siteUrl/_api/web/lists/getbytitle('Newsletter')/items",
				type: "POST",
				data: JSON.stringify({
					__metadata: {
						type: "SP.Data.NewsletterListItem",
					},

					Title: displayName,
					Job_x0020_Title: jobTitle,
					Description: editorialText,
					Top_x002d_Stories_x002d_Articles: $scope.topStoriesList,
					Did_x002d_You_x002d_Know_x002d_A: $scope.didYouKnowList,
					Team_x002d_News_x002d_Articles: $scope.teamNewsList,
					Kudos_x002d_Celebration_x002d_Ar: $scope.celebrationKudosList,
					Headline_x002d_Articles: $scope.headlinesList,
					Editor_x002d_Email: $localStorage.userDetails.userEmail
				}),
				headers: {
					Accept: "application/json;odata=verbose",
					"Content-Type": "application/json;odata=verbose",
					"X-RequestDigest": $("#__REQUESTDIGEST").val(),
					"X-HTTP-Method": "POST",
				},
				success: function (data, status, xhr) {
					console.log("data sent ", data);
					$("#newsLetterModal").modal("show");
					$scope.modalMessage = "Your editorial has been submitted successfully!";
					$scope.displayName = "";
					$scope.jobTitle = "";
					$scope.editorialText = "";
					$scope.$apply();
					setTimeout(function () {
						$("#newsLetterModal").modal("hide");
						$state.go('home', {notify: false});
					}, 4000);
				},
				error: function (xhr, status, error) {
					$scope.modalMessage = "There appears to be an issue in submitting your editorial, please refresh the page and submit again.";
					$("#newsLetterModal").modal("show");
				},
			});
		} else {
			$("#newsLetterModal").modal("show");
			$scope.modalMessage = "Some required fields are missing. Please complete and Submit again";
		}
	};
});

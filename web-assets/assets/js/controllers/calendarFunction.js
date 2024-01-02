$scope.getCalendarData = function () {
	return $http
		.get("siteUrl/_api/web/lists/getByTitle('Events-Calendar')/items?$select=*", {
			headers: { Accept: "application/json;odata=verbose" },
		})
		.then(function (response) {
			return response.data.sort((a, b) => b - a);
		});
};

$scope.loadEvents = function () {
	$scope.getCalendarData().then(function (data) {
		// console.log('eventsData new', data.d.results);
		$scope.eventSource = createRandomEvents();
	});
};

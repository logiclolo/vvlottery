function query_donator(scope, http)
{
	http.get('/lottery/donator/').
	success(function(data) {
		scope.loaddata = false;
		if (data.status == 'ok')
		{
			if (data.data.length == 0)
			{
				scope.donators = null;
				scope.nodata = true;
			}
			else
			{
				scope.donators = data.data;
				scope.nodata = false;
			}
		}
		else if (data.status == 'error')
		{
			scope.donators = null;
			scope.nodata = true;
		}
	}).
	error(function (data, status, headers, config) {
		var msg = data || errmsg("Connection failure");
		alert(msg + "\n" + config.url);
	});
}

function donator_ctrl($scope, $http)
{
	$scope.nodata = false;
	$scope.loaddata = true;
	query_donator($scope, $http);
}

function query_prize_all(scope, http)
{
	http.get('/lottery/prize/').
	success(function(data) {
		scope.loaddata = false;
		if (data.status == 'ok')
		{
			if (data.data.length == 0)
			{
				scope.prizes = null;
				scope.nodata = true;
			}
			else
			{
				scope.prizes = data.data;
				scope.nodata = false;

				prize_count(scope, data.data);
			}
		}
		else if (data.status == 'error')
		{
			scope.prizes = null;
			scope.nodata = true;
		}
	}).
	error(function (data, status, headers, config) {
		var msg = data || errmsg("Connection failure");
		alert(msg + "\n" + config.url);
	});
}

function prize_all_ctrl($scope, $http)
{
	$scope.nodata = false;
	$scope.loaddata = true;
	query_prize_all($scope, $http);
}

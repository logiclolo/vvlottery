function query_prize_all(scope, http)
{
	http.get('/lottery/prize_print/').
	success(function(data) {
		scope.loaddata = false;
		if (data.status == 'ok')
		{
			if (data.data.length == 0)
			{
				scope.prizes = null;
				scope.hasdata = false;
				scope.nodata = true;
			}
			else
			{
				scope.prizes = data.data;
				scope.hasdata = true;
				scope.nodata = false;

				prize_count(scope, data.data);
			}
		}
		else if (data.status == 'error')
		{
			scope.prizes = null;
			scope.hasdata = false;
			scope.nodata = true;
		}
	});
}

function prize_all_ctrl($scope, $http)
{
	$scope.hasdata = false;
	$scope.nodata = false;
	$scope.loaddata = true;
	query_prize_all($scope, $http);
}

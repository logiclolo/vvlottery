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
				scope.hasdata = false;
				scope.nodata = true;
			}
			else
			{
				scope.donators = data.data;
				scope.hasdata = true;
				scope.nodata = false;
			}
		}
		else if (data.status == 'error')
		{
			scope.donators = null;
			scope.hasdata = false;
			scope.nodata = true;
		}
	});
}

function donator_ctrl($scope, $http)
{
	$scope.hasdata = false;
	$scope.nodata = false;
	$scope.loaddata = true;
	query_donator($scope, $http);
}

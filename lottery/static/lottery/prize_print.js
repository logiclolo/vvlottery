function query_by_phase(scope, http, phase)
{
	http.get('/lottery/prize_print/?phase_alias=' + phase).
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

function prize_print($scope, $http)
{
	$scope.hasdata = false;
	$scope.nodata = false;
	$scope.loaddata = true;
	query_by_phase($scope, $http, get_phase_alias(1));
}

function prize_print2($scope, $http)
{
	$scope.hasdata = false;
	$scope.nodata = false;
	$scope.loaddata = true;
	query_by_phase($scope, $http, get_phase_alias(2));
}

function query_prize_all(scope, http)
{
	http.get('/lottery/prize/').
	success(function(data) {
		if (data.status == 'ok')
		{
			if (data.data.length == 0)
			{
				scope.prizes = null;
				scope.hasdata = false;
			}
			else
			{
				scope.prizes = data.data;
				scope.hasdata = true;
			}
		}
		else if (data.status == 'error')
		{
			scope.prizes = null;
			scope.hasdata = false;
		}
	});
}

function prize_all_ctrl($scope, $http)
{
	$scope.hasdata = false;
	query_prize_all($scope, $http);
}

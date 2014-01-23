function query_employee_all(scope, http)
{
	http.get('/lottery/employee/').
	success(function(data) {
		scope.loaddata = false;
		if (data.status == 'ok')
		{
			if (data.data.length == 0)
			{
				scope.employees = null;
				scope.hasdata = false;
				scope.nodata = true;
			}
			else
			{
				scope.employees = data.data;
				scope.hasdata = true;
				scope.nodata = false;
			}
		}
		else if (data.status == 'error')
		{
			scope.employees = null;
			scope.hasdata = false;
			scope.nodata = true;
		}
	}).
	error(function (data, status, headers, config) {
		var msg = data || errmsg("Connection failure");
		alert(msg + "\n" + config.url);
	});
}

function employee_all_ctrl($scope, $http)
{
	$scope.hasdata = false;
	$scope.nodata = false;
	$scope.loaddata = true;
	query_employee_all($scope, $http);
}

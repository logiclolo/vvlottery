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
	});
}

function employee_all_ctrl($scope, $http)
{
	$scope.hasdata = false;
	$scope.nodata = false;
	$scope.loaddata = true;
	query_employee_all($scope, $http);
}

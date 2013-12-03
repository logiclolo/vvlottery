function query_employee_all(scope, http)
{
	http.get('/lottery/employee/').
	success(function(data) {
		if (data.status == 'ok')
		{
			scope.employees = data.data;
			scope.hasdata = true;
		}
		else if (data.status == 'error')
		{
			scope.employees = null;
			scope.hasdata = false;
		}
	});
}

function employee_all_ctrl($scope, $http)
{
	$scope.hasdata = false;
	query_employee_all($scope, $http);
}

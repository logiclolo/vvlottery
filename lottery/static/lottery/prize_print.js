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
				scope.nodata = true;
			}
			else
			{
				scope.prizes = data.data;
				scope.nodata = false;
			}
		}
		else if (data.status == 'error')
		{
			scope.prizes = null;
			scope.nodata = true;
		}
	});
}

function query_orphan_employee(scope, http)
{
	http.get('/lottery/employee/?orphan=1').
	success(function(data) {
		scope.loaddata = false;
		if (data.status == 'ok')
		{
			if (data.data.length == 0)
			{
				scope.orphans = null;
				scope.nodata = true;
			}
			else
			{
				scope.orphans = data.data;
				scope.nodata = false;
			}
		}
		else
		{
			scope.orphans = null;
			scope.nodata = true;
		}
	});
}

function add_callbacks(scope)
{
	scope.check_received = function (prize) {
		if (prize.receiving_status == 'received')
			return true;

		return false;
	};
}

function prize_print($scope, $http)
{
	$scope.nodata = false;
	$scope.loaddata = true;
	add_callbacks($scope);
	query_by_phase($scope, $http, get_phase_alias(1));
}

function prize_print2($scope, $http)
{
	$scope.nodata = false;
	$scope.loaddata = true;
	add_callbacks($scope);
	query_by_phase($scope, $http, get_phase_alias(2));
}

function prize_print3($scope, $http)
{
	$scope.nodata = false;
	$scope.loaddata = true;
	query_orphan_employee($scope, $http);
}

function on_load()
{
	document.getElementById('input').focus();
}

function on_change(input)
{
	input.select();
}

function query_prizes(scope, http, winners)
{
	for (var i = 0; i < winners.length; i++)
	{
		var p = winners[i];

		http.get('/lottery/prize/?winner_jobid=' + p.jobid).
		success(function(data) {
			if (data.status == 'ok')
			{
				p.hasprizes = true;
				p.prizes = data.data;
			}
			else
			{
				p.hasprizes = false;
				p.prizes = null;
			}
		});
	}
}

function query_name(scope, http, name)
{
	http.get('/lottery/employee/?name=' + name).
	success(function(data) {
		if (data.status == 'ok')
		{
			scope.employees = data.data;
			scope.hasdata = true;

			query_prizes(scope, http, data.data);
		}
		else if (data.status == 'error')
		{
			scope.employees = null;
			scope.hasdata = false;
		}
	});
}

function query_id(scope, http, id)
{
	http.get('/lottery/employee/?id=' + id).
	success(function(data) {
		if (data.status == 'ok')
		{
			scope.employees = data.data;
			scope.hasdata = true;

			query_prizes(scope, http, data.data);
		}
		else if (data.status == 'error')
		{
			scope.employees = null;
			scope.hasdata = false;
		}
	});
}

function employee_ctrl($scope, $http)
{
	$scope.hasdata = false;
	$scope.query_employee = function() {
		var text = $scope.input

		if (text.toLowerCase().indexOf('vv') < 0 && text.toLowerCase().indexOf('va') < 0)
		{
			// We expect the name has at least 2 characters.
			if (text.length < 2)
				return;

			query_name($scope, $http, text);
		}

		var num = text.slice(2);
		if (num.length < 4)
			return;

		if (num.search(/\D/) >= 0)
			return;

		query_id($scope, $http, text.toLowerCase());
	};
}

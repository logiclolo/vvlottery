function on_load()
{
	document.getElementById('input').focus();
}

function on_change(input)
{
	input.select();
}

function update_model(data, scope)
{
	var i;
	var tmp = data.data;

	for (i = 0; i < tmp.length; i++)
	{
		if ((i + 1) % 2 != 0)
			tmp[i].class = '';
		else
			tmp[i].class = 'even';
	}

	scope.employees = tmp;
}

function query_name(scope, http, name)
{
	http.get('/lottery/employee/?name=' + name).
	success(function(data) {
		if (data.status == 'ok')
		{
			update_model(data, scope);
			scope.status = 'hasdata';
		}
		else if (data.status == 'error')
		{
			scope.employees = null;
			scope.status = 'nodata';
		}
	});
}

function query_id(scope, http, id)
{
	http.get('/lottery/employee/?id=' + id).
	success(function(data) {
		if (data.status == 'ok')
		{
			update_model(data, scope);
			scope.status = 'hasdata';
		}
		else if (data.status == 'error')
		{
			scope.employees = null;
			scope.status = 'nodata';
		}
	});
}

function employee_ctrl($scope, $http)
{
	$scope.status = 'nodata';
	$scope.query_employee = function() {
		var text = $scope.input

		if (text.indexOf('vv') < 0 && text.indexOf('va') < 0)
		{
			// We expect the name has at least 2 characters.
			if (text.length < 2)
				return;

			query_name($scope, $http, text);
		}

		var num = text.slice(2);
		if (num.length < 3)
			return;

		if (num.search(/\D/) >= 0)
			return;

		query_id($scope, $http, text);
	};
}

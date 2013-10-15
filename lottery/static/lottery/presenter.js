function on_load()
{
	//document.getElementById('id_input').focus();
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

	scope.presenters = tmp;
}

function query_all(scope, http)
{
	http.get('/lottery/presenter/').
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

function presenter_ctrl($scope, $http)
{
	query_all($scope, $http);
/*
	$scope.query_prize_id = function() {
		var text = $scope.id_input

		if (text == '')
			return;

		if (text.search(/\D/) >= 0)
			return;

		query_id($scope, $http, text);
	};
*/
}

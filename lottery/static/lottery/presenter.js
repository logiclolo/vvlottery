function on_load()
{
	//document.getElementById('id_input').focus();
}

function on_change(input)
{
	input.select();
}

function query_all(scope, http)
{
	http.get('/lottery/presenter/').
	success(function(data) {
		if (data.status == 'ok')
		{
			if (data.data.length > 0)
			{
				scope.presenters = data.data;
				scope.hasdata = true;
			}
			else
			{
				scope.presenters = null;
				scope.hasdata = false;
			}
		}
		else if (data.status == 'error')
		{
			scope.presenters = null;
			scope.hasdata = false;
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

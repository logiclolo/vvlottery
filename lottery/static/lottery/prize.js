function on_load()
{
	document.getElementById('id_input').focus();
}

function on_change(input)
{
	input.select();
}

function query_name(scope, http, name)
{
	http.get('/lottery/prize/?name=' + encodeURIComponent(name)).
	success(function(data) {
		if (data.status == 'ok')
		{
			scope.prizes = data.data;
		}
		else if (data.status == 'error')
		{
			scope.prizes = null;
		}
	}).
	error(function (data, status, headers, config) {
		var msg = data || errmsg("Connection failure");
		alert(msg + "\n" + config.url);
	});
}

function query_id(scope, http, id)
{
	http.get('/lottery/prize/?serial=' + id).
	success(function(data) {
		if (data.status == 'ok')
		{
			scope.prizes = data.data;
		}
		else if (data.status == 'error')
		{
			scope.prizes = null;
		}
	}).
	error(function (data, status, headers, config) {
		var msg = data || errmsg("Connection failure");
		alert(msg + "\n" + config.url);
	});
}

function prize_ctrl($scope, $http)
{
	$scope.status = 'nodata';
	$scope.query_prize_name = function() {
		var text = $scope.name_input

		if (text == '')
			return;

		query_name($scope, $http, text);
	};

	$scope.query_prize_id = function() {
		var text = $scope.id_input

		if (text == '')
			return;

		if (text.search(/\D/) >= 0)
			return;

		query_id($scope, $http, text);
	};
}

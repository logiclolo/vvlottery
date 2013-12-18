angular.module('add_prize', ['ngCookies']);

function on_load()
{
	document.getElementById('donator_input').focus();
}

function submit_prize(scope, http, obj)
{
	var json = angular.toJson(obj);

	http.post('/lottery/add_prize/', json).
	success(function (data) {
		if (data.status == 'ok')
		{
			scope.prize_added = true;
		}
		else
			alert(data.reason);
	});
}

function check_fields(scope)
{
	if (scope.donator == undefined || scope.donator.search(/^\s*$/) >= 0)
	{
		scope.errmsg = errmsg("Donator should not be empty");
		return false;
	}

	if (scope.prize_name == undefined || scope.prize_name.search(/^\s*$/) >= 0)
	{
		scope.errmsg = errmsg("Prize name should not be empty");
		return false;
	}

	return true;
}

function add_prize_ctrl($scope, $http, $cookies)
{
	$http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;

	$scope.add_prize = function () {
		var obj = new Object();

		if (!check_fields($scope))
			return;

		obj.phase_alias = get_phase_alias(2);
		obj.name = $scope.donator + ":" + $scope.prize_name;

		submit_prize($scope, $http, obj);
	};

	$scope.input_changed = function () {
		$scope.prize_added = false;
		$scope.errmsg = null;
	};
}

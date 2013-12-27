angular.module('add_prize', ['ngCookies']);

function on_load()
{
	//document.getElementById('donator_input').focus();
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
	else if (scope.donator == 'custom' && (scope.custom_donator == undefined ||
				scope.custom_donator.search(/^\s*$/) >= 0))
	{
		scope.errmsg = errmsg("Custom donator should not be empty");

		var input = document.getElementById('donator_input');
		input.focus();
		input.select();

		return false;
	}


	if (scope.prize_name == undefined || scope.prize_name.search(/^\s*$/) >= 0)
	{
		scope.errmsg = errmsg("Prize name should not be empty");

		var input = document.getElementById('prize_name_input');
		input.focus();
		input.select();

		return false;
	}

	return true;
}

function query_donator(scope, http)
{
	http.get('/lottery/donator/').
	success(function(data) {
		if (data.status == 'ok')
		{
			if (data.data.length == 0)
			{
				scope.donators = null;
			}
			else
			{
				scope.donators = data.data;
			}
		}
		else if (data.status == 'error')
		{
			scope.donators = null;
		}
	});
}

function add_prize_ctrl($scope, $http, $cookies)
{
	$http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;

	query_donator($scope, $http);

	$scope.add_prize = function () {
		var obj = new Object();

		if (!check_fields($scope))
			return;

		obj.phase_alias = get_phase_alias(2);
		if ($scope.donator == 'custom')
			obj.name = $scope.custom_donator + ':' + $scope.prize_name;
		else
		{
			obj.jobid = $scope.donator;
			obj.prize = $scope.prize_name;
		}

		submit_prize($scope, $http, obj);
	};

	$scope.input_changed = function () {
		$scope.prize_added = false;
		$scope.errmsg = null;
	};

	$scope.select_changed = function () {
		$scope.prize_added = false;
		$scope.errmsg = null;

		$scope.iscustom = ($scope.donator == 'custom') ? true : false;
	};
}

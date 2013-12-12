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

function add_prize_ctrl($scope, $http, $cookies)
{
	$http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;

	$scope.add_prize = function () {
		var obj = new Object();

		obj.phase_alias = get_phase_alias(2);
		obj.name = $scope.donator + ":" + $scope.prize_name;

		submit_prize($scope, $http, obj);
	};

	$scope.input_changed = function () {
		$scope.prize_added = false;
	};
}

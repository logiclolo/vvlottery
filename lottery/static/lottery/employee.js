angular.module('employee', ['ngCookies']);

function on_load()
{
	document.getElementById('input').focus();
}

function on_change(input)
{
	input.select();
}

function translate(data)
{
	for (var i = 0; i < data.length; i++)
	{
		var d = data[i];

		if (d['receiving_status'] == 'inqueue')
			d['receiving_status'] = '已在佇列中';
		else if (d['receiving_status'] == 'received')
			d['receiving_status'] = '已領取';
	}
}

function query_prizes(scope, http, winners)
{
	angular.forEach(winners, function(element, idx) {
		http.get('/lottery/prize/?winner_jobid=' + element.jobid).
		success(function(data) {
			if (data.status == 'ok')
			{
				element.hasprizes = true;
				translate(data.data);
				element.prizes = data.data;
			}
			else
			{
				element.hasprizes = false;
				element.prizes = null;
			}
		});
	});
}

function query_name(scope, http, name)
{
	http.get('/lottery/employee/?name=' + encodeURIComponent(name)).
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

function query_id_fuzzy(scope, http, text)
{
	http.get('/lottery/employee/?fuzzy_id=' + text).
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

function submit_queue(scope, http, prize)
{
	var obj = new Object();
	obj.serial = prize.serial;
	obj.phase_alias = prize.phase_alias;

	var json = angular.toJson(obj);

	http.post('/lottery/add_queue/', json).
	success(function (data) {
		if (data.status == 'ok')
		{
			prize.errmsg = null;
			prize.is_sync = true;
		}
		else
		{
			prize.errmsg = errmsg(data.reason);
			prize.is_sync = false;
		}
	});
}

function employee_ctrl($scope, $http, $cookies)
{
	$scope.hasdata = false;
	$scope.query_employee = function() {
		var text = $scope.input

		if (text.toLowerCase().indexOf('vv') < 0 && text.toLowerCase().indexOf('va') < 0)
		{
			// We expect the name has at least 2 characters.
			if (text.length < 2)
				return;

			if (text.search(/\D/) < 0)
				query_id_fuzzy($scope, $http, text);			
			else
				query_name($scope, $http, text);
		}

		var num = text.slice(2);
		if (num.length < 4)
			return;

		if (num.search(/\D/) >= 0)
			return;

		query_id($scope, $http, text.toLowerCase());
	};

	$scope.submit_queue = function (prize) {
		$http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;

		submit_queue($scope, $http, prize);
	};

	$scope.receivable = function (prize) {
		if (!prize.onsite)
			return false;

		if (prize.receiving_status == '')
			return true;
		else
			return false;
	};
}

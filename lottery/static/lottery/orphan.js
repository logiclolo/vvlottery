var g_http;

angular.module('orphan', ['ngCookies']);

function submit_winner(scope)
{
	var obj = new Object();
	obj.serial = scope.e.serial;
	obj.winner_jobid = scope.e.jobid;
	obj.phase = scope.e.phase;

	var json = angular.toJson(obj);

	g_http.post('/lottery/prize_input/', json).
	success(function (data) {
		if (data.status == 'ok')
		{
			scope.e.has_sync = true;
		}
		else
			alert(data.reason);
	});
}

function on_keypress(ev, input)
{
	var code = ev.keyCode ? ev.keyCode : ev.charCode;
	if (code != 13)
		return;

	var scope = angular.element(input).scope();

	if (!check_jobid(scope.e.jobid))
		return;

	if (scope.e.winner == 'N/A')
		return;

	submit_winner(scope);
}

function query_orphan_prizes(scope, http)
{
	http.get('/lottery/prize/?orphan=1').
	success(function(data) {
		if (data.status == 'ok')
		{
			scope.prizes = data.data;
			scope.prize_number = data.data.length;
		}
		else
		{
			scope.prizes = null;
			scope.prize_number = 0;
		}
	});
}

function query_employee(scope, http, entry, id)
{
	http.get('/lottery/employee/?id=' + id).
	success(function(data) {
		if (data.status == 'ok')
		{
			var tmp = data.data[0];
			entry.winner = tmp.name;
		}
	});
}

function query_orphan_employee(scope, http)
{
	http.get('/lottery/employee/?orphan=1').
	success(function(data) {
		if (data.status == 'ok')
		{
			scope.orphans = data.data;
			scope.orphan_number = data.data.length;
		}
		else
		{
			scope.orphans = null;
			scope.orphan_number = 0;
		}
	});
}

function orphan_ctrl($scope, $http, $cookies)
{
	g_http = $http;

	$http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;

	query_orphan_prizes($scope, $http);
	query_orphan_employee($scope, $http);

	$scope.change = function(entry, jobid) {
		entry.has_sync = false;
		entry.winner = 'N/A';

		if (!check_jobid(jobid))
			return;

		query_employee($scope, $http, entry, jobid);
	};

	$scope.check_sync = function(entry) {
		if (entry.jobid != '')
			entry.has_sync = true;
	};
}

var g_http;

angular.module('prize_input', ['ngCookies']);

function on_load()
{
	document.getElementById('id_input').focus();
}

function check_jobid(jobid)
{
	var num = jobid.slice(2);
	if (num.length < 3)
		return false;

	if (num.search(/\D/) >= 0)
		return false;

	return true;
}

function submit_winner(scope)
{
	var obj = new Object();
	obj.serial = scope.e.serial;
	obj.winner_jobid = scope.e.jobid;

	var json = angular.toJson(obj);

	g_http.post('/lottery/prize_input/', json).
	success(function (data) {
		if (data.status == 'ok')
		{
			scope.e.has_sync = true;
			scope.$apply();
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

	submit_winner(scope);
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

	scope.prizes = tmp;
}

function query_by_phase(scope, http, phase)
{
	http.get('/lottery/prize/?phase=' + phase).
	success(function(data) {
		if (data.status == 'ok')
		{
			update_model(data, scope);
		}
		else if (data.status == 'error')
		{
			scope.prizes = null;
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

function prize_input_ctrl($scope, $http, $cookies)
{
	g_http = $http;

	$http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;

	query_by_phase($scope, $http, '福委獎');

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

var g_http;

angular.module('prize_input', ['ngCookies']);

function on_load()
{
	document.getElementById('id_input').focus();
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
		}
		else
			alert(data.reason);
	});
}

function move_focus_next(input)
{
	var next_row = input.parentNode.parentNode.nextSibling;

	if (next_row.nodeName == 'TR')
	{
		var next = next_row.getElementsByTagName('input')[0];

		next.focus();
	}
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

	move_focus_next(input);
}

function query_by_phase(scope, http, phase)
{
	http.get('/lottery/prize/?phase=' + phase).
	success(function(data) {
		if (data.status == 'ok')
		{
			scope.prizes = data.data;
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

function init(scope, http, cookies, phase)
{
	g_http = http;

	http.defaults.headers.post['X-CSRFToken'] = cookies.csrftoken;

	query_by_phase(scope, http, phase);

	scope.change = function(entry, jobid) {
		entry.has_sync = false;
		entry.winner = 'N/A';

		if (!check_jobid(jobid))
			return;

		query_employee(scope, http, entry, jobid);
	};

	scope.check_sync = function(entry) {
		if (entry.jobid != '')
			entry.has_sync = true;
	};
}

function prize_input_ctrl($scope, $http, $cookies)
{
	init($scope, $http, $cookies, '福委獎');
}

function prize_input_ctrl2($scope, $http, $cookies)
{
	init($scope, $http, $cookies, '鹹魚翻身獎');
}

function prize_input_ctrl3($scope, $http, $cookies)
{
	init($scope, $http, $cookies, '地獄翻身獎');
}

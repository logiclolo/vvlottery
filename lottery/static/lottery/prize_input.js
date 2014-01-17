var g_http;

angular.module('prize_input', ['ngCookies']);

function on_load()
{
	document.getElementById('id_input').focus();
}

function submit_winner(scope, input)
{
	var obj = new Object();
	obj.serial = scope.e.serial;
	obj.winner_jobid = scope.e.jobid;
	obj.phase_alias = scope.phase;

	var json = angular.toJson(obj);

	g_http.post('/lottery/prize_input/', json).
	success(function (data) {
		if (data.status == 'ok')
		{
			scope.e.has_sync = true;
		}
		else
		{
			scope.e.errmsg = errmsg(data.reason);
			scope.e.iserror = true;
			input.focus();
			input.select();
		}
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

	submit_winner(scope, input);

	move_focus_next(input);
}

function query_by_phase(scope, http, phase)
{
	http.get('/lottery/prize/?phase_alias=' + phase).
	success(function(data) {
		scope.loaddata = false;
		if (data.status == 'ok')
		{
			if (data.data.length == 0)
			{
				scope.hasdata = false;
				scope.nodata = true;
				scope.prizes = null;
			}
			else
			{
				scope.hasdata = true;
				scope.nodata = false;
				scope.prizes = data.data;
			}
		}
		else if (data.status == 'error')
		{
			scope.hasdata = false;
			scope.nodata = true;
			scope.prizes = null;
		}
	});
}

function query_employee(scope, http, entry, id)
{
	http.get('/lottery/employee/?id=' + id.toLowerCase()).
	success(function(data) {
		if (data.status == 'ok')
		{
			var tmp = data.data[0];
			entry.winner = tmp.name;
			entry.is_donator = tmp.is_donator;
		}
	});
}

function init(scope, http, cookies, phase)
{
	g_http = http;

	http.defaults.headers.post['X-CSRFToken'] = cookies.csrftoken;

	scope.hasdata = false;
	scope.nodata = false;
	scope.loaddata = true;
	query_by_phase(scope, http, phase);

	scope.phase = phase;
	scope.change = function(entry, jobid) {
		entry.has_sync = false;
		entry.iserror = false;
		entry.winner = 'N/A';
		entry.is_donator = false;

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
	init($scope, $http, $cookies, get_phase_alias(1));
}

function prize_input_ctrl2($scope, $http, $cookies)
{
	init($scope, $http, $cookies, get_phase_alias(2));
}

function prize_input_ctrl3($scope, $http, $cookies)
{
	init($scope, $http, $cookies, get_phase_alias(3));
}

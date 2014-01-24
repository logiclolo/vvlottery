var g_timeout;

function query_prizes(scope, http, idx, length, phase)
{
	var delay = 1000;
	var phase_alias = get_phase_alias(phase);
	var show_serial = (phase == 1) ? true : false;

	var default_ticking = 15;
	var default_retry_ticking = 5;
	var retry_count = 5;

	if (scope.retry_ticking && (scope.retry_ticking - 1) > 0)
	{
		scope.retry_ticking--;

		g_timeout(function () {
			query_prizes(scope, http, idx, length, phase);
		}, delay);

		return;
	}

	if (scope.ticking && (scope.ticking - 1) > 0)
	{
		scope.ticking--;

		g_timeout(function () {
			query_prizes(scope, http, idx, length, phase);
		}, delay);

		return;
	}

	http.get('/lottery/prize_list/?idx=' + idx + "&length=" + length +
			"&phase_alias=" + phase_alias).
	success(function(data) {
		if (data.status == 'ok')
		{
			if (data.data.length > 0)
			{
				var tmp = data.data;
				for (var i = 0; i < tmp.length; i++)
				{
					var jobid = tmp[i]['jobid'];

					jobid = jobid.replace(/^vv/, '晶睿');
					jobid = jobid.replace(/^va/, '睿緻');

					tmp[i]['jobid'] = jobid;
				}

				scope.phase = get_phase_name(phase);
				scope.show_serial = show_serial;
				scope.prizes = tmp;
				idx += length;

				scope.ticking = default_ticking;
				scope.retry_ticking = null;
				scope.retry_count = retry_count;
			}
			else
			{
				if (phase == 1)
					phase = 2;
				else
					phase = 1;

				idx = 0;
				delay = 500;
			}
		}
		else if (data.status == 'error')
		{
			scope.prizes = null;
		}

		g_timeout(function () {
			query_prizes(scope, http, idx, length, phase);
		}, delay);
	}).
	error(function (data, status, headers, config) {
		scope.ticking = null;
		scope.retry_ticking = default_retry_ticking;
		scope.retry_count--;

		if (scope.retry_count <= 0)
		{
			scope.retry_ticking = null;
			scope.abort_retry = true;
			return;
		}

		g_timeout(function () {
			query_prizes(scope, http, idx, length, phase);
		}, delay);
	});
}

function slideshow_ctrl($scope, $http, $timeout)
{
	g_timeout = $timeout;

	query_prizes($scope, $http, 0, 5, 1);
}

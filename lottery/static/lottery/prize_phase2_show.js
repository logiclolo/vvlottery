var max_len_part1 = 23;
var max_total = 46;

function init_prize_grid(scope)
{
	var tmp = [];
	var tmp2 = [];

	for (var i = 0; i < max_len_part1; i++)
	{
		var d = {serial: i + 1, donator: '', prize: ''};
		tmp.push(d);
	}

	var len_part2 = max_total - max_len_part1;
	for (var i = 0; i < len_part2; i++)
	{
		var d = {serial: i + 1 + max_len_part1, donator: '', prize: ''};
		tmp2.push(d);
	}

	scope.prizes = tmp;
	scope.prizes2 = tmp2;
}

function split_data(data)
{
	var ar = data.name.split(':');

	return {donator: ar[0], prize: ar[1]};
}

function query_prizes(scope, http, timeout, phase)
{
	var delay = 1000;
	var phase_alias = get_phase_alias(phase);

	/* 10 seconds */
	var default_ticking = 10;
	var default_retry_ticking = 5;
	var retry_count = 5;

	if (scope.retry_ticking && (scope.retry_ticking - 1) > 0)
	{
		scope.retry_ticking--;

		timeout(function () {
			query_prizes(scope, http, timeout, phase);
		}, delay);

		return;
	}

	if (scope.ticking && (scope.ticking - 1) > 0)
	{
		scope.ticking--;

		timeout(function () {
			query_prizes(scope, http, timeout, phase);
		}, delay);

		return;
	}

	scope.phase = get_phase_name(phase);

	http.get('/lottery/prize/?phase_alias=' + phase_alias).
	success(function(data) {
		if (data.status == 'ok')
		{
			init_prize_grid(scope);
			if (data.data.length > 0)
			{
				var tmp = [];
				var tmp2 = [];
				data.data.reverse();

				for (var i = 0; i < data.data.length; i++)
				{
					if (i >= max_total)
						break;

					var d = split_data(data.data[i]);

					if (i < max_len_part1)
					{
						d.serial = scope.prizes[i].serial;
						scope.prizes[i] = d;
					}
					else
					{
						d.serial = scope.prizes2[i - max_len_part1].serial;
						scope.prizes2[i - max_len_part1] = d;
					}
				}
			}

			scope.ticking = default_ticking;
			scope.retry_ticking = null;
			scope.retry_count = retry_count;
		}
		/*
		else if (data.status == 'error')
		{
			scope.prizes = null;
			scope.prizes2 = null;
		}
		*/

		timeout(function () {
			query_prizes(scope, http, timeout, phase);
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

			/* Sleep for 1 min and try to connect again */
			timeout(function () {
				scope.abort_retry = false;
				scope.retry_ticking = default_retry_ticking;
				scope.retry_count = retry_count;
				query_prizes(scope, http, timeout, phase);
			}, 60000);

			return;
		}

		timeout(function () {
			query_prizes(scope, http, timeout, phase);
		}, delay);
	});
}

function prize_phase2_ctrl($scope, $http, $timeout)
{
	query_prizes($scope, $http, $timeout, 2);
}

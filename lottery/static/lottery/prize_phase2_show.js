function split_data(data)
{
	var ar = data.name.split(':');

	return {donator: ar[0], prize: ar[1]};
}

function query_prizes(scope, http, timeout, phase)
{
	/* 10 seconds */
	var delay = 10000;
	var phase_alias = get_phase_alias(phase);

	scope.phase = get_phase_name(phase);

	http.get('/lottery/prize/?phase_alias=' + phase_alias).
	success(function(data) {
		if (data.status == 'ok')
		{
			if (data.data.length > 0)
			{
				var tmp = [];

				for (var i = 0; i < data.data.length; i++)
				{
					var d = split_data(data.data[i]);
					tmp.push(d);
				}

				scope.prizes = tmp;
			}
			else
			{
				scope.prizes = null;
			}
		}
		else if (data.status == 'error')
		{
			scope.prizes = null;
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

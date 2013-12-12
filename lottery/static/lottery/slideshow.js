var g_timeout;

function query_prizes(scope, http, idx, length)
{
	var delay = 15000;

	http.get('/lottery/prize_list/?idx=' + idx + "&length=" + length +
			"&phase_alias=" + scope.phase_alias).
	success(function(data) {
		if (data.status == 'ok')
		{
			if (data.data.length > 0)
			{
				scope.prizes = data.data;
				idx += length;
			}
			else
			{
				idx = 0;
				delay = 500;
			}
		}
		else if (data.status == 'error')
		{
			scope.prizes = null;
		}

		g_timeout(function () {
			query_prizes(scope, http, idx, length);
		}, delay);
	});
}

function slideshow_ctrl($scope, $http, $timeout)
{
	g_timeout = $timeout;

	$scope.phase = get_phase_name(1);
	$scope.phase_alias = get_phase_alias(1);
	query_prizes($scope, $http, 0, 5);
}

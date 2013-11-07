var g_timeout;

function query_prizes(scope, http, idx, length)
{
	var delay = 15000;

	http.get('/lottery/prize_list/?idx=' + idx + "&length=" + length +
			"&phase=" + scope.phase).
	success(function(data) {
		if (data.status == 'ok')
		{
			if (data.data.length > 0)
			{
				scope.prizes = data.data;
				idx += data.data.length;
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
	query_prizes($scope, $http, 0, 5);
}

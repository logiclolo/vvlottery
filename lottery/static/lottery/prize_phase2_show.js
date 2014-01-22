var max_len_part1 = 18;
var max_total = 36;

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
	/* 10 seconds */
	var delay = 10000;
	var phase_alias = get_phase_alias(phase);

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
	});
}

function prize_phase2_ctrl($scope, $http, $timeout)
{
	query_prizes($scope, $http, $timeout, 2);
}

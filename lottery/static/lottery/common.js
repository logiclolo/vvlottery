function check_jobid(jobid)
{
	var num = jobid.slice(2);
	if (num.length < 4)
		return false;

	if (num.search(/\D/) >= 0)
		return false;

	return true;
}

function get_phase_alias(phase)
{
	if (phase < 1 || phase > 3)
		return null;

	return 'phase' + phase;
}

function get_phase_name(phase)
{
	if (phase == 1)
		return '員工獎';
	else if (phase == 2)
		return '敗部復活獎';
	else if (phase == 3)
		return '人生勝利獎';
	else
		return null;
}

function prize_count(scope, data)
{
	var phase1_count = 0;
	var phase2_count = 0;
	var phase1 = get_phase_alias(1);
	var phase2 = get_phase_alias(2);

	for (var i = 0; i < data.length; i++)
	{
		var d = data[i];
		if (d.phase_alias == phase1)
			phase1_count++;
		else if (d.phase_alias == phase2)
			phase2_count++;
	}

	scope.phase1_count = phase1_count;
	scope.phase2_count = phase2_count;
}


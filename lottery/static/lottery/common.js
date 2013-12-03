function check_jobid(jobid)
{
	var num = jobid.slice(2);
	if (num.length < 3)
		return false;

	if (num.search(/\D/) >= 0)
		return false;

	return true;
}

function get_phase_name(phase)
{
	if (phase == 1)
		return '員工獎';
	else if (phase == 2)
		return '鹹魚翻身獎';
	else if (phase == 3)
		return '地獄翻身獎';
	else
		return null;
}

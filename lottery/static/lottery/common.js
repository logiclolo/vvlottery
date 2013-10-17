function check_jobid(jobid)
{
	var num = jobid.slice(2);
	if (num.length < 3)
		return false;

	if (num.search(/\D/) >= 0)
		return false;

	return true;
}


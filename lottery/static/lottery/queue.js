angular.module('queue', ['ngCookies']);

function search_id(arr, ele)
{
	for (var i = 0; i < arr.length; i++)
	{
		if (arr[i].id == ele.id)
			return true;
	}

	return false;
}

function alter_queue(dst, src)
{
	var to_be_removed = [];
	var to_be_added = [];

	for (var i = 0; i < dst.length; i++)
	{
		if (!search_id(src, dst[i]))
			to_be_removed.push(i);
	}

	for (var i = 0; i < src.length; i++)
	{
		if (!search_id(dst, src[i]))
			to_be_added.push(src[i]);
	}

	for (var i = 0; i < to_be_removed.length; i++)
	{
		var idx = to_be_removed[i];

		dst.splice(idx, 1);
	}

	for (var i = 0; i < to_be_added.length; i++)
	{
		var item = to_be_added[i];

		dst.push(item);
	}
}

function query_queue(scope, http, timeout)
{
	var delay = 1000;
	var default_ticking = 5;
	var default_retry_ticking = 5;
	var retry_count = 5;

	if (scope.retry_ticking && (scope.retry_ticking - 1) > 0)
	{
		scope.retry_ticking--;

		timeout(function () {
			query_queue(scope, http, timeout);
		}, delay);

		return;
	}

	if (scope.ticking && (scope.ticking - 1) > 0)
	{
		scope.ticking--;

		timeout(function () {
			query_queue(scope, http, timeout);
		}, delay);

		return;
	}

	http.get('/lottery/queue/').
	success(function(data) {
		scope.loaddata = false;
		if (data.status == 'ok')
		{
			if (data.data.length == 0)
			{
				scope.queue = null;
			}
			else
			{
				if (scope.queue)
					alter_queue(scope.queue, data.data);
				else
					scope.queue = data.data;
			}

			scope.ticking = default_ticking;
			scope.retry_ticking = null;
			scope.retry_count = retry_count;
		}
		else if (data.status == 'error')
		{
			scope.queue = null;
		}

		timeout(function () {
			query_queue(scope, http, timeout);
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

		timeout(function () {
			query_queue(scope, http, timeout);
		}, delay);
	});
}

function confirm_received(scope, http, item)
{
	var obj = new Object();
	obj.id = item.id;

	var json = angular.toJson(obj);

	http.post('/lottery/set_queue_done/', json).
	success(function(data) {
		if (data.status == 'ok')
		{
			item.is_sync = true;
		}
		else if (data.status == 'error')
		{
			item.is_sync = false;
			item.errmsg = errmsg(data.reason);
		}
	}).
	error(function (data, status, headers, config) {
		var msg = data || errmsg("Connection failure");
		alert(msg);
	});
}

function queue_ctrl($scope, $http, $cookies, $timeout)
{
	$scope.loaddata = true;

	query_queue($scope, $http, $timeout);

	$scope.confirm = function (item) {
		var isok = confirm("領獎序號：" + item.id + "\n確定已領取？");

		if (isok)
			confirm_received($scope, $http, item);
	};
}

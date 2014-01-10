angular.module('queue', ['ngCookies']);

function query_queue(scope, http, timeout)
{
	var delay = 5000;

	http.get('/lottery/queue/').
	success(function(data) {
		scope.loaddata = false;
		if (data.status == 'ok')
		{
			if (data.data.length == 0)
			{
				scope.queue = null;
				scope.hasdata = false;
				scope.nodata = true;
			}
			else
			{
				scope.queue = data.data;
				scope.hasdata = true;
				scope.nodata = false;
			}
		}
		else if (data.status == 'error')
		{
			scope.queue = null;
			scope.hasdata = false;
			scope.nodata = true;
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
	});
}

function queue_ctrl($scope, $http, $cookies, $timeout)
{
	$http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
	$scope.hasdata = false;
	$scope.nodata = false;
	$scope.loaddata = true;

	query_queue($scope, $http, $timeout);

	$scope.confirm = function (item) {
		var isok = confirm("確定已領取？");

		if (isok)
			confirm_received($scope, $http, item);
	};
}

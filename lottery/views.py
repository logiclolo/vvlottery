# Create your views here.
from lottery.models import Employee, Presenter, Prize
from django.http import HttpResponse
from django.template import Context, loader
import json

def fill_employee_data(obj):
	tmp = {}

	tmp['jobid'] = obj.jobid
	tmp['name'] = obj.name
	tmp['department'] = obj.department.name
	tmp['title'] = obj.title

	return tmp

def fill_prize_data(obj):
	tmp = {}

	tmp['name'] = obj.name
	tmp['serial'] = obj.serial
	if obj.winner:
		tmp['winner'] = obj.winner.name
	else:
		tmp['winner'] = 'N/A'

	if obj.presenter:
		tmp['presenter'] = obj.presenter.name
	else:
		tmp['presenter'] = 'N/A'

	return tmp

def fill_presenter_data(obj):
	tmp = {}

	tmp['name'] = obj.employee.name
	tmp['phase'] = obj.phase
	tmp['order'] = obj.order

	return tmp

def response_error(reason):
	result = {}
	result['status'] = 'error'
	result['reason'] = reason

	out = json.dumps(result, ensure_ascii = False)
	return HttpResponse(out, content_type = 'application/json')

def response_ok(data):
	result = {}
	result['status'] = 'ok'
	result['data'] = data

	out = json.dumps(result, ensure_ascii = False)
	return HttpResponse(out, content_type = 'application/json')

def employee(req):
	data = []

	if 'name' in req.GET:
		list = Employee.objects.filter(name__contains = req.GET['name']).order_by('jobid')
		if len(list) == 0:
			return response_error('Not found')
	elif 'id' in req.GET:
		list = Employee.objects.filter(jobid = req.GET['id'])
		if len(list) == 0:
			return response_error('Not found')
	else:
		list = Employee.objects.all().order_by('jobid')

	for i in list:
		tmp = fill_employee_data(i)
		data.append(tmp)	

	return response_ok(data)

def employee_page(req):
	t = loader.get_template('employee.html')
	c = Context()

	return HttpResponse(t.render(c))

def prize(req):
	data = []

	if 'serial' in req.GET:
		try:
			tmp = Prize.objects.get(serial = req.GET['serial'])
			list = [tmp]
		except Prize.DoesNotExist:
			return response_error('Not found')
	else:
		list = Prize.objects.all().order_by('serial')
			
	for i in list:
		tmp = fill_prize_data(i)
		data.append(tmp)	

	return response_ok(data)

def presenter(req):
	data = []

	if 'phase' in req.GET:
		list = Presenter.objects.filter(phase = req.GET['phase']).order_by('order')

		if 'order' in req.GET:
			list = list.filter(order = req.GET['order'])

		if len(list) == 0:
			return response_error('Not found')
	else:
		list = Presenter.objects.all().order_by('phase', 'order')

	for i in list:
		tmp = fill_presenter_data(i)
		data.append(tmp)	

	return response_ok(data)

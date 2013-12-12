# Create your views here.
from lottery.models import Employee, Presenter, Prize, Phase
from django.http import HttpResponse
from django.template import Context, loader
from django import forms
from django.views.decorators.csrf import ensure_csrf_cookie
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
	tmp['phase'] = obj.phase.name
	tmp['phase_alias'] = obj.phase.alias
	tmp['onsite'] = obj.onsite
	if obj.winner:
		tmp['winner'] = obj.winner.name
		tmp['jobid'] = obj.winner.jobid
	else:
		tmp['winner'] = 'N/A'
		tmp['jobid'] = ''

	if obj.presenter:
		tmp['presenter'] = obj.presenter.name
	else:
		tmp['presenter'] = 'N/A'

	return tmp

def fill_presenter_data(obj):
	tmp = {}

	tmp['name'] = obj.employee.name
	tmp['phase'] = obj.phase.name
	tmp['order'] = obj.order
	tmp['title'] = obj.employee.title

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

@ensure_csrf_cookie
def employee(req):
	data = []

	if 'name' in req.GET:
		elist = Employee.objects.filter(name__icontains = req.GET['name']).order_by('jobid')
		if len(elist) == 0:
			return response_error('Not found')
	elif 'id' in req.GET:
		elist = Employee.objects.filter(jobid = req.GET['id'])
		if len(elist) == 0:
			return response_error('Not found')
	elif 'orphan' in req.GET:
		elist = []
		tmp = Employee.objects.all().order_by('jobid')
		for p in tmp:
			if p.prize_set.count() == 0:
				elist.append(p)
	else:
		elist = Employee.objects.all().order_by('jobid')

	for i in elist:
		tmp = fill_employee_data(i)
		data.append(tmp)	

	return response_ok(data)

def prize_list_all(req):
	data = []
	query_phase = False

	if 'phase_alias' in req.GET:
		phase = req.GET['phase_alias']
		query_phase = True

	if query_phase:
		plist = Prize.objects.filter(phase__alias__exact = phase).order_by('serial')
	else:
		plist = Prize.objects.all().order_by('serial')

	for i in plist:
		tmp = fill_prize_data(i)
		data.append(tmp)

	return response_ok(data)

def prize_list(req):
	data = []
	idx = 0
	length = 5
	query_phase = False

	if 'idx' in req.GET:
		idx = int(req.GET['idx'])

	if 'length' in req.GET:
		length = int(req.GET['length'])

	if 'phase_alias' in req.GET:
		phase = req.GET['phase_alias']
		query_phase = True

	if query_phase:
		plist = Prize.objects.exclude(winner__exact = None).filter(phase__alias__exact = phase).order_by('-serial')
	else:
		plist = Prize.objects.exclude(winner__exact = None).order_by('-serial')
	plist = plist[idx:idx + length]

	for i in plist:
		tmp = fill_prize_data(i)
		data.append(tmp)

	return response_ok(data)

def prize_print(req):
	data = []
	employees = Employee.objects.all().order_by('jobid')

	for e in employees:
		plist = e.prize_set.all()

		for i in plist:
			tmp = fill_prize_data(i)
			data.append(tmp)

	return response_ok(data)

@ensure_csrf_cookie
def prize(req):
	data = []

	if 'serial' in req.GET:
		plist = Prize.objects.filter(serial = req.GET['serial'])
		if len(plist) == 0:
			return response_error('Not found')
	elif 'phase_alias' in req.GET:
		plist = Prize.objects.filter(phase__alias__exact = req.GET['phase_alias']).order_by('-serial')
	elif 'phase' in req.GET:
		plist = Prize.objects.filter(phase__name__exact = req.GET['phase']).order_by('-serial')
	elif 'orphan' in req.GET:
		plist = Prize.objects.filter(winner__exact = None).order_by('serial')
		if len(plist) == 0:
			return response_error('Not found')
	elif 'winner_jobid' in req.GET:
		plist = Prize.objects.filter(winner__jobid__exact = req.GET['winner_jobid']).order_by('serial')
		if len(plist) == 0:
			return response_error('Not found')
	elif 'name' in req.GET:
		plist = Prize.objects.filter(name__icontains = req.GET['name']).order_by('serial')
		if len(plist) == 0:
			return response_error('Not found')
	else:
		plist = Prize.objects.all().order_by('serial')
			
	for i in plist:
		tmp = fill_prize_data(i)
		data.append(tmp)	

	return response_ok(data)

def check_phase1_dup(e, alias):
	if alias == 'phase1' and e.prize_set.filter(phase__alias__exact = 'phase1').count() > 0:
		return True
	else:
		return False

def prize_input(req):
	data = []

	if req.method != 'POST':
		return response_error('Invalid method');

	tmp = json.loads(req.body)
	if not 'phase_alias' in tmp or not 'serial' in tmp or not 'winner_jobid' in tmp:
		return response_error('Invalid data format');

	try:
		winner = Employee.objects.get(jobid = tmp['winner_jobid'])
		if check_phase1_dup(winner, tmp['phase_alias']):
			return response_error('Duplicated winner')
		prize = Prize.objects.get(serial = tmp['serial'], phase__alias__exact = tmp['phase_alias'])

		prize.winner = winner
		prize.save()
	except Prize.DoesNotExist:
		return response_error('Prize not found')
	except Employee.DoesNotExist:
		return response_error('Employee not found')

	return response_ok(data)

def add_prize(req):
	data = []

	if req.method != 'POST':
		return response_error('Invalid method');

	tmp = json.loads(req.body)
	if not 'phase_alias' in tmp or not 'name' in tmp:
		return response_error('Invalid data format');

	try:
		phase = Phase.objects.get(alias = tmp['phase_alias'])

		prize = Prize()
		prize.phase = phase
		prize.name = tmp['name']
		prize.serial = Prize.objects.filter(phase = phase).count() + 1
		prize.save()
	except Phase.DoesNotExist:
		return response_error('Prize not found')

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

class PrizeImportForm(forms.Form):
	file = forms.FileField()

def save_file(f):
	try:
		of = open('/tmp/test.pdf', 'wb')
		for chunk in f.chunks():
			of.write(chunk)
		of.close()
	except IOError as e:
		print e

def prize_import(req):
	data = []

	if req.method == 'POST':
		form = PrizeImportForm(req.POST, req.FILES)
		if form.is_valid():
			save_file(req.FILES['file'])
			return response_ok(data)
		else:
			return response_error('Invalid form')
	else:
		return response_error('Invalid method')

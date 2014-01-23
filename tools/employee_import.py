#!/usr/bin/env python

import os, sys
import xlrd
import re

sys.path.append(os.path.join(os.getenv('PWD'), '..'))
os.environ['DJANGO_SETTINGS_MODULE'] = 'vvlottery.settings'

from lottery.models import Employee, Department, Prize, Presenter

vv_sheet = 0
va_sheet = 1

def usage():
	print 'Usage: employee_import.py <Excel file>'

def get_department(depart):
	try:
		tmp = Department.objects.get(name = depart)
		return tmp
	except Department.DoesNotExist:
		return None

def add_department(depart_name):
	tmp = Department()
	tmp.name = depart_name
	tmp.save()

	return tmp

def do_add_employee(name, jobid, depart_name):
	employee = Employee()
	employee.jobid = jobid
	employee.name = name

	depart = get_department(depart_name)
	if not depart:
		depart = add_department(depart_name)

	employee.department = depart
	employee.save()

def add_employee(row):
	department = row[0].value
	jobid = row[1].value
	name = row[2].value

	tmp = re.sub('^A0', 'vv', jobid)
	conv_jobid = re.sub('^B0', 'va', tmp)
#	print '%s,%s,%s' % (conv_jobid, name, department)

	try:
		employee = Employee.objects.get(name = name)
		print 'Skip %s:%s' % (jobid, name)
		return False
	except Employee.DoesNotExist:
		do_add_employee(name, conv_jobid, department)

	return True

def employee_import(excel, sheet):
	book = xlrd.open_workbook(excel)
	sheet = book.sheet_by_index(sheet)
	total = 0

	for i in range(sheet.nrows):
		if i == 0:
			continue

		row = sheet.row(i)
		if add_employee(row):
			total += 1

	print 'imported %d entries' % total

	return True

if __name__ == '__main__':
	if len(sys.argv) < 2:
		usage()
		sys.exit(1)

	excel = sys.argv[1]

	if not employee_import(excel, vv_sheet):
		sys.exit(1)

	if not employee_import(excel, va_sheet):
		sys.exit(1)

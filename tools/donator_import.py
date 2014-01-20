#!/usr/bin/env python

import os, sys
import xlrd
import re

sys.path.append(os.path.join(os.getenv('PWD'), '..'))
os.environ['DJANGO_SETTINGS_MODULE'] = 'vvlottery.settings'

from lottery.models import Employee, Donator

vv_sheet = 0
va_sheet = 1

def usage():
	print 'Usage: donator_import.py <Excel file>'

def do_add_donator(employee):
	donator = Donator()
	donator.employee = employee
	donator.save()

def add_donator(row):
	jobid = row[1].value
	name = row[2].value
	title = row[3].value

	tmp = re.sub('^A0', 'vv', jobid)
	conv_jobid = re.sub('^B0', 'va', tmp)

	try:
		employee = Employee.objects.get(jobid = conv_jobid)
		if not employee.title:
			employee.title = title
			employee.save()
		do_add_donator(employee)
	except Employee.DoesNotExist:
		print "Can't find (%s %s)" % (jobid, name)
		return False

	return True

def donator_import(excel, sheet):
	book = xlrd.open_workbook(excel)
	sheet = book.sheet_by_index(sheet)
	total = 0

	for i in range(sheet.nrows):
		if i == 0:
			continue

		row = sheet.row(i)
		if add_donator(row):
			total += 1

	print 'imported %d entries' % total

	return True

if __name__ == '__main__':
	if len(sys.argv) < 2:
		usage()
		sys.exit(1)

	excel = sys.argv[1]

	if not donator_import(excel, vv_sheet):
		sys.exit(1)

	if not donator_import(excel, va_sheet):
		sys.exit(1)

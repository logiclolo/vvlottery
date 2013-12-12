#!/usr/bin/env python
# vim: set encoding=utf-8

import os, sys
import xlrd
import re

sys.path.append(os.path.join(os.getenv('PWD'), '..'))
os.environ['DJANGO_SETTINGS_MODULE'] = 'vvlottery.settings'

from lottery.models import Employee, Department, Prize, Presenter, Phase

sheet = 1
phases = {'phase1': u'員工獎', 'phase2': u'鹹魚翻身獎', 'phase3': u'地獄翻身獎'}

def usage():
	print 'Usage: prize_import.py <Excel file>'

def get_phase(phase):
	try:
		tmp = Phase.objects.get(name = phase)
		return tmp
	except Phase.DoesNotExist:
		return None

def add_phase(alias, phase):
	try:
		tmp = Phase.objects.get(name = phase)
		return tmp
	except Phase.DoesNotExist:
		tmp = Phase()
		tmp.name = phase
		tmp.alias = alias
		tmp.save()

	return tmp

def do_add_prize(name, serial, get_on_site):
	prize = Prize()
	prize.serial = serial
	prize.name = name
	prize.onsite = get_on_site

	phase = get_phase(phases['phase1'])
	if not phase:
		print 'No phase found: %s' % phases['phase1']
	
	prize.phase = phase
	prize.save()

def add_prize(row):
	field = row[0].value
	serial = int(row[1].value)
	name = row[2].value
	exists = False

	if field == '':
		get_on_site = False
	else:
		get_on_site = True
#	print '%s,%04d,%s' % ('true' if get_on_site else 'false', serial, name)

	try:
		prize = Prize.objects.get(serial = serial)
		print 'Skip %d:%s' % (serial, name)
		return False
	except Prize.DoesNotExist:
		do_add_prize(name, serial, get_on_site)

	return True

def prize_import(excel, sheet):
	book = xlrd.open_workbook(excel)
	sheet = book.sheet_by_index(sheet)
	total = 0

	for i in range(sheet.nrows):
		if i == 0:
			continue
		elif i == (sheet.nrows - 1):
			continue

		row = sheet.row(i)
		if add_prize(row):
			total += 1

	print 'imported %d entries' % total

	return True

if __name__ == '__main__':
	if len(sys.argv) < 2:
		usage()
		sys.exit(1)

	excel = sys.argv[1]

	for k, v in phases.iteritems():
		add_phase(k, v)

	if not prize_import(excel, sheet):
		sys.exit(1)


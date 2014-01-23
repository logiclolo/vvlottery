from django.db import models

# Create your models here.
class Department(models.Model):
	name = models.CharField(max_length = 32)

	def __unicode__(self):
		return self.name

class Employee(models.Model):
	jobid = models.CharField(max_length = 8)
	name = models.CharField(max_length = 16)
	department = models.ForeignKey(Department)
	title = models.CharField(max_length = 16)

	def __unicode__(self):
		return self.name

class Phase(models.Model):
	name = models.CharField(max_length = 16)
	alias = models.CharField(max_length = 8)

	def __unicode__(self):
		return self.name

class Donator(models.Model):
	employee = models.OneToOneField(Employee)
	donated = models.BooleanField(default = False)

	def __unicode__(self):
		return '%s %s' % (self.employee.name, self.employee.title)

class Presenter(models.Model):
	employee = models.OneToOneField(Employee)
	phase = models.ForeignKey(Phase, null = True)
	order = models.IntegerField()

	def __unicode__(self):
		return '%s %s' % (self.employee.name, self.employee.title)

class Prize(models.Model):
	name = models.CharField(max_length = 100)
	serial = models.IntegerField()
	winner = models.ForeignKey(Employee, null = True, blank = True)
	presenter = models.ForeignKey(Presenter, null = True, blank = True)
	phase = models.ForeignKey(Phase, null = True)
	received = models.BooleanField(default = False)
	onsite = models.BooleanField(default = False)
	donate_amount = models.IntegerField(default = 0)

	def __unicode__(self):
		return self.name

class Queue(models.Model):
	prize = models.OneToOneField(Prize)
	done = models.BooleanField(default = False)

	def __unicode__(self):
		return self.prize.name

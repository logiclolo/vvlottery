from lottery.models import Employee, Department, Prize, Presenter, Phase, Donator
from django.contrib import admin

admin.site.register(Department)
admin.site.register(Presenter)
admin.site.register(Phase)

class DonatorAdmin(admin.ModelAdmin):
	list_display = ('employee', 'donated')

admin.site.register(Donator, DonatorAdmin)

class EmployeeAdmin(admin.ModelAdmin):
	list_display = ('jobid', 'name', 'department')
	search_fields = ['jobid', 'name', 'department']

admin.site.register(Employee, EmployeeAdmin)

class PrizeAdmin(admin.ModelAdmin):
	list_display = ('phase', 'serial', 'name', 'winner', 'presenter')
	search_fields = ['serial', 'name']
	list_filter = ['phase']

admin.site.register(Prize, PrizeAdmin)

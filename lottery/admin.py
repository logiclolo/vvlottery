from lottery.models import Employee, Department, Prize, Presenter
from django.contrib import admin

admin.site.register(Department)
admin.site.register(Presenter)

class EmployeeAdmin(admin.ModelAdmin):
	list_display = ('jobid', 'name', 'department')
	search_fields = ['jobid', 'name', 'department']

admin.site.register(Employee, EmployeeAdmin)

class PrizeAdmin(admin.ModelAdmin):
	list_display = ('serial', 'name', 'winner', 'presenter')
	search_fields = ['serial', 'name']

admin.site.register(Prize, PrizeAdmin)

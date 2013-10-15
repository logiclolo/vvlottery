from django.conf.urls import patterns, url

urlpatterns = patterns('lottery.views',
    url(r'^employee/$', 'employee'),
    url(r'^employee_page/$', 'employee_page'),
    url(r'^prize/$', 'prize'),
    url(r'^presenter/$', 'presenter'),
)

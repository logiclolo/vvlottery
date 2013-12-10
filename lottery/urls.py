from django.conf.urls import patterns, url

urlpatterns = patterns('lottery.views',
    url(r'^employee/$', 'employee'),
    url(r'^prize/$', 'prize'),
    url(r'^prize_list/$', 'prize_list'),
    url(r'^prize_list_all/$', 'prize_list'),
    url(r'^prize_input/$', 'prize_input'),
    url(r'^prize_import/$', 'prize_import'),
    url(r'^prize_print/$', 'prize_print'),
    url(r'^add_prize/$', 'add_prize'),
    url(r'^presenter/$', 'presenter'),
)

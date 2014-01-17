from django.conf.urls import patterns, url

urlpatterns = patterns('lottery.views',
    url(r'^employee/$', 'employee'),
    url(r'^prize/$', 'prize'),
    url(r'^prize_list/$', 'prize_list'),
    url(r'^prize_input/$', 'prize_input'),
    url(r'^prize_print/$', 'prize_print'),
    url(r'^add_prize/$', 'add_prize'),
    url(r'^presenter/$', 'presenter'),
    url(r'^donator/$', 'donator'),
    url(r'^queue/$', 'queue'),
    url(r'^add_queue/$', 'add_queue'),
    url(r'^del_queue/$', 'del_queue'),
    url(r'^set_queue_done/$', 'set_queue_done'),
)

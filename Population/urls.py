from django.conf.urls import patterns, include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

from Main.views import *
# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    url(r'^$', main),
    url(r'^(\d{1,2})/$', detail),
    url(r'^heatMap/(\d{1,2})/$', heatMap),
    url(r'^stackedBar/(\d{1,2})/$', stackedBar),
    url(r'^groupBarChart/(\d{1,2})/$', groupBarChart),
    url(r'^kmeans/(\d{1,2})/$', kmeans),
    # url(r'^Population/', include('Population.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
)

urlpatterns += staticfiles_urlpatterns()

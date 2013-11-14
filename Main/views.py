# -*- coding:utf-8 -*-
from django.shortcuts import *
from Population import settings

from os import listdir

# Create your views here.
def main(request):
    #Read File From Folder
    FolderPath = settings.STATICFILES_DIRS[0] + '/Datas/'
    print FolderPath
    CityList = []
    for file in listdir(FolderPath):
        CityList.append(file)
        f = open(FolderPath + file)
        f.read()

    return render_to_response('index.html', RequestContext(request))

def detail(request, citynum):
    #Read File From Folder
    FolderPath = settings.STATICFILES_DIRS[0] + '/Datas/'
    CityList = []
    for file in listdir(FolderPath):
        CityList.append(file)
    filename = listdir(FolderPath)[int(citynum)]
    DataURL = "http://127.0.0.1:8000" + settings.STATIC_URL + "Datas/" + filename
    print DataURL


<<<<<<< HEAD
    return render_to_response('index.html', RequestContext(request, {'CityList': CityList, 'DataURL' : DataURL}))

def stackedBar(request):
    return render_to_response('stackedBar.html', RequestContext(request))
=======
    return render_to_response('population.html', RequestContext(request, {'CityList': CityList, 'DataURL' : DataURL}))

def heatMap(request, citynum):
    #Read File From Folder
    FolderPath = settings.STATICFILES_DIRS[0] + '/Datas/'
    CityList = []
    for file in listdir(FolderPath):
        CityList.append(file)
    filename = listdir(FolderPath)[int(citynum)]
    DataURL = "http://127.0.0.1:8000" + settings.STATIC_URL + "Datas/" + filename
    print DataURL


    return render_to_response('heatMap.html', RequestContext(request, {'CityList': CityList, 'DataURL' : DataURL}))
>>>>>>> 6b77ff10507e468a1d7448f83b5c89e0a103157f

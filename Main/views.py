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
    DataURL = settings.HOST + settings.STATIC_URL + "Datas/" + filename

    return render_to_response('population.html', RequestContext(request, {'CityList': CityList, 'DataURL' : DataURL}))

def heatMap(request, citynum):
    #Read File From Folder
    FolderPath = settings.STATICFILES_DIRS[0] + '/Datas/'
    CityList = []
    for file in listdir(FolderPath):
        CityList.append(file)
    filename = listdir(FolderPath)[int(citynum)]
    DataURL = settings.HOST + settings.STATIC_URL + "Datas/" + filename

    return render_to_response('heatMap.html', RequestContext(request, {'CityList': CityList, 'DataURL' : DataURL}))

def stackedBar(request, citynum):
    #Read File From Folder
    FolderPath = settings.STATICFILES_DIRS[0] + '/Datas/'
    CityList = []
    for file in listdir(FolderPath):
        CityList.append(file)
    filename = listdir(FolderPath)[int(citynum)]
    DataURL = settings.HOST + settings.STATIC_URL + "Datas/" + filename
    return render_to_response('stackedBar.html', RequestContext(request, {'CityList': CityList, 'DataURL' : DataURL}))

def groupBarChart(request, citynum):
    #Read File From Folder
    FolderPath = settings.STATICFILES_DIRS[0] + '/Datas/'
    CityList = []
    for file in listdir(FolderPath):
        CityList.append(file)
    filename = listdir(FolderPath)[int(citynum)]
    DataURL = settings.HOST + settings.STATIC_URL + "Datas/" + filename
    return render_to_response('groupBarChart.html', RequestContext(request, {'CityList': CityList, 'DataURL' : DataURL}))

def kmeans(request, citynum):
    #Read File From Folder
    FolderPath = settings.STATICFILES_DIRS[0] + '/KMeansDatas/'
    CityList = []
    for file in listdir(FolderPath):
        CityList.append(file)
    filename = listdir(FolderPath)[int(citynum)]
    DataURL = settings.HOST + settings.STATIC_URL + "KMeansDatas/" + filename
    return render_to_response('kmeans.html', RequestContext(request, {'CityList': CityList, 'DataURL' : DataURL}))
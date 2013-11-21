DataCooking
===========

Javascript Library for Developing


<!DOCTYPE html>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<html>
<head>
    <title></title>
</head>
<style>
    body {
    font: 10px sans-serif;
    }

    .axis path,
    .axis line {
    fill: none;
    stroke: #000;
    shape-rendering: crispEdges;
    }
    rect.bordered {
        stroke: #E6E6E6;
        stroke-width:2px;
    }


</style>
<body>
<script src="../../DataCooking/DataCooking.js"></script>
<script src="../../DataCooking/Status.js"></script>
<script src="../../DataCooking/FormatConverter.js"></script>

<div class="container" id="container">
    Stacked Bar Chart
    <div id = "stackbar" width = 1000 height = '900'></div>
    <br />
    <br />
    Heat Map
    <div id = "heatmap" width = 1000 height = '900'></div>
    <br />
    <br />
    Grouped Bar Chart
    <div id = "groupbar" width = 1000 height = '900'></div>
    <br />
    <br />
    KMeans Chart-Earth quake   : 2013 07 08 ~ 2013 11 13
    <div id = "ekmeans" width = 1000 height = '900'></div>
    <br />
    <br />
    KMeans Chart-Earth quake  : 1900 ~ 2000, magnitude > 5
    <div id = "dkmeans" width = 1000 height = '900'></div>
    <br />
    <br />
    Stacked Bar Chart-iris
    <div id = "istackbar" width = 1000 height = '900'></div>
    <br />
    <br />
    KMeans Chart-iris
    <div id = "ikmeans" width = 1000 height = '900'></div>
    <br />
    <br />
    pie Chart
    <div id = "piechart" width = 1000 height = '900'></div>
    <br />
    <br />
</div>
<script>
    var stackbar_config = {
        'panel' : '#stackbar',
        'width' : 1050,
        'height' : 500,
        'margin': {top: 20, right: 20, bottom: 30, left: 40},
        'xAxis': {range : 'ordinal', orient : 'bottom'},
        'yAxis': {range : 'linear', orient : 'left', tickFormat : '.2s' },
        'dataSource' : "population.csv", // '{{DataURL}}'
        'color': {tool: ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]}
    }

    drawChart('StackedBarChart', stackbar_config);

    var heatmap_config = {
        'panel' : '#heatmap',
        'margin': { top: 50, right: 0, bottom: 100, left: 170 },
        'width': 960,
        'height': 430,
        'dataSource' : "population.csv", // '{{DataURL}}'
        'color': {tool: 'colorbrewer', type : 'YlGnBu', size : 9}    //정확하게 type을 명시해주어야 color값이 받아진다.
        //["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58", "#000000"]
    };

    drawChart('HeatMap', heatmap_config);

    var groupbar_config = {
        'panel' : '#groupbar',
        'margin': {top: 20, right: 20, bottom: 30, left: 100},
        'width': 960,
        'height': 430,
        'xAxis': {range: 'ordinal', orient : 'bottom'},
        'yAxis': {range : 'linear', orient : 'left' , tickFormat : ".2s"},
        'dataSource' : "population.csv", // '{{DataURL}}'
       // 'xData': 'Longitude',
       // 'yData': 'Latitude',
        'color': {tool:["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"], 'Data' : 'K'} // ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]
    };
    drawChart('GroupBarChart', groupbar_config);

    var kmeans_config = {
        'panel' : '#ekmeans',
        'margin': {top: 20, right: 20, bottom: 30, left: 40},
        'width': 960,
        'height': 500,
        'xAxis': {range : 'linear', orient : 'bottom'},
        'yAxis': {range : 'linear', orient : 'left' },
        'dataSource' : "dataeq.csv", // '{{DataURL}}'
        'xData': 'Longitude',
        'yData': 'Latitude',
        'color': {tool: 'category10', Data : 'K'}
        //["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58", "#000000"]
    };
    drawChart('KMeansChart', kmeans_config);

    var kmeans_config = {
        'panel' : '#dkmeans',
        'margin': {top: 20, right: 20, bottom: 30, left: 40},
        'width': 960,
        'height': 500,
        'xAxis': {range : 'linear', orient : 'bottom'},
        'yAxis': {range : 'linear', orient : 'left' },
        'dataSource' : "datadh.csv", // '{{DataURL}}'
        'xData': 'Longitude',
        'yData': 'Latitude',
        'color': {tool: 'category10', Data : 'K'}
        //["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58", "#000000"]
    };
    drawChart('KMeansChart', kmeans_config);

    var stackbar_config = {
        'panel' : '#istackbar',
        'width' : 1000,
        'height' : 500,
        'margin': {top: 20, right: 20, bottom: 30, left: 40},
        'xAxis': {range : 'ordinal', orient : 'bottom'},
        'yAxis': {range : 'linear', orient : 'left', tickFormat : '.2s' },
        'dataSource' : "iris.csv", // '{{DataURL}}'
        'color': {tool: ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]}
    }

    drawChart('StackedBarChart', stackbar_config);

    var iris_config = {
        'panel' : '#ikmeans',
        'margin': {top: 20, right: 20, bottom: 30, left: 40},
        'width': 960,
        'height': 500,
        'xAxis': {range : 'linear', orient : 'bottom'},
        'yAxis': {range : 'linear', orient : 'left' },
        'dataSource' : "iris.csv", // '{{DataURL}}'
        'xData': 'Sepal_length',
        'yData': 'Sepal_width',
        'color': {tool: 'category10', Data : 'Species'}
    };
    drawChart('KMeansChart', iris_config);

</script>

</body>
</html>
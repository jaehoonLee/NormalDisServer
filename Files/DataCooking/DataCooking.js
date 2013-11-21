//Import Files
STATIC_URL = "http://127.0.0.1:8000/static/DataCooking/";

document.write("<script src=\"http://d3js.org/d3.v3.min.js\"></script>");
document.write("<script src=\"http://d3js.org/colorbrewer.v1.min.js\"></script>");
document.write("<script type=\"text/javascript\" src=" + "\"" + STATIC_URL + "Status.js\"" + "></script>");
document.write("<script type=\"text/javascript\" src=" + "\"" + STATIC_URL + "FormatConverter.js\"" + "></script>");

function drawChart(chartname, config)
{
    switch (chartname)
    {
        case 'PopulationPyramid':
            getPopulation(config);
            break;
        case 'HeatMap':
            getHeatMap(config);
            break;
        case 'GroupBarChart':
            getGroupBarChart(config);
            break;
        case 'StackedBarChart':
            getStackedBarChart(config);
            break;
        case 'KMeansChart':
            getKMeansChart(config);
            break;
        default :
            break;
    }

}
var processConfig = function (config){
    this.config = config;

    this.panel = config['panel'];

    this.width = setWidth(config['width']);
    this.height = setHeight(config['height']);

    this.color;
    this.colorTool;
    switch(config['color']['tool']){
        case 'category10' :
        case 'category20' :
        case 'category20b' :
        case 'category20c' :
            this.colorTool = d3.scale[config['color']['tool']]();
            break;
        case 'colorbrewer' :
            this.colorTool = d3.scale.ordinal().range(d3.range(config['color']['size']));
            this.color = colorbrewer[config['color']['type']][config['color']['size']];
            break;
        default :
            this.color = config['color']['tool'];
            this.colorTool = d3.scale.ordinal().range(config['color']['tool']);

    };

    this.x = d3.scale[config['xAxis']['range']]()
        .range([0, config['width']]);

    this.y = d3.scale[config['yAxis']['range']]()
        .range([config['height'], 0]);

    this.xAxis = d3.svg.axis()
        .scale(this.x)
        .orient(config['xAxis'].orient);

    this.yAxis = d3.svg.axis()
        .scale(this.y)
        .orient(config['yAxis'].orient);

    this.svg = d3.select(config['panel']).append("svg")
        .attr("width", config['width'] +config['margin'].left + config['margin'].right)
        .attr("height",config['height'] +config['margin'].top +config['margin'].bottom)
        .append("g")
        .attr("transform", "translate(" + config['margin'].left + "," + config['margin'].top + ")");

    this.dataSource = config['dataSource'];
    this.xData = config['xData'];
    this.yData = config['yData'];
    this.colorData = config['color']['Data'];

    function setWidth(width){
        if(width == undefined ){
            width = this.panel.offsetWidth;
        }
        return width;
    }
    function setHeight(height){
        if(height == undefined ){
            height = this.panel.offsetHeight;
        }
        return height;
    }

}

function getPopulation(config)
{

    var margin = {top: 20, right: 40, bottom: 30, left: 40},
        width = config.width - margin.left - margin.right,
        height = config.height - margin.top - margin.bottom,
        barWidth = Math.floor(width / 20) - 1;

    var x = d3.scale.linear().range([barWidth / 2, width - barWidth / 2]);
    var y = d3.scale.linear().range([height, 0]);
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickSize(width)
        .tickFormat(function (d) {
            return Math.round(d / 1e6) + "M";
        });

// An SVG element with a bottom-right origin.
    var svg = d3.select(".container").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// A sliding container to hold the bars by birthyear.
    var birthyears = svg.append("g")
        .attr("class", "birthyears");

// A label for the current year.
    var title = svg.append("text")
        .attr("x", width - 140)
        .attr("class", "title")
        .attr("dy", ".71em")

    d3[config.format](config.dataSource, function(error, data) {
//d3.csv('{{ DataURL }}', function (error, data) {

        // Convert strings to numbers.
        data.forEach(function (d) {
            d.people = +d.people;
            d.year = +d.year;
            d.age = +d.age;
        });

        // Compute the extent of the data set in age and years.
        var age1 = d3.max(data, function (d) {
                return d.age;
            }),
            year0 = d3.min(data, function (d) {
                return d.year;
            }),
            year1 = d3.max(data, function (d) {
                return d.year;
            }),
            year = year1;
        title.text(year);

        // Update the scale domains.
        x.domain([year1, year1 - age1]);
        y.domain([0, d3.max(data, function (d) {
            return d.people;
        })]);

        // Produce a map from year and birthyear to [male, female].

        data = d3.nest()
            .key(function (d) {
                return d.year;
            })
            .key(function (d) {
                return d.year - d.age;
            })
            .rollup(function (v) {
                return v.map(function (d) {
                    return d.people;
                });
            })
            .map(data);

        // Add an axis to show the population values.
        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + width + ",0)")
            .call(yAxis)
            .selectAll("g")
            .filter(function (value) {
                return !value;
            })
            .classed("zero", true);

        // Add labeled rects for each birthyear (so that no enter or exit is required).
        console.log("a:" + (year0 - age1))
        console.log("b:" + (year1 + 1))
        var birthyear = birthyears.selectAll(".birthyear")
            .data(d3.range(year0 - age1, year1 + 1, 1))//jhun88 : 범위가 10에서 1로 바뀜에 따라, mapping index 값이 안 맞게 되었다. 그래서 1을 넣어주었다.
            .enter().append("g")
            .attr("class", "birthyear")
            .attr("transform", function (birthyear) {
                return "translate(" + x(birthyear) + ",0)";
            });


        //set value
        birthyear.selectAll("rect")
            .data(function (birthyear) {
                return data[year][birthyear] || [0, 0];
            })
            .enter().append("rect")
            .attr("x", -barWidth / 2)
            .attr("width", barWidth)
            .attr("y", y)
            .attr("height", function (value) {
                return height - y(value);
            });

        var diff = 1;
        // Add labels to show age (separate; not animated).
        svg.selectAll(".age")
            .data(d3.range(0, age1 + 1, 5))
            .enter().append("text")
            .attr("class", "age")
            .attr("x", function (age) {
                return x(year - age);
            })
            .attr("y", height + 4)
            .attr("dy", ".71em")
            .text(function (age) {
                return age;
            });

        // Allow the arrow keys to change the displayed year.
        window.focus();
        d3.select(window).on("keydown", function () {
            switch (d3.event.keyCode) {
                case 37:
                    year = Math.max(year0, year - diff);
                    break;
                case 39:
                    year = Math.min(year1, year + diff);
                    break;
            }
            update();
        });

        function update() {
            if (!(year in data)) return;
            title.text(year);

            console.log(year1 + " " + year)
            birthyears.transition()
                .duration(750)
                .attr("transform", "translate(" + (x(year1) - x(year)) + ",0)");

            birthyear.selectAll("rect")
                .data(function (birthyear) {

                    console.log((year1-year) + " " + (birthyear) + ":" + data[year][birthyear + 1])
                    return data[year][birthyear] || [0, 0];
                })
                .transition()
                .duration(750)
                .attr("y", y)
                .attr("height", function (value) {
                    return height - y(value);
                });
        }
    });
}

function getHeatMap(config)
{
    var gridSize = Math.floor(config.width / 24),
        legendElementWidth = gridSize*2,
        buckets = 100000,
        days = [],
        ages = ["0", "5", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55", "60", "65", "70", "75", "80", "85", "90", "95"];

    var processConfig = function (config){
        this.config = config;
        this.panel = config['panel'];
        this.margin = config['margin'];
        this.width = config['width'];
        this.height = config['height'];
        //this.x = d3.scale[config['xAxis']['range']]().rangeRoundBands([0, this.width], .1);
        //this.x1 = d3.scale[config['xAxis']['range']]();
        //this.y = d3.scale[config['yAxis']['range']]().range([this.height, 0]) //d3.scale.linear()
        this.color;
        this.colorTool ;
        switch(config['color']['tool']){
            case 'category10' :
            case 'category20' :
            case 'category20b' :
            case 'category20c' :
                this.colorTool = d3.scale[config['color']['tool']]();
                break;
            case 'colorbrewer' :
                this.colorTool = d3.scale.ordinal().range(d3.range(config['color']['size']));
                this.color = colorbrewer[config['color']['type']][config['color']['size']];
                break;
            default :
                this.color = config['color']['tool'];
                this.colorTool = d3.scale.ordinal().range(config['color']['tool']);

        };
        this.dataSource = config.dataSource;
        //no xAxis and yAxis
        this.svg = d3.select(this.panel).append("svg")
            .attr("width", this.width + this.margin['left'] + this.margin['right'])
            .attr("height", this.height + this.margin['top'] + this.margin['bottom'])
            .append("g")
            .attr("transform", "translate(" + this.margin['left'] + "," + this.margin['top'] + ")");
        this.format = config.format
    }
    var newAxis = new processConfig(config);
    d3[config.format](config.dataSource,
        function(d) {
            return {
                year: +d.year,
                age: +d.age,
                sex: +d.sex,
                people: +d.people
            };
        },
        function(error, data) {

            days = {}
            minYear = d3.min(data, function(d){
                if(d.sex == 1)
                    days[d.year + ' 남자'] = d.age;
                else
                    days[d.year + ' 여자'] = d.age;
                return d.year;})
            days = Object.keys(days);

            buckets = d3.max(data, function(d){ return d.people}) / 2

            var colorScale = d3.scale.quantile()
                .range(newAxis.color)
                .domain([0, buckets - 1, d3.max(data, function (d) { return d.people; })]);


            var yearLabels = newAxis.svg.selectAll(".dayLabel")
                .data(days)
                .enter().append("text")
                .text(function (d) { return d; })
                .attr("x", 0)
                .attr("y", function (d, i) { return i * gridSize; })
                .style("text-anchor", "end")
                .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
                .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

            var timeLabels = newAxis.svg.selectAll(".ageLabel")
                .data(ages)
                .enter().append("text")
                .text(function(d) { return d; })
                .attr("x", function(d, i) { return i * gridSize; })
                .attr("y", 0)
                .style("text-anchor", "middle")
                .attr("transform", "translate(" + gridSize / 2 + ", -6)")
                .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

            var heatMap = newAxis.svg.selectAll(".age")
                .data(data)
                .enter().append("rect")
                .attr("x", function(d) { return (d.age/5) * gridSize; })
                .attr("y", function(d) { if(d.sex == 1)
                    return (2 * (d.year - minYear)) * gridSize;
                else
                    return (2 * (d.year - minYear)+1) * gridSize; })
                .attr("rx", 4)
                .attr("ry", 4)
                .attr("class", "hour bordered")
                .attr("width", gridSize)
                .attr("height", gridSize)
                .style("fill", newAxis.color[0]);
            heatMap.transition().duration(1000)
                .style("fill", function(d) { return colorScale(d.people); });

            heatMap.append("title").text(function(d) { return d.people; });


            //Legend
            var legend = newAxis.svg.selectAll(".legend")
                .data([0].concat(colorScale.quantiles()), function(d) { return d; })
                .enter().append("g")
                .attr("class", "legend");

            legend.append("rect")
                .attr("x", function(d, i) { return legendElementWidth * i; })
                .attr("y", newAxis.height)
                .attr("width", legendElementWidth)
                .attr("height", gridSize / 2)
                .style("fill", function(d, i) { return newAxis.color[i]; });  //colors[i]

            legend.append("text")
                .attr("class", "mono")
                .text(function(d) { return "≥ " + Math.round(d); })
                .attr("x", function(d, i) { return legendElementWidth * i; })
                .attr("y", newAxis.height + gridSize);
        });
}


function getGroupBarChart(config)
{

    var processConfig = function (config){
        this.config = config;
        this.panel = config['panel'];
        this.margin = config['margin'];
        this.width = config['width'];
        this.height = config['height'];
        this.x = d3.scale[config['xAxis']['range']]().rangeRoundBands([0, this.width], .1);
        this.x1 = d3.scale[config['xAxis']['range']]();
        this.y = d3.scale[config['yAxis']['range']]().range([this.height, 0]) //d3.scale.linear()
        this.colorTool ;
        switch(config['color']['tool']){
            case 'category10' :
            case 'category20' :
            case 'category20b' :
            case 'category20c' :
                this.colorTool = d3.scale[config['color']['tool']]();
                break;
            default :
                this.colorTool = d3.scale.ordinal().range(config['color']['tool']);

        };
        this.dataSource = config.dataSource;
        this.xAxis = d3.svg.axis()
            .scale(this.x)
            .orient(config['xAxis']['orient']);
        this.yAxis = d3.svg.axis()
            .scale(this.y)
            .orient(config['yAxis']['orient'])
            .tickFormat(d3.format(config['yAxis']['tickFormat']));
        this.svg = d3.select(this.panel).append("svg")
            .attr("width", this.width + this.margin['left'] + this.margin['right'])
            .attr("height", this.height + this.margin['top'] + this.margin['bottom'])
            .append("g")
            .attr("transform", "translate(" + this.margin['left'] + "," + this.margin['top'] + ")");

    }
    var newAxis = new processConfig(config);
    d3[config.format](config.dataSource, function(error, data) {
        data = convertFormat(data);

        var ageNames = d3.keys(data[0]).filter(function(key) { return key !== "year"; });

        data.forEach(function(d) {
            d.ages = ageNames.map(function(name) { return {name: name, value: +d[name]}; });
        });

        newAxis.x.domain(data.map(function(d) { return d.year; }));
        newAxis.x1.domain(ageNames).rangeRoundBands([0, newAxis.x.rangeBand()]);
        newAxis.y.domain([0, d3.max(data, function(d) { return d3.max(d.ages, function(d) { return d.value; }); })]);

        newAxis.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + newAxis.height + ")")
            .call(newAxis.xAxis);

        newAxis.svg.append("g")
            .attr("class", "y axis")
            .call(newAxis.yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Population");

        var state = newAxis.svg.selectAll(".state")
            .data(data)
            .enter().append("g")
            .attr("class", "g")
            .attr("transform", function(d) { return "translate(" + newAxis.x(d.year) + ",0)"; });

        state.selectAll("rect")
            .data(function(d) { return d.ages; })
            .enter().append("rect")
            .attr("width", newAxis.x1.rangeBand())
            .attr("x", function(d) { return newAxis.x1(d.name); })
            .attr("y", function(d) { return newAxis.y(d.value); })
            .attr("height", function(d) { return newAxis.height - newAxis.y(d.value); })
            .style("fill", function(d) { return newAxis.colorTool(d.name); });

        var legend = newAxis.svg.selectAll(".legend")
            .data(ageNames.slice().reverse())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("rect")
            .attr("x", newAxis.width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", newAxis.colorTool);

        legend.append("text")
            .attr("x", newAxis.width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d; });

    });
}

function getStackedBarChart(config)
{
    var processConfig = function (config) {
        this.config = config;
        this.width = config.width;
        this.height = config.height;

        this.x = d3.scale[config['xAxis']['range']]()
            .rangeRoundBands([0, this.width], .1);

        this.y = d3.scale[config['yAxis']['range']]()
            .rangeRound([this.height, 0]);

        this.color;
        this.colorTool;
        switch(config['color']['tool']){
            case 'category10' :
            case 'category20' :
            case 'category20b' :
            case 'category20c' :
                this.colorTool = d3.scale[config['color']['tool']]();
                break;
            case 'colorbrewer' :
                this.colorTool = d3.scale.ordinal().range(d3.range(config['color']['size']));
                this.color = colorbrewer[config['color']['type']][config['color']['size']];
                break;
            default :
                this.color = config['color']['tool'];
                this.colorTool = d3.scale.ordinal().range(config['color']['tool']);

        };

        this.dataSource = config.dataSource;
        this.xAxis = d3.svg.axis()
            .scale(this.x)
            .orient(config['xAxis']['orient']);

        this.yAxis = d3.svg.axis()
            .scale(this.y)
            .orient(config['yAxis']['orient'])
            .tickFormat(d3.format(config['yAxis']['tickFormat']));

        this.svg = d3.select(config.panel).append("svg")
            .attr("width", this.width + config['margin'].left + config['margin'].right)
            .attr("height", this.height + config['margin'].top + config['margin'].bottom)
            .append("g")
            .attr("transform", "translate(" + config['margin'].left + "," + config['margin'].top + ")");

    }
    var newAxis = new processConfig(config);
    d3[config.format](config.dataSource, function(error, data) {

        //data Converting
        data = convertFormat(data);

        newAxis.colorTool.domain(d3.keys(data[0]).filter(function(key) { return key !== "year"; }));
        data.forEach(function(d) {
            var y0 = 0;
            d.ages = newAxis.colorTool.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
            d.total = d.ages[d.ages.length - 1].y1;
        });

        data.sort(function(a, b) { return b.total - a.total; });

        newAxis.x.domain(data.map(function(d) { return d.year; }));
        newAxis.y.domain([0, d3.max(data, function(d) { return d.total; })]);

        newAxis.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + newAxis.height + ")")
            .call(newAxis.xAxis);

        newAxis.svg.append("g")
            .attr("class", "y axis")
            .call(newAxis.yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Population");

        var state = newAxis.svg.selectAll(".state")
            .data(data)
            .enter().append("g")
            .attr("class", "g")
            .attr("transform", function(d) { return "translate(" + newAxis.x(d.year) + ",0)"; });

        state.selectAll("rect")
            .data(function(d) { return d.ages; })
            .enter().append("rect")
            .attr("width", newAxis.x.rangeBand())
            .attr("y", function(d) { return newAxis.y(d.y1); })
            .attr("height", function(d) { return newAxis.y(d.y0) - newAxis.y(d.y1); })
            .style("fill", function(d) { return newAxis.colorTool(d.name); });

        var legend = newAxis.svg.selectAll(".legend")
            .data(newAxis.colorTool.domain().slice().reverse())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("rect")
            .attr("x", newAxis.width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", newAxis.colorTool);

        legend.append("text")
            .attr("x", newAxis.width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d; });
    });

}


function getKMeansChart(config)
{
    var newAxis = new processConfig(config);

    d3[config.format](newAxis.dataSource, type, function (error, data) {

        newAxis.x.domain(d3.extent(data, function (d) {
//            if(d[newAxis.xData] < 0)
//                return d[newAxis.xData] + 360;
//            else
           return d[newAxis.xData];
        }));
        newAxis.y.domain(d3.extent(data, function (d) {
            return d[newAxis.yData];
        }));
        newAxis.colorTool.domain(d3.extent(data, function (d) {
            return d[newAxis.colorData];
        }));

        newAxis.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + newAxis.height + ")")
            .call(newAxis.xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", newAxis.width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text("Longitude");

        newAxis.svg.append("g")
            .attr("class", "y axis")
            .call(newAxis.yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Latitude");

        newAxis.svg.selectAll(".point")
            .data(data)
            .enter().append("circle")
            .attr("class", "point")
            .attr("r", 4)
            .attr("cx", function (d) {
//                if(d[newAxis.xData] < 0)
//                    return newAxis.x(d[newAxis.xData] + 360);
//                else
//                    return newAxis.x(d[newAxis.xData]);
                return newAxis.x(d[newAxis.xData]);
            })
            .attr("cy", function (d) {
                return newAxis.y(d[newAxis.yData]);
            })
            .style("fill", function (d) {
                return newAxis.colorTool(d[newAxis.colorData]);
            });

        var legend = newAxis.svg.selectAll(".legend")
            .data(newAxis.colorTool.domain())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) {
                return "translate(0," + i * 20 + ")";
            });

        legend.append("rect")
            .attr("x", newAxis.width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", newAxis.colorTool);

        legend.append("text")
            .attr("x", newAxis.width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function (d) {
                return d;
            });
    });
    function type(d) {
        d[newAxis.xData] = +d[newAxis.xData];
        d[newAxis.yData] = +d[newAxis.yData];
        return d;

    }
}

//function getPieChart(config) {
//    var config = {
//        'panel' : '#piechart',
//        'margin': {top: 20, right: 20, bottom: 30, left: 20},
//        'width': 960,
//        'height': 500,
//        //'radius' : ,
//
//        'dataSource' : "dataeq.csv", // '{{DataURL}}'
//        'pieData' : ,
//        'color': {tool: 'category10', Data : 'Species'}
//    };
//    var width = 960,
//        height = 620,
//        radius = Math.min(width, height) / 2;
//
//    var color = d3.scale.category20c();
//
//    var arc = d3.svg.arc()
//        .outerRadius(radius - 20)
//        .innerRadius(0);
//
//    var pie = d3.layout.pie()
//        .sort(null)
//        .value(function(d) { return d.population; });
//
//    var svg = d3.select("body").append("svg")
//        .attr("width", width)
//        .attr("height", height)
//        .append("g")
//        .attr("transform", "translate(" + 0+ "," + 20 + ")");
//
//
//    d3.csv("data.csv", function(error, data) {
//
//        data.forEach(function(d) {
//            d.population = +d.population;
//        });
//
//        var subject = svg
//            .append("text")
//            .attr("class", "subject")
//            .attr("transform",  "translate(" + (width/2 -40) + "," + 0 + ")")
//            .text("Population Chart");
//
//        var g = svg.selectAll(".arc")
//            .data(pie(data))
//            .enter().append("g")
//            .attr("class", "arc")
//            .attr('transform', "translate("+width/2+","+height/2+")");
//
//        g.append("path")
//            .attr("d", arc)
//            .style("fill", function(d) { return color(d.data.age); })
//            .on("mouseover", function(){
//                d3.select(this).style("fill", "green");})
//            .on("mouseout", function(){d3.select(this).style("fill", function(d) { return color(d.data.age);})});
//
//
//        g.append("text")
//            .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
//            .attr("dy", ".35em")
//            .style("text-anchor", "middle")
//            .text(function(d) { return d.data.age; });
//
//    });
//}
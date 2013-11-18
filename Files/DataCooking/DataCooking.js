//Import Files
STATIC_URL = "http://127.0.0.1:8000/static/DataCooking/";

document.write("<script type=\"text/javascript\" src=\"http://d3js.org/d3.v3.min.js\"></script>");
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
        default :
            break;
    }

}

function getPopulation(config)
{
    console.log(CHART_STACKEDBARCHART);
    convertFormat("a");

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

    d3.csv(config.dataSource, function(error, data) {
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
    var margin = { top: 50, right: 0, bottom: 100, left: 170 },
        width = config.width,
        height = config.height,
        gridSize = Math.floor(width / 24),
        legendElementWidth = gridSize*2,
        buckets = 100000,
        colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"], // alternatively colorbrewer.YlGnBu[9]
        days = [],
        ages = ["0", "5", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55", "60", "65", "70", "75", "80", "85", "90", "95"];

    //change to number
    d3.csv(config.dataSource,
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
                .domain([0, buckets - 1, d3.max(data, function (d) { return d.people; })])
                .range(colors);

            var svg = d3.select("#chart").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var yearLabels = svg.selectAll(".dayLabel")
                .data(days)
                .enter().append("text")
                .text(function (d) { return d; })
                .attr("x", 0)
                .attr("y", function (d, i) { return i * gridSize; })
                .style("text-anchor", "end")
                .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
                .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

            var timeLabels = svg.selectAll(".ageLabel")
                .data(ages)
                .enter().append("text")
                .text(function(d) { return d; })
                .attr("x", function(d, i) { return i * gridSize; })
                .attr("y", 0)
                .style("text-anchor", "middle")
                .attr("transform", "translate(" + gridSize / 2 + ", -6)")
                .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

            var heatMap = svg.selectAll(".age")
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
                .style("fill", colors[0]);

            heatMap.transition().duration(1000)
                .style("fill", function(d) { return colorScale(d.people); });

            heatMap.append("title").text(function(d) { return d.people; });


            //Legend
            var legend = svg.selectAll(".legend")
                .data([0].concat(colorScale.quantiles()), function(d) { return d; })
                .enter().append("g")
                .attr("class", "legend");

            legend.append("rect")
                .attr("x", function(d, i) { return legendElementWidth * i; })
                .attr("y", height)
                .attr("width", legendElementWidth)
                .attr("height", gridSize / 2)
                .style("fill", function(d, i) { return colors[i]; });

            legend.append("text")
                .attr("class", "mono")
                .text(function(d) { return "≥ " + Math.round(d); })
                .attr("x", function(d, i) { return legendElementWidth * i; })
                .attr("y", height + gridSize);
        });
}

function getGroupBarChart(config)
{
    var margin = {top: 20, right: 20, bottom: 30, left: 100},
        width = config.width,
        height = config.height - margin.top - margin.bottom;

    var x0 = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var x1 = d3.scale.ordinal();

    var y = d3.scale.linear()
        .range([height, 0]);

    var color = d3.scale.ordinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    var xAxis = d3.svg.axis()
        .scale(x0)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(d3.format(".2s"));

    var svg = d3.select(".container").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv(config.dataSource, function(error, data) {
        data = convertFormat(data);

        var ageNames = d3.keys(data[0]).filter(function(key) { return key !== "year"; });

        data.forEach(function(d) {
            d.ages = ageNames.map(function(name) { return {name: name, value: +d[name]}; });
        });

        x0.domain(data.map(function(d) { return d.year; }));
        x1.domain(ageNames).rangeRoundBands([0, x0.rangeBand()]);
        y.domain([0, d3.max(data, function(d) { return d3.max(d.ages, function(d) { return d.value; }); })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Population");

        var state = svg.selectAll(".state")
            .data(data)
            .enter().append("g")
            .attr("class", "g")
            .attr("transform", function(d) { return "translate(" + x0(d.year) + ",0)"; });

        state.selectAll("rect")
            .data(function(d) { return d.ages; })
            .enter().append("rect")
            .attr("width", x1.rangeBand())
            .attr("x", function(d) { return x1(d.name); })
            .attr("y", function(d) { return y(d.value); })
            .attr("height", function(d) { return height - y(d.value); })
            .style("fill", function(d) { return color(d.name); });

        var legend = svg.selectAll(".legend")
            .data(ageNames.slice().reverse())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d; });

    });
}

function getStackedBarChart(config)
{
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = config.width;
    height = config.height;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .rangeRound([height, 0]);

    var color = d3.scale.ordinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(d3.format(".2s"));

    var svg = d3.select(".container").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv(config.dataSource, function(error, data) {

        //data Converting
        data = convertFormat(data);

        color.domain(d3.keys(data[0]).filter(function(key) { return key !== "year"; }));
        data.forEach(function(d) {
            var y0 = 0;
            d.ages = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
            d.total = d.ages[d.ages.length - 1].y1;
        });

        data.sort(function(a, b) { return b.total - a.total; });

        x.domain(data.map(function(d) { return d.year; }));
        y.domain([0, d3.max(data, function(d) { return d.total; })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Population");

        var state = svg.selectAll(".state")
            .data(data)
            .enter().append("g")
            .attr("class", "g")
            .attr("transform", function(d) { return "translate(" + x(d.year) + ",0)"; });

        state.selectAll("rect")
            .data(function(d) { return d.ages; })
            .enter().append("rect")
            .attr("width", x.rangeBand())
            .attr("y", function(d) { return y(d.y1); })
            .attr("height", function(d) { return y(d.y0) - y(d.y1); })
            .style("fill", function(d) { return color(d.name); });

        var legend = svg.selectAll(".legend")
            .data(color.domain().slice().reverse())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d; });
    });

}

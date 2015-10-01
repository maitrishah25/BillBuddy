//
// var margin = {top: 40, right: 20, bottom: 30, left: 40},
//     width = 960 - margin.left - margin.right,
//     height = 500 - margin.top - margin.bottom;
//
// var formatPercent = d3.format(".0%");
//
// var x = d3.scale.ordinal()
//     .rangeRoundBands([0, width], .1);
//
// var y = d3.scale.linear()
//     .range([height, 0]);
//
// var xAxis = d3.svg.axis()
//     .scale(x)
//     .orient("bottom");
//
// var yAxis = d3.svg.axis()
//     .scale(y)
//     .orient("left")
//     .tickFormat(formatPercent);
//
// var tip = d3.tip()
//   .attr('class', 'd3-tip')
//   .offset([-10, 0])
//   .html(function(d) {
//     return "<strong>amount:</strong> <span style='color:deeppink'>" + d.amount + "</span>";
//   })
//
// var svg = d3.select("body").append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
// svg.call(tip);
//
// d3.json("/graph/data", type, function(error, data) {
//   x.domain(data.map(function(d) { return d.name; }));
//   y.domain([0, d3.max(data, function(d) { return d.amount; })]);
//
//   svg.append("g")
//       .attr("class", "x axis")
//       .attr("transform", "translate(0," + height + ")")
//       .call(xAxis);
//
//   svg.append("g")
//       .attr("class", "y axis")
//       .call(yAxis)
//     .append("text")
//       .attr("transform", "rotate(-90)")
//       .attr("y", 6)
//       .attr("dy", ".71em")
//       .style("text-anchor", "end")
//       .text("amount");
//
//   svg.selectAll(".bar")
//       .data(data)
//     .enter().append("rect")
//       .attr("class", "bar")
//       .attr("x", function(d) { return x(d.name); })
//       .attr("width", x.rangeBand())
//       .attr("y", function(d) { return y(d.amount); })
//       .attr("height", function(d) { return height - y(d.amount); })
//       .on('mouseover', tip.show)
//       .on('mouseout', tip.hide)
//
// });
//
// function type(d) {
//   d.amount = +d.amount;
//   return d;
// }

$.ajax({
           type: "GET",
           contentType: "application/json; charset=utf-8",
           url: '/graph/data',
           dataType: 'json',
           success: function (data) {
               draw(data);
           },
           error: function (result) {
               error();
           }
       });

function draw(data) {
    var color = d3.scale.category20b();
    var width = 420,
        barHeight = 20;

    var x = d3.scale.linear()
        .range([0, width])
        .domain([0, d3.max(data)]);

    var chart = d3.select("#graph")
        .attr("width", width)
        .attr("height", barHeight * data.length);

    var bar = chart.selectAll("g")
        .data(data)
        .enter().append("g")
        .attr("transform", function (d, i) {
                  return "translate(0," + i * barHeight + ")";
              });

    bar.append("rect")
        .attr("width", x)
        .attr("height", barHeight - 1)
        .style("fill", function (d) {
                   return color(d)
               })

    bar.append("text")
        .attr("x", function (d) {
                  return x(d) - 10;
              })
        .attr("y", barHeight / 2)
        .attr("dy", ".35em")
        .style("fill", "white")
        .text(function (d) {
                  return d;
              });
}

function error() {
    console.log("error")
}

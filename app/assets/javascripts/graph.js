console.log('..hi');

// grabs token for user
var apiToken = $('#api-token').val();
$.ajaxSetup({
  headers: {
    'token': apiToken
  }
});

// function to handle bar chart
$.ajax({
  type: 'GET',
  contentType: 'application/json',
  url: '/api/bills',
  dataType: 'json',
  success: function(jsonData){
    draw(jsonData);
  },
  error: function(result){
    error();
  }
});
function draw(jsonData){

  var billsData = jsonData;
  var field = d3.select('#graph');
  // var margin = {top: 40, right: 20, bottom: 30, left: 40},
  //     width = 960 - margin.left - margin.right,
  //     height = 500 - margin.top - margin.bottom;

  field.selectAll('section')
       .data(billsData)
       .enter()
       .append('section');

  field.selectAll('section')
       .data(billsData)
       .text(function(bill){
         return (bill.name);
       });

  field.selectAll('section')
       .data(billsData)
       .transition()
       .duration(3000)
       .style(
         'width', function(bill){
           return(bill.amount *0.1) + 'px';
         });

  field.selectAll('section')
       .data(billsData)
       .exit()
       .remove();

   var tip = d3.tip()
   .attr('class', 'd3-tip')
   .offset([-10, 0])
   .html(function(bill) {
     return "<strong>Amount:</strong> <span style='color:deeppink'>" + bill.amount + "</span>";
   })

  //  var svg = field.append("svg")
  //   .attr("width", width + margin.left + margin.right)
  //   .attr("height", height + margin.top + margin.bottom)
  //   .append("g")
  //   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

   field.call(tip);

   field.selectAll('section')

      .data(billsData)
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)

}
function error(){
  console.log('error');
}

// // function to handle pie
//
// var width = 960,
//     height = 500,
//     radius = Math.min(width, height) / 2;
//
// var color = d3.scale.ordinal()
//     .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
//
// var arc = d3.svg.arc()
//     .outerRadius(radius - 10)
//     .innerRadius(radius - 70);
//
// var pie = d3.layout.pie()
//     .sort(null)
//     .value(function(bill) { return bill.amount; });
//
// var svg = d3.select("#pie").append("svg")
//     .attr("width", width)
//     .attr("height", height)
//   .append("g")
//     .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
//
//     $.ajax({
//       type: 'GET',
//       contentType: 'application/json',
//       url: '/api/bills',
//       dataType: 'json',
//       success: function(jsonData){
//         pie(jsonData);
//       },
//       error: function(result){
//         error();
//       }
//     });
//     function pie(jsonData){
//
//       var billsData = jsonData;
//       var field = d3.select('#pie');
//
//   // data.forEach(function(bill) {
//   //   bill.amount = +bill.amount;
//   // });
//
//   var g = svg.selectAll(".arc")
//       .data(pie(billsData))
//     .enter().append("g")
//       .attr("class", "arc");
//
//   g.append("path")
//       .attr("d", arc)
//       .style("fill", function(d) { return color(d.data.name); });
//
//   g.append("text")
//       .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
//       .attr("dy", ".35em")
//       .style("text-anchor", "middle")
//       .text(function(d) { return d.data.name; });
//
// };

$.ajax({
  type: 'GET',
  contentType: 'application/json',
  url: '/api/bills',
  dataType: 'json',
  success: function(jsonData){
    pie(jsonData);
  },
  error: function(result){
    error();
    }
  });
function pie(jsonData){

  var billsData = jsonData;

  var w = 300,                        //width
      h = 300,                            //height
      r = 120,                            //radius
    color = d3.scale.category20c();     //builtin range of colors
    // color = d3.scale.ordinal()
    //     .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
    var vis = d3.select("#pie")
        .append("svg:svg")              //create the SVG element inside the <body>
        .data([billsData])                   //associate our data with the document
            .attr("width", w)           //set the width and height of our visualization (these will be attributes of the <svg> tag
            .attr("height", h)
        .append("svg:g")                //make a group to hold our pie chart
            .attr("transform", "translate(" + r + "," + r + ")")    //move the center of the pie chart from 0, 0 to radius, radius
    var arc = d3.svg.arc()              //this will create <path> elements for us using arc data
        .outerRadius(r)
        .innerRadius(r-50);
    var pie = d3.layout.pie()           //this will create arc data for us given a list of values
        .value(function(d) { return d.amount; });    //we must tell it out to access the value of each element in our data array
    var arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
        .data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties)
        .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
            .append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
                .attr("class", "slice");    //allow us to style things in the slices (like text)
        arcs.append("svg:path")
                .attr("fill", function(d, i) { return color(i); } ) //set the color for each slice to be chosen from the color function defined above
                .attr("d", arc);                                    //this creates the actual SVG path using the associated data (pie) with the arc drawing function
        arcs.append("svg:text")                                     //add a label to each slice
                .attr("transform", function(d) {                    //set the label's origin to the center of the arc
                //we have to make sure to set these before calling arc.centroid
                d.innerRadius = 0;
                d.outerRadius = r;
                return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
            })
            .attr("text-anchor", "top")                          //center the text on it's origin
            .text(function(d, i) { return billsData[i].name; });        //get the label from our original data array
            // .attr("transform", "translate(" + (r*1.1) + "," + (r*1.1) + ")");    //move the center of the pie chart from 0, 0 to radius, radius

          }

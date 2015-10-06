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
  var margin = {top: 40, right: 20, bottom: 30, left: 40},
      width = 575 - margin.left - margin.right,
      height = 50 - margin.top - margin.bottom;

  field.selectAll('article')
       .data(billsData)
       .enter()
       .append('article')

  field.selectAll('article')
       .data(billsData)
       .each(function(bill){

         d3.select(this)
           .append('span')
           .attr('class', 'info')
           .text(bill.name)

         d3.select(this)
           .append('section');
       });

  field.selectAll('section')
       .data(billsData)
       .transition()
       .duration(3000)
      //  .attr("transform", "translate(" + 80 + "," + 0 + ")")
      //  .style("postion", "absolute")
      //  .style("left", (d3.pageX+160) + "px")
       .style(
         'width', function(bill){
           return(bill.amount *0.1) + 'px';
         });

  field.selectAll('section')
       .data(billsData)
       .exit()
       .remove();

 field.selectAll('section')
      .data(billsData)
      .on('mouseenter', function(d,e){
        field
          .append('div')
          .attr('class', 'tool-tip')
          .data([d])
          .style("postion", "absolute")
          .style("top", (d3.event.pageY-130) + "px")
          .style("left", function(bill){
            return (bill.amount *0.1 + 10) + "px"
          })
          .html(function(d){
            return "<strong>Amount:</strong> <span style='color:deeppink'> $" + d.amount + "</span>";
          });
      })
      .on('mouseleave', function(){
        d3.selectAll('.tool-tip').remove();
      });

}
function error(){
  console.log('error');
}

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

  var w = 230,                        //width
      h = 230,                            //height
      r = Math.min(w, h) / 2,                            //radius
      labelr = r + 5, // radius for label anchor
      color = d3.scale.category20c();     //builtin range of colors
    // color = d3.scale.ordinal()
    //     .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
  var vis = d3.select("#pie")
              .append("svg:svg")              //create the SVG element inside the <body>
              .data([billsData])                   //associate our data with the document
              .attr("width", w+150)           //set the width and height of our visualization (these will be attributes of the <svg> tag
              .attr("height", h+70)
              .append("svg:g")                //make a group to hold our pie chart
              .attr("transform", "translate(" + 190 + "," + 155 + ")");    //move the center of the pie chart from 0, 0 to radius, radius
  var arc = d3.svg.arc()              //this will create <path> elements for us using arc data
              .outerRadius(r)
              .innerRadius(r-30);
  var pie = d3.layout.pie()           //this will create arc data for us given a list of values
              .value(function(d) { return d.amount; });    //we must tell it out to access the value of each element in our data array
  var arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
                .data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties)
                .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
                .append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
                .attr("class", "slice");    //allow us to style things in the slices (like text)

      arcs.append("svg:path")
          .attr("fill", function(d, i) { return color(i); } ) //set the color for each slice to be chosen from the color function defined above
          .attr("d", arc)                                   //this creates the actual SVG path using the associated data (pie) with the arc drawing function
          .transition()
          .duration(3000);

      arcs.append("svg:text")                                     //add a label to each slice
          .attr("transform", function(d) {
              var c = arc.centroid(d),
                  x = c[0],
                  y = c[1],
                  // pythagorean theorem for hypotenuse
                  h = Math.sqrt(x*x + y*y);
              return "translate(" + (x/h * labelr) +  ',' +
                 (y/h * labelr) +  ")";
          })
          .attr("dy", ".35em")
          .attr("text-anchor", function(d) {
              // are we past the center?
              return (d.endAngle + d.startAngle)/2 > Math.PI ?
                  "end" : "start";
          })
          .text(function(d, i) { return billsData[i].name; });

        }

// //Create the SVG Viewport selection
// var svgContainer = d3.select(".container").append("svg")
//                                      .attr("width", 400)
//                                    .attr("height", 100);

// //Create the Scale we will use for the Axis
// var axisScale = d3.scaleLinear()
//                  .domain([0, 100])
//                  .range([0, 400]);

// //Create the Axis
// var xAxis = d3.axisBottom(axisScale);

// var xAxisGroup = svgContainer.append("g")
//                               .call(xAxis);


// var circleRadii = [
//   {"radius":40, "colour": "green"},
//   {"radius":20, "colour": "purple"},
//   {"radius":10, "colour": "red"}
// ];
// var svg = d3.select(".container").append("svg")
//                                 .attr("width", 200)
//                                 .attr("height", 200);
// var circles = svg.selectAll("circle")
//                 .data(circleRadii)
//                 .enter()
//                 .append("circle");
// var circleAttributes = circles
//                         .attr("cx", 50)
//                         .attr("cy", 50)
//                         .attr("r", function (d) { return d.radius; })
//                         .style("fill", function (d) { return d.colour; });

// var circleData = [
//   { 
//     "x_axis": 30,
//     "y_axis": 30,
//     "radius": 10,
//     "color" : "green"
//  }, 
//  {
//   "x_axis": 100,
//   "y_axis": 100,
//   "radius": 10,
//   "color" : "purple"
// }, 
// {
//   "x_axis": 180,
//   "y_axis": 180,
//   "radius": 10,
//   "color" : "red"
// }];

// var svg = d3.select(".container").append("svg")
//                                 .attr("width", 200)
//                                 .attr("height", 200);

const RADIUS = 4;
const BASE_COLOUR = "#000000";
const SECONDARY_COLOUR = "#CCCCCC";

// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50};
var width = 960 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

// set the ranges
// var x = d3.scaleLinear().range([0, width]);
// var y = d3.scaleLinear().range([height, 0]);

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select(".container").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("border", "1px solid");
  // .append("g")
  //   .attr("transform",
  //         "translate(" + margin.left + "," + margin.top + ")");


// var circles = svg.selectAll("circle")
//                 .data(jsonCircles)
//                 .enter()
//                 .append("circle");

// var circleAttributes = circles
//                         .attr("id", function (d, i) { return i; })
//                         .attr("cx", function (d) { return d.x_axis; })
//                         .attr("cy", function (d) { return d.y_axis; })
//                         .attr("r", function (d) { return d.radius; })
//                         .style("fill", function (d) { return d.color; });


function init () {
  var coordinates = generateCoordinates();
   // scale the range of the data
  var dot = createDot(coordinates);
}

function generateCoordinates (currentX, currentY) {

  var distance = 150;
  var left = 0;
  var right = width;
  var top = 0;
  var bottom = height;

  if (currentX) {
    currentX = Math.round(currentX);
    left = Math.max(0, currentX - distance);
    right = Math.min(width, currentX + distance);
  }

  if (currentY) {
    currentY = Math.round(currentY);
    top = Math.max(0, currentY - distance);
    bottom = Math.min(height, currentY + distance);
  }

  console.log("left",left);
  console.log("right",right);
  console.log("top",top);
  console.log("bottom",bottom);

  return {
    x: d3.randomUniform(left, right)(),
    y: d3.randomUniform(top, bottom)()
  };
}

function createDot (data) {
  // add dot to view
  var dot = addDot(data);
  // add active class to latest dot
  dot.classed("active", true);
  // start pulstating animation
  pulsate();
  // add mouseover listener for dot
  dot.on("mouseover", dotSelected);
  return dot;
}

function addDot (data) {
  return svg.append("circle")
            .attr("cx", data.x)
            .attr("cy", data.y)
            .attr("r", RADIUS)
            .style("fill", BASE_COLOUR);
}

function fadeLines () {
  var lines = d3.selectAll("line, circle")
                .transition()
                .style("opacity", function () { 
                  var current = d3.select(this).style("opacity");
                  return current - (current*0.1);
                });
}

function dotSelected (d) {

  var p1 = { x: this.getAttribute("cx"), y: this.getAttribute("cy") };
  var p2 = generateCoordinates(this.getAttribute("cx"), this.getAttribute("cy"));
  
  fadeLines();

  // begin drawing line from current dot to new dot location
  drawLine(p1, p2);

  //Remove the currently mouseover element from the selection.
  //remove active class from dot - stops pulsing animation
  d3.select(this).on('mouseover',null)
                 .classed("active", false)
                 .interrupt()
                 .transition()
                 .attr("r", RADIUS/2)
                 .style("fill", BASE_COLOUR);
}

function lineDrawn () {

  var coordinates = {
    x: this.getAttribute("x2"),
    y: this.getAttribute("y2")
  };

  var dot = createDot( coordinates );
}

function pulsate () {
  var element = svg.select(".active");
  element.transition()
         .duration(1000)
         .attr("r", RADIUS*1.5)
         .style("fill", SECONDARY_COLOUR)
         .transition(1000)
         .attr("r", RADIUS)
         .style("fill", BASE_COLOUR)
         .on("end", pulsate);
}

function drawLine (p1, p2, linkTo) {

  return svg.append("line")
              .attr("x1", p1.x)
              .attr("y1", p1.y)
              .attr("x2", p1.x)
              .attr("y2", p1.y)
              .attr("stroke-width", 1)
              .attr("stroke", BASE_COLOUR)
              .transition()
              .duration(1500)
              .attr("x2", p2.x)
              .attr("y2", p2.y)
              .on("end",lineDrawn);
}

window.onload = init;
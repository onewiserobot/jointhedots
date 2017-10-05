// Creates canvas 320 × 200 at 10, 50
// x , y, width, height
const NUM_DOTS = 10;
const RADIUS = 6;
let coordinates;
let paper = Raphael(document.getElementById("container"), 500, 350);


function dotSelected (event) {

  console.log(this);
  this.unmouseover(dotOver);
  this.unmouseout(dotOut);
  this.unclick(dotSelected);
  this.stop();
  this.animate({transform: "s1"}, 200);

  // create new random coordinates
  var coordinates = generateCoordinates(1, RADIUS);
  // set path starting point as center of selected circle
  var path = paper.path("M"+this.attr('cx') +","+ this.attr('cy'));
  // animate path from 
  path.animate(
    {path:"M"+this.attr('cx') +","+ this.attr('cy') + "L" + coordinates[0].x +","+ coordinates[0].y}, 
    1000, 
    function() {
      plotDots(coordinates, RADIUS);
    }
  );
}

function dotOver (event) {
  //this.pause();
  this.attr("fill","#b7b7b7");
}

function dotOut (event) {
  this.attr("fill","#000");
  //this.resume();
}

function generateRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function isBetween (value, min, max) {
  return value > min && value < max;
}

function pulseStart () {
  this.animate({transform: "s1.5"}, 1000, pulseEnd);
}

function pulseEnd () {
  this.animate({transform: "s1"}, 1000, pulseStart);
}

// function pulsate (object) {
//   let pulse = Raphael.animation({transform: "s2"},
//     1000, );
//   object.animate(pulse);
// }

function createDot (coordinates, radius) {

  let dot = paper.circle(coordinates.x, coordinates.y, radius)
       .attr({fill: "#000", stroke: 'none'})
       .click(dotSelected)
       .mouseover(dotOver)
       .mouseout(dotOut)
       .animate({transform: "s1"}, 1000, pulseStart);
}

function plotDots (coordinates, radius) {
  let i;
  const numPoints = coordinates.length;

  for (i = 0; i < numPoints; i++) {
    createDot(coordinates[i], radius);
  }
}

function isValidPoint (value, set) {
  let i;
  let min;
  let max;
  const spaceAround = 10;
  const setLength = set.length;

  for (i = 0; i < setLength; i += 1) {
    min = set[i] - spaceAround;
    max = set[i] + spaceAround;
    if (isBetween(value, min, max)) {
      return false;
    }
  }

  return true;
}

function generateCoordinates(numberPoints, radius) {
  const minPadding = (radius * 2) + 10;
  let i;
  let point;
  let max;
  let pointSets = {
    x: [],
    y: []
  };
  let coordinates = [];
  let validPoint = false;
  
  for (i = 0; i < numberPoints; i+=1) {

    for (pointSet in pointSets) {
      max = (pointSet == 'x' ? paper.width : paper.height) - minPadding;
      var loops = 1;
      while (!validPoint) {
        point = generateRandomInt(minPadding, max);
        console.log("---------");
        console.log('point',point);

        validPoint = isValidPoint(point, pointSets[pointSet]);
        console.log("isValidPoint",validPoint);
        if (loops > 5) {
          validPoint = true;
        }

        if (validPoint) {
          console.log("add point",point);
          pointSets[pointSet].push(point);
        }
        loops += 1;
        console.log("---------");
      }
      validPoint = false;
    }
    coordinates.push(
      {x: pointSets['x'][pointSets['x'].length - 1], 
       y: pointSets['y'][pointSets['y'].length - 1]
     });
  }

  return coordinates;
}

coordinates = generateCoordinates(1, RADIUS);
//coordinates = [{x: 50, y: 50}];
plotDots(coordinates, RADIUS);

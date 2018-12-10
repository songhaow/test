var w = 960,
    h = 250,
    m = [ 15, 5, 15, 5 ], // top, right, bottom, left (ala css)
    mw = w - m[1] - m[3],
    mh = h - m[0] - m[2],
    data = [ { x: 1, y: 10 }, { x: 3, y: 12 }, { x: 4, y: 14 }, { x: 9, y: 16 } ];
    // data = [ { x: 100, y: 10 }, { x: 300, y: 12 }, { x: 400, y: 14 }, { x: 900, y: 16 } ];

var x = d3.scaleLinear()
      .domain([d3.min(data, function(d) { return d.x; }), d3.max(data, function(d) { return d.x; })])
      .range([0, mw]),
    y = d3.scaleLinear()
      .domain([Math.min(0, d3.min(data, function(d) { return d.y; })), d3.max(data, function(d) { return d.y; })])
      .range([0, mh]);
console.log('xdomain-origin', x.domain()[0]);

var vis = d3.select("#chart")
  .append("svg:svg")
    .attr("width", w)
    .attr("height", h)
    .attr("pointer-events", "all")
  .append("svg:g")
    .attr("transform", "translate(" + m[3] + "," + m[0] + ")");
var svg = d3.select("svg");

draw();

function draw() {
  var lines = vis.selectAll("line.data1")
      .data(data);
  lines.exit().remove();
  lines.enter()
       .append("svg:line")
       .attr("class", "data1");
  lines
      .attr("x1", function(d) { return x(d.x); })
      .attr("x2", function(d) { return x(d.x); })
      .attr("y1", function(d) { return mh - y(0); })
      .attr("y2", function(d) { return mh - y(d.y); });
}

// drag x-axis logic
var takeoverOriginalX;
var mouseDownX = Math.NaN;
var mouseUpX;
var newMaxX;

// attach the mousedown down to the line
vis.append("svg:line")
  .attr("class", "xaxis")
  .attr("x1", 0)
  .attr("x2", mw)
  .attr("y1", mh - y(0))
  .attr("y2", mh - y(0))
  .on("mousedown", function(d) {
    var p = svg.mouse(vis[0][0]);
    mouseDownX = x.invert(p[0]); //present mouse click x value,
    takeoverOriginalX = x; //take over original x domain, [1,9]
  });

// attach the mousemove and mouseup to the body, in case one wonders off the axis line
// get new x.domain and draw instantely when mouse up
d3.select('body')
  .on("mousemove", function(d) {
    if (!isNaN(mouseDownX)) {
      var p = svg.mouse(vis[0][0]),
          mouseUpX = p[0];
      if (mouseUpX != 0) {
        newMaxX = mw * (mouseDownX - takeoverOriginalX.domain()[0])/mouseUpX + takeoverOriginalX.domain()[0];
        x.domain([takeoverOriginalX.domain()[0], newMaxX]);
        console.log('mouse down X: ', mouseDownX);
        console.log('mouse up X: ', mouseUpX);
        console.log('new max X: ', newMaxX);
      }
      draw();
    }
  })
  .on("mouseup", function(d) {
    mouseDownX = Math.NaN;
  });

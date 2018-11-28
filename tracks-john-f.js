/* Main function */
var trackInputInfoList =  [
    {
        color: 'red',
        fname: 'source_audio/01-SW-042017.txt',
    },
    {
        color: 'green',
        fname: 'source_audio/02-SW-062018.txt',
    },
];

var w=1000;
var h=500;

var svg01 = d3.select("svg");
      // .append("svg:svg")
      //   .attr("width", w)
      //   .attr("height", h)
        // .style('border', 1px);
    //   .attr("pointer-events", "all")
    // .append("svg:g")
    //   .attr("transform", "translate(5,5)");

var trackPaddingPx = 45;
var trackHeightPx = 80;

trackInputInfoList.forEach(function(trackInputInfo, i) {
    var fname = trackInputInfo.fname;
    var color = trackInputInfo.color;
    var trackTopY = i * (trackPaddingPx + trackHeightPx) + trackPaddingPx;
    var trackBottomY = trackTopY + trackHeightPx;

    var trackDisplayGroup = svg01.append('g')

    renderAllTrackInfo(trackDisplayGroup, fname, trackTopY, trackBottomY, color);
});

// function dragged(d) {
//   d.x = d3.event.x;
//   d3.select(this).attr("transform", 'translate('+d.x+','+this.getCTM().f+')');
// };

/**
 * @param {int} timeInSeconds
 */
function secondsToTimeString(timeInSeconds) {
    var timeSecond=timeInSeconds%60.0;
    var timeMinute=timeInSeconds/60;
    timeMinute=Math.floor(timeMinute);
    timeSecond=Math.floor(timeSecond);
    var M = timeMinute.toString();
    var S = timeSecond.toString();
    return M + ':' + S;
};

/**
 * @param {svg group} trackDisplayGroup: SVG group that the track info should be created in
 * @param {String}    fname: File system path where json file with track info is stored
 * @param {Number}    trackTopY: Y coordinate on SVG canvas for top of track
 * @param {Number}    trackBottomY: Y coordinate on SVG canvas for bottom of track
 * @param {String}    color: Color to render track in
 */
function renderAllTrackInfo(trackDisplayGroup, fname, trackTopY, trackBottomY, color) {
    d3.json(fname, function(error, data) {
          var bpm01=data.bpm;
          bpm01 = d3.format(".0f")(bpm01);
          var beatListArray=data.beat_list;
          var xMin= d3.min(beatListArray);
          var xMax= d3.max(beatListArray);

          var axisScale = d3.scaleLinear()
                            .domain([xMin,xMax])
                            .range([0,1000]);
          var xScale = 1000/xMax;
          var xStart = xScale*beatListArray[0];
          var xAxis = d3.axisBottom().scale(axisScale);

          trackDisplayGroup.append("g")
              .attr('transform', function(d) {return 'translate('+xStart+',' + trackBottomY + ')';})
              .call(xAxis);

          var tString = secondsToTimeString(xMax);
          trackDisplayGroup.append('text')
              .attr('x', 10).attr('y', trackTopY - 5)
              .style('fill', color)
              .style('font-size', '12px')
              .style('font-weight', 'bold')
              .text(fname + ';  Duration = ' + tString + ';  bpm= '+ bpm01 );

          var trackLinesGroup = trackDisplayGroup.append('g');

          var beatLines = trackLinesGroup.selectAll('line')
                  .data(beatListArray)
                  // .call(d3.drag().on('drag', dragged));

          beatLines.enter().append('line')
              .style('stroke', color)
              .attr('stroke-width', 1)
              // .attr('id', function(d) {return d.id;})
              // .call(d3.drag().on('drag', dragged))
              .attr('x1', function(d) {return d*xScale})
              .attr('x2', function(d) {return d*xScale})
              .attr('y1', trackTopY)
              .attr('y2', trackBottomY);
          beatLines.exit().remove();

          // drag x-axis logic
          // var downx = Math.NaN;
          // var downscalex;

          // attach the mousedown to the line
          // trackDisplayGroup.append("svg:line")
          //     .attr("class", "xaxis")
          //     .attr("x1", xStart)
          //     .attr("x2", 1000)
          //     .attr("y1", trackBottomY)
          //     .attr("y2", trackBottomY)
          //     .on("mousedown", function(d) {
          //           var p = d3.svg.mouse(svg01[0][0]);
          //              downx = axisScale.invert(p[0]);
          //              downscalex = axisScale;});

           // attach the mousemove and mouseup to the body
           // in case one wonders off the axis line
           // d3.select('svg01')
           //   .on("mousemove", function(d) {
           //     if (!isNaN(downx)) {
           //       var p = d3.svg.mouse(vis[0][0]), rupx = p[0];
           //       if (rupx != 0) {
           //         x.domain([downscalex.domain()[0],  mw * (downx - downscalex.domain()[0]) / rupx + downscalex.domain()[0]]);
           //       }
           //       draw();
           //     }
           //   })
           //   .on("mouseup", function(d) {
           //     downx = Math.NaN;
           //   });

  });
}

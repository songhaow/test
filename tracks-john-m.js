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

var width=1000;
var height=280;
var svg = d3.select("#chartForTrack")
  .append("svg")
  .attr("width", width)
  .attr("height", height);
var trackPaddingPx = 60;
var trackHeightPx = 60;

// renderPlayCursor(svg);

trackInputInfoList.forEach(function(trackInputInfo, i) {
    var fname = trackInputInfo.fname;
    var color = trackInputInfo.color;
    var trackTopY = i * (trackPaddingPx + trackHeightPx) + trackPaddingPx;
    var trackBottomY = trackTopY + trackHeightPx;

    var trackDisplayGroup = svg.append('g')
    console.log('i: ', i);
    renderAllTrackInfo(trackDisplayGroup, fname, trackTopY, trackBottomY, color, i);
});

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

// function renderPlayCursor(mainSvgEl) {
//   var playCursorRect = mainSvgEl.append('rect');
//   playCursorRect.attr('id', 'playCursorRect');
//   playCursorRect.attr('height', mainSvgEl.attr('height'));
//   playCursorRect.attr('width', 2);
//   playCursorRect.attr('fill', 'blue');
// };

/**
 * @param {svg group} trackDisplayGroup: SVG group that the track info should be created in
 * @param {String}    fname: File system path where json file with track info is stored
 * @param {Number}    trackTopY: Y coordinate on SVG canvas for top of track
 * @param {Number}    trackBottomY: Y coordinate on SVG canvas for bottom of track
 * @param {String}    color: Color to render track in
 */
function renderAllTrackInfo(trackDisplayGroup, fname, trackTopY, trackBottomY, color, i) {
  d3.json(fname, function(error, data) {
    var bpm01=data.bpm;
        bpm01 = d3.format(".0f")(bpm01);
    var beatListArray=data.beat_list;
    var xMin= d3.min(beatListArray);
    var xMax= d3.max(beatListArray);
    var axisScale = d3.scaleLinear()
                      .domain([xMin,xMax])
                      .range([0,width]);
    var xScale = width/xMax;
    var xStart = xScale*beatListArray[0];
    var xAxis = d3.axisBottom().scale(axisScale);
    var tString = secondsToTimeString(xMax);

    var positionObj = {
      startPos: 1,
      endPos: 1,
      dynamicScaleFactor: 1.0,
    };

    var j=i+1;
    trackDisplayGroup.append('text')
      .attr('x', 10).attr('y', trackTopY - 15)
      .style('fill', color)
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('Song#'+j+':  '+ fname + ';  Duration = ' + tString + ';  bpm: '+ bpm01 );

    var trackLinesGroup = trackDisplayGroup.append('g')
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
      );

// Add background rectangle to group for continuous hit area for
// dragging
   var trackBkgrnd = trackLinesGroup.append('rect')
     .attr('fill', 'lightgray')
     .attr('class', 'dragRect')
     .attr('x', xStart)
     .attr('y', trackTopY)
     .attr('width', width)
     .attr('height', trackBottomY - trackTopY);

    var beatLines = trackLinesGroup.selectAll('line')
      .data(beatListArray);
    beatLines.enter().append('line')
      .style('stroke', color)
      .attr('stroke-width', 1)
      .attr('x1', function(d) {return d*xScale})
      .attr('x2', function(d) {return d*xScale})
      .attr('y1', trackTopY)
      .attr('y2', trackBottomY);
    beatLines.exit().remove();

    trackLinesGroup.append("g")
      .attr('transform', function(d) {return 'translate('+xStart+',' + trackBottomY + ')';})
      .call(xAxis);

////Zoom//////////////////////////////////////////////////////////
    var zoom = d3.zoom()
                 .scaleExtent([1, 1.1])
                 .on("zoom", zoomed);

    var songText = d3.select('body')
                     .append('text')
                     .style('fill', color)
                     .text('Song#'+j);

    var slider = d3.select('body')
                   .append("input")
                   .attr("type", "range")
                   .attr("value", zoom.scaleExtent()[0])
                   .attr("min", zoom.scaleExtent()[0])
                   .attr("max", zoom.scaleExtent()[1])
                   .attr("step", (zoom.scaleExtent()[1] - zoom.scaleExtent()[0])/100)
                   .on("input", slided);

    function slided(d) {
      positionObj.dynamicScaleFactor=d3.select(this).property("value");
      zoom.scaleTo(svg, positionObj.dynamicScaleFactor);
      console.log('scale01: ', positionObj.dynamicScaleFactor);
    }

    function zoomed() {
      const currentTransform = d3.event.transform;
      trackLinesGroup.attr("transform", currentTransform);
      slider.property("value", currentTransform.k);
    }
////Drag functions////////////////////////////////////////////////////////////////////
    function dragstarted() {
      d3.select(this).raise().classed("active", true);
      positionObj.startPos=d3.event.x;
      console.log('startX: ', positionObj.startPos);
    }

    function dragged() {
      d3.select(this).attr("transform", 'translate('+d3.event.x+','+this.getCTM().f+')');
    }

    function dragended() {
      d3.select(this).classed("active", false);
      positionObj.endPos=d3.event.x;
      console.log('endX: ', positionObj.endPos);
    }
  });
}

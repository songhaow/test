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

var svg = d3.select('svg');
var trackPaddingPx = 45;
var trackHeightPx = 60;

trackInputInfoList.forEach(function(trackInputInfo, i) {
    var fname = trackInputInfo.fname;
    var color = trackInputInfo.color;
    var trackTopY = i * (trackPaddingPx + trackHeightPx) + trackPaddingPx;
    var trackBottomY = trackTopY + trackHeightPx;

    var trackDisplayGroup = svg.append('g')

    renderAllTrackInfo(trackDisplayGroup, fname, trackTopY, trackBottomY, color);
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
          bpm01 = d3.format(".0f")(bpm01)
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
                  .data(beatListArray);
          beatLines.enter().append('line')
              .style('stroke', color)
              .attr('stroke-width', 1)
              .attr('x1', function(d) {return d*xScale})
              .attr('x2', function(d) {return d*xScale})
              .attr('y1', trackTopY)
              .attr('y2', trackBottomY);
          beatLines.exit().remove();
    });
}

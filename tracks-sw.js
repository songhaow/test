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
    console.log('color: ' + color);
    console.log('i: ' + i);
    var trackTopY = i * (trackPaddingPx + trackHeightPx) + trackPaddingPx;
    var trackBottomY = trackTopY + trackHeightPx;

    d3.json(fname, function(error, data){
          var bpm01=data.bpm;
          bpm01 = d3.format(".0f")(bpm01)
          var beatListArray=data.beat_list;
          var xMin= d3.min(beatListArray);
          var xMax= d3.max(beatListArray);
          var timeSecond=xMax%60.0;
          var timeMinute=xMax/60;
          timeMinute=Math.floor(timeMinute);
          timeSecond=Math.floor(timeSecond);
          var M = timeMinute.toString();
          var S = timeSecond.toString();
          var axisScale = d3.scaleLinear()
                            .domain([xMin,xMax])
                            .range([0,1000]);
          var xScale = 1000/xMax;
          var xStart = xScale*beatListArray[0];
          var xAxis = d3.axisBottom().scale(axisScale);

          var trackLineGroup = svg.append('g')
          var beatLines = trackLineGroup.selectAll('line')
                  .data(beatListArray);
          beatLines.enter().append('line')
              .style('stroke', color)
              // .scale(axisScale)
              .attr('stroke-width', 1)
              .attr('x1', function(d) {return d*xScale})
              .attr('x2', function(d) {return d*xScale})
              .attr('y1', trackTopY)
              .attr('y2', trackBottomY);
          beatLines.exit().remove();

          svg.append("g")
              .attr('transform', function(d) {return 'translate('+xStart+',' + trackBottomY + ')';})
              .call(xAxis);

          svg.append('text')
              .attr('x', 10).attr('y', 20)
              .style('fill', color)
              .style('font-size', '12px')
              .style('font-weight', 'bold')
              .text(filename01 + ';  Duration = '+M+':'+S+';  bpm= '+ bpm01 );
    });
});

/* Main function */
var width=1000;
var height=250;
barheight=75;
// var svg = d3.select("#chartForTrack")
var svg=d3.select('svg')
          .append("svg:svg")
            .attr("width", width)
            .attr("height", height)
            .style('background-color', 'yellow')
          .append("svg:g")
            .attr("transform", "translate(0,30)");

var filename02="source_audio/02-SW-062018.txt";
d3.json(filename02)
      .get(function(error, data){
          var bpm01=data.bpm;
          bpm01 = d3.format(".0f")(bpm01)
          var xArray=data.beat_list;
          var xMin= d3.min(xArray);
          var xMax= d3.max(xArray);
          var timeMinute=xMax/60.0;
          var timeSecond=xMax%60.0;
          timeMinute=Math.floor(timeMinute);
          timeSecond=Math.floor(timeSecond);
          var M = timeMinute.toString();
          var S = timeSecond.toString();
          var axisScale = d3.scaleLinear()
                            .domain([xMin,xMax])
                            .range([0,1000]);
          var xScale = width/xMax;
          var xStart = xScale*xArray[0];
          var xAxis = d3.axisBottom().scale(axisScale);

////DRAG//////////////////////////////////////////////////////////
       function dragstarted(d) {
             d3.select(this).raise().classed("active", true);
             startX=d3.event.x;
             console.log('startX: ', startX);
             return startX
           }
       function dragged(d) {
             d.x = d3.event.x;
             d3.select(this).attr("transform", 'translate('+d.x+','+this.getCTM().f+')');
           };
       function dragended(d) {
             d3.select(this).classed("active", false);
             endX=d3.event.x;
             console.log('endX: ', endX);
             return endX
           }
////////////////////////////////////////////////////////////////////
          var container = svg.append("g")
                  .attr('transform', function(d) {return 'translate(0,0)';});

          container.append('g')
                 .selectAll('rect')
                 .data(xArray)
                 .enter().append('svg:rect')
                    .attr('fill', 'green')
                    .attr('x', function(d) {return d*xScale})
                    .attr('y', 0)
                    .attr('width', 0.5)
                    .attr('height', 75)
                    .exit();

          container.append("g")
                    .attr('transform', function(d) {return 'translate('+xStart+',75)';})
                    .call(xAxis);

          svg.append('text')
                    .attr('x', 10).attr('y', 20)
                    .style('fill', 'steelblue')
                    .style('font-size', '12px')
                    .style('font-weight', 'bold')
                    .attr('transform', function(d) {return 'translate(0,-150)';})
                    .text(filename02 + 'Duration = '+M+':'+S+';  bpm= '+ bpm01 );

});

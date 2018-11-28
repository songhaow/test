/* Main function */
var filename01="source_audio/01-SW-042017.txt";
d3.json(filename01, function(error, data){
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
      console.log('01-SW-042017.txt');
      console.log("Play time =", M,":",S);
      var axisScale = d3.scaleLinear()
                        .domain([xMin,xMax])
                        .range([0,1000]);
      var xScale = 1000/xMax;
      var xStart = xScale*beatListArray[0];
      var xAxis = d3.axisBottom().scale(axisScale);

      var svg = d3.select('svg');
      var trackLineGroup = svg.append('g')

      var beatLines = trackLineGroup.selectAll('line')
              .data(beatListArray);
      beatLines.enter().append('line')
          .style('stroke', 'blue')
          // .scale(axisScale)
          .attr('stroke-width', 1)
          .attr('x1', function(d) {return d*xScale})
          .attr('x2', function(d) {return d*xScale})
          .attr('y1', 30)
          .attr('y2', 105);
      beatLines.exit().remove();

      svg.append("g")
          .attr('transform', function(d) {return 'translate('+xStart+',105)';})
          .call(xAxis);

      svg.append('text')
          .attr('x', 10).attr('y', 20)
          .style('fill', 'blue')
          .style('font-size', '12px')
          .style('font-weight', 'bold')
          .text(filename01 + ';  Duration = '+M+':'+S+';  bpm= '+ bpm01 );
});

var filename02="source_audio/02-SW-062018.txt";
d3.json(filename02, function(error, data){
          var bpm01=data.bpm;
          bpm01 = d3.format(".0f")(bpm01)
          var beatListArray=data.beat_list;
          var xMin= d3.min(beatListArray);
          var xMax= d3.max(beatListArray);
          var timeMinute=xMax/60.0;
          var timeSecond=xMax%60.0;
          timeMinute=Math.floor(timeMinute);
          timeSecond=Math.floor(timeSecond);
          var M = timeMinute.toString();
          var S = timeSecond.toString();
          console.log('02-SW-062018.txt');
          console.log("Play time =", M,":",S);
          var axisScale = d3.scaleLinear()
                            .domain([xMin,xMax])
                            .range([0,1000]);
          var xScale = 1000/xMax;
          var xStart = xScale*beatListArray[0];
          var xAxis = d3.axisBottom().scale(axisScale);

          var svg = d3.select('svg');

          var trackLineGroup = svg.append('g')


          var beatLines = trackLineGroup.selectAll('line')
                  .data(beatListArray);

          beatLines.enter().append('line')
              .style('stroke', 'green')
              .attr('stroke-width', 1)
              .attr('x1', function(d) {return d*xScale})
              .attr('x2', function(d) {return d*xScale})
              .attr('y1', 150)
              .attr('y2', 215);
          beatLines.exit().remove();

          svg.append("g")
                    .attr('transform', function(d) {return 'translate('+xStart+',215)';})
                    .call(xAxis);

          svg.append('text')
                    .attr('x', 10).attr('y', 20)
                    .style('fill', 'green')
                    .style('font-size', '12px')
                    .style('font-weight', 'bold')
                    .attr('transform', function(d) {return 'translate(0,115)';})
                    .text(filename02 + 'Duration = '+M+':'+S+';  bpm= '+ bpm01 );
});

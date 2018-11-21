/* Main function */
var filename01="source_audio/01-SW-042017.txt";
d3.json(filename01)
    .get(function(error, data){
      var bpm01=data.bpm;
      bpm01 = d3.format(".0f")(bpm01)
      var xArray=data.beat_list;
      var xMin= d3.min(xArray);
      var xMax= d3.max(xArray);
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
      var xStart = xScale*xArray[0];
      var svg = d3.select('svg');
      var xAxis = d3.axisBottom().scale(axisScale);

      svg.selectAll('g')
        .data(xArray)
        .enter().append('g')
          .attr('transform', function(d) {return 'translate(0,30)';})

          .selectAll('line')
              .data(xArray)
              .enter().append('line')
                .style('stroke', 'blue')
                // .scale(axisScale)
                .attr('stroke-width', 1)
                .attr('x1', function(d) {return d*xScale})
                .attr('x2', function(d) {return d*xScale})
                .attr('y1', 0)
                .attr('y2', 75)
                .exit();

        svg.append("g")
                .attr('transform', function(d) {return 'translate('+xStart+',105)';})
                .call(xAxis);

        svg.append('text')
                .attr('x', 10).attr('y', 20)
                .style('fill', 'steelblue')
                .style('font-size', '12px')
                .style('font-weight', 'bold')
                .text(filename01 + ';  Duration = '+M+':'+S+';  bpm= '+ bpm01 );
});

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
          console.log('02-SW-062018.txt');
          console.log("Play time =", M,":",S);
          var axisScale = d3.scaleLinear()
                            .domain([xMin,xMax])
                            .range([0,1000]);
          var xScale = 1000/xMax;
          var xStart = xScale*xArray[0];
          var svg = d3.select('svg');
          var xAxis = d3.axisBottom().scale(axisScale);

          svg.selectAll('g')
            .data(xArray)
            .enter().append('g')
              .attr('transform', function(d) {return 'translate(0,140)';})

              .selectAll('rect')
                .data(xArray)
                .enter().append('rect')
                    .attr('fill', 'green')
                    .attr('x', function(d) {return d*xScale})
                    .attr('y', 0)
                    .attr('width',1)
                    .attr('height', 75)
                    .exit();
                    // update(); remove();

          svg.append("g")
                    .attr('transform', function(d) {return 'translate('+xStart+',215)';})
                    .call(xAxis);

          svg.append('text')
                    .attr('x', 10).attr('y', 20)
                    .style('fill', 'steelblue')
                    .style('font-size', '12px')
                    .style('font-weight', 'bold')
                    .attr('transform', function(d) {return 'translate(0,115)';})
                    .text(filename02 + 'Duration = '+M+':'+S+';  bpm= '+ bpm01 );

});

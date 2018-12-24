/* Main function */
width=1000;
height=130;
barheight=75;

var svg = d3.select("#chartForTrack")
          .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("pointer-events", "all")
          .append("g")
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
                            .range([0,width]);
          var xScale = width/xMax;
          var xStart = xScale*xArray[0];
          var xAxis = d3.axisBottom().scale(axisScale);

    var startX=0;
    var endX=0;
         var group = svg.selectAll('g')
                        .data(xArray)
                        .enter().append("g")
                        .attr('x', 0)
                        .attr('transform', function(d) {return 'translate(0,0)';})
                       .call(d3.drag()
                          .on("start", dragstarted)
                          .on("drag", dragged)
                          .on("end", dragended));

          // group.append('g')
          //        .selectAll('rect')
                 // .data(xArray)
                 // .enter()
               group.append('rect')
                    .attr('fill', 'green')
                    .attr('x', function(d) {return d*xScale})
                    .attr('y', 0)
                    .attr('width', 0.5)
                    .attr('height', barheight)
                    .exit();

          group.append("g")
                    .attr('transform', function(d) {return 'translate('+xStart+','+barheight+')';})
                    .call(xAxis);

         svg.append('text')
                    .attr('x', 10).attr('y', 20)
                    .style('fill', 'steelblue')
                    .style('font-size', '12px')
                    .attr('transform', function(d) {return 'translate(0,-35)';})
                    .text(filename02 + 'Duration = '+M+':'+S+';  bpm= '+ bpm01 );

//GRAG////////////////////////////////////////////////////////////////////////////////////////////
         var startX;
         var endX;
         function dragstarted(d) {
                      d3.select(this).raise().classed("active", true);
                      startX=d3.event.x;
                      console.log('startX: ', startX);
                      return startX}
         function dragged(d) {
                      // d.x=d3.event.x;
                      // console.log('d3.event.x: ',d3.event.x);
                      // console.log('d.x: ', d.x)
                      d3.select(this).attr("transform", 'translate('+d3.event.x+','+this.getCTM().f+')');}
                      // d3.select(this).attr("transform", 'translate('+d.x+',0)');}
                      // console.log(this.getCTM().f);
                      // d3.select(this).select("rect")
                      // .attr("x", d.x);}
         function dragended(d) {
                      d3.select(this).classed("active", false);
                      endX=d3.event.x;
                      console.log('endX: ', endX);
                      return endX}
//ZOOM/////////////////////////////////////////////////////////////////
          var scalewidth;
          var zoom = d3.zoom()
                       .scaleExtent([1, 1.15])
                       .on("zoom", zoomed);
          var slider = d3.select('body')
                         .append("p")
                         .append("input")
                         .datum({})
                         .attr("type", "range")
                         .attr("value", zoom.scaleExtent()[0])
                         .attr("min", zoom.scaleExtent()[0])
                         .attr("max", zoom.scaleExtent()[1])
                         .attr("step", (zoom.scaleExtent()[1] - zoom.scaleExtent()[0])/100)
                         .on("input", slided);
          function slided(d) {
                          zoom.scaleTo(svg, d3.select(this).property("value"));
                          scalewidth=d3.select(this).property("value");
                          console.log('scalwidth: ', scalewidth);
                          return scalewidth;}
          function zoomed() {
                          const currentTransform = d3.event.transform;
                          group.attr("transform", currentTransform);
                          slider.property("value", currentTransform.k);}
//////////////////////////////////////////////////////////////////////////////////////

});

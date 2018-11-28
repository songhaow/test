/* Main function */
var w=1000;
var h=300;
// var svg = d3.select("#chartForTrack")
var svg=d3.select('svg')
          .append("svg:svg")
            .attr("width", w)
            .attr("height", h)
            .attr("pointer-events", "all")
          .append("svg:g")
            .attr("transform", "translate(5,150)");

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
          var xScale = 1000/xMax;
          var xStart = xScale*xArray[0];
          var xAxis = d3.axisBottom().scale(axisScale);

/////////////////////////////////////////////////////////////////////

          var zoom = d3.zoom()
                      .scaleExtent([1, 1.2])
                      .on("zoom", zoomed);

          var slider = d3.select('body')
                         // .append("p")
                         .append("input")
                         .datum(0,300)
                         .attr("type", "range")
                         .attr("value", zoom.scaleExtent()[0])
                         .attr("min", zoom.scaleExtent()[0])
                         .attr("max", zoom.scaleExtent()[1])
                         .attr("step", (zoom.scaleExtent()[1] - zoom.scaleExtent()[0]) / 100)
                         .on("input", slided);

          var scalewidth;
          function slided(d) {
                                zoom.scaleTo(svg, d3.select(this).property("value"));
                                // scalewidth=d3.select(this).property("value");
                                return scalewidth;
                                }

          function zoomed() {
                               const currentTransform = d3.event.transform;
                               container.attr("transform", currentTransform);
                               slider.property("value", currentTransform.k);
                              }

          // d3.select("svg").append("svg")
          //                .attr("width", w)
          //                .attr("height", h)
          //             .append("g")
          //                .attr("transform", "translate(0, 240)")
          //                .call(zoom);

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

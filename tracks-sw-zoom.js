/* Main function */
var width=1000;
var height=300;
var barheight=75
var svg = d3.select("#chartForTrack")
  .append("svg")
  .attr("width", width)
  .attr("height", height);
var data1=[30];

var filename02="source_audio/02-SW-062018.txt";
d3.json(filename02).get(function(error, data){
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
/////////////////////////////////////////////////////////////////////
  var mainSvgElement = d3.select('svg');
  var allGroupsInSvg = mainSvgElement.append('g');
      allGroupsInSvg.attr('name', 'track')
                    .attr('transform', 'translate(0,'+data1+')');
      allGroupsInSvg.call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended));

      allGroupsInSvg.append("g")
                    .attr('transform', function(d) {return 'translate('+xStart+','+barheight+')';})
                    .call(xAxis);

  var allPotentialRects = allGroupsInSvg.selectAll('rect');
  var rectDataBindings = allPotentialRects.data(xArray);
  var rectElements = rectDataBindings.enter().append('rect');
  rectElements.attr('fill', 'green')
              .attr('width', 1)
              .attr('height', barheight)
              .attr('y',0)
              .attr('x', function(d, i) {return d*xScale;});

  svg.append('text')
     .attr('x', 10).attr('y', 0)
     .style('fill', 'steelblue')
     .style('font-size', '12px')
     .style('font-weight', 'bold')
     .attr('transform', function(d) {return 'translate(0,20)';})
     .text(filename02 + 'Duration = '+M+':'+S+';  bpm= '+ bpm01 );

////Zoom//////////////////////////////////////////////////////////
  var zoom = d3.zoom()
    .scaleExtent([1, 2])
    .on("zoom", zoomed);

  var slider = d3.select('body')
    .append("input")
    .attr("type", "range")
    .attr("value", zoom.scaleExtent()[0])
    .attr("min", zoom.scaleExtent()[0])
    .attr("max", zoom.scaleExtent()[1])
    .attr("step", (zoom.scaleExtent()[1] - zoom.scaleExtent()[0])/100)
    .on("input", slided);

  function slided(d) {
    var scalewidth=d3.select(this).property("value");
    zoom.scaleTo(svg, scalewidth);
    console.log('scale: ', scalewidth);
  }

  function zoomed() {
    const currentTransform = d3.event.transform;
    allGroupsInSvg.attr("transform", currentTransform);
    slider.property("value", currentTransform.k);
  }

////Drag////////////////////////////////////////////////////////////////////
  var positionObj = {
    startX: 1,
    endX: 1,
    dynamicScaleFactor: 1.0,
  };

  function dragstarted(d) {
    d3.select(this).raise().classed("active", true);
    startX=d3.event.x;
    console.log('startX: ', startX);
    return startX
  }

  function dragged(d) {
    nowX= d3.event.x;
    d3.select(this).attr("transform", 'translate('+nowX+','+this.getCTM().f+')');
    console.log('nowX: ', nowX);
  }

  function dragended(d) {
    d3.select(this).classed("active", false);
    endX=d3.event.x;
    console.log('endX: ', endX);
    return endX
  }

});

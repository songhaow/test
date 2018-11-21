filename =["source_audio/01-SW-042017.txt",
               "source_audio/02-SW-062018.txt"];
var i;

function dragged(d) {
  d.x = d3.event.x;
  d3.select(this).attr("transform", 'translate('+d.x+','+this.getCTM().f+')');
};

ii=0;

for(ii=0; ii<filename.length; ii++){
      console.log(filename.length);
    d3.json(filename[ii],function(data){
      var xArray=data.beat_list;
      var bpmi=data.bpm;
      bpmi=d3.format(".0f")(bpmi);
      var xMin= d3.min(xArray);
      var xMax= d3.max(xArray);
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
      var xStart = xScale*xArray[0];
      var yStart = 30+(ii-1)*90;
      var height = 85;
      var yAxis =yStart+height*ii;
      var xAxis = d3.axisBottom().scale(axisScale);
      var svg = d3.select('svg');

      svg.selectAll('g')
        .data(xArray)
        .enter().append('g')
          .attr('transform', 'translate('+xStart+','+yStart+')')
          // .call(d3.drag().on('drag', dragged))
          .selectAll('line')
              .data(xArray)
              .enter().append('rect')
                .attr('fill', 'green')
                .attr('width', 1)
                .attr('height', height)
                .attr('x', function(d) {return d*20})
                .exit();

      svg.append('g')
                .attr('transform','translate('+xStart+','+yAxis+')')
                .call(xAxis);

      svg.append('text')
                .attr('x', 10).attr('y', 20+yStart)
                .style('fill', 'steelblue')
                .style('font-size', '12px')
                .style('font-weight', 'bold')
                .text(data.beat_file + ';  Duration = '+M+':'+S+';  bpm= '+ bpmi );
   })
 };

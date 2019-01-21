import {TimeUtil} from '/static/js/view/utils/time_util.js';

var POSITION_INFO = {
  track2PosX: 0,
  cursorPosX: 0,
};


export const TrackCanvasInterface = {
  initialRender() {
    // This is the original code to render the UI interface
    var trackInputInfoList =  [
      {
        color: 'red',
        fname: '/static/source_audio/01-SW-042017.txt',
      },
      {
        color: 'green',
        fname: '/static/source_audio/02-SW-062018.txt',
      },
    ];
    var svg = d3.select('svg');

    rerenderTracks(svg, trackInputInfoList);

    renderPlayCursor(svg);

    bindEventHandlers(svg, trackInputInfoList);
  },

  getCursorPosPx() {
    return POSITION_INFO.cursorPosX;
  },

  getTrack2PosPx() {
    return POSITION_INFO.track2PosX;
  },

  getTrackLengthPx() {
    return 1000;
  },

  getTrackLengthSec() {
    return 180;
  },

  getTrack2OffsetMS() {
    d3.json('/static/source_audio/02-SW-062018.txt', function(error, data) {
      var beatListArray = data.beat_list;

      var xMax = d3.max(beatListArray);
      var xScale = 1000/xMax;
      xMax = d3.max(beatListArray) * xScale;
      console.log('xmax: ' + xMax);

      return POSITION_INFO.track2PosX / xMax;
    });
  }
};

/**
 * Central function for defining event handling on SVG element.  We centralize
 * SVG event handling here so it will be easy to see and manage possible
 * different events we want to have.
 */
function bindEventHandlers(mainSvgEl, trackInputInfoList) {
  // Play Cursor is a <rect> element with id "playCursorRect". Using HTML id
  // attr because there should only be one cursor.
  var playCursorRect = mainSvgEl.select('#playCursorRect');
  mainSvgEl.on('mousedown', function() {
    playCursorRect.attr('destX', d3.event.offsetX);
  });
  mainSvgEl.on('mouseup', function() {
    var x = playCursorRect.attr('destX');
    playCursorRect.attr('x', x);
    POSITION_INFO.cursorPosX = x;
  });

  // Zoom event handler bindings
  d3.select('#zoomSlider')
    .on('change', function(evt) {
      console.log(d3.event.target.value);
      rerenderTracks(mainSvgEl, trackInputInfoList);
    });
}

function rerenderTracks(svg, trackInputInfoList) {
  svg.selectAll('g').remove();

  var trackPaddingPx = 45;
  var trackHeightPx = 60;
  trackInputInfoList.forEach(function(trackInputInfo, i) {
    var fname = trackInputInfo.fname;
    var color = trackInputInfo.color;
    var trackTopY = i * (trackPaddingPx + trackHeightPx) + trackPaddingPx;
    var trackBottomY = trackTopY + trackHeightPx;

    var trackDisplayGroup = svg.append('g');
    trackDisplayGroup.attr('class', 'trackDisplayGroup');

    renderAllTrackInfo(trackDisplayGroup, fname, trackTopY, trackBottomY, color);
  });
}

/**
 * Render the blinking play cursor initially at position 0
 * @param mainSvgEl: main SVG element to draw on
 */
function renderPlayCursor(mainSvgEl) {
  var playCursorRect = mainSvgEl.append('rect');
  playCursorRect.attr('id', 'playCursorRect');
  playCursorRect.attr('height', mainSvgEl.attr('height'));
  playCursorRect.attr('width', 2);
  playCursorRect.attr('fill', 'blue');
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
    var bpm01 = data.bpm;
    bpm01 = d3.format(".0f")(bpm01)
    var beatListArray = data.beat_list;
    var xMin = d3.min(beatListArray);
    var xMax = d3.max(beatListArray);

    var axisScale = d3.scaleLinear()
                       .domain([xMin,xMax])
                       .range([0,1000]);
    var xScale = 1000/xMax;
    var xAxis = d3.axisBottom().scale(axisScale);

    trackDisplayGroup.append("g")
        .attr('transform', function(d) {return 'translate(0,' + trackBottomY + ')';})
        .call(xAxis);

    var tString = TimeUtil.secondsToTimeString(xMax);
    trackDisplayGroup.append('text')
        .attr('y', trackTopY - 5)
        .style('fill', color)
        .style('font-size', '12px')
        .style('font-weight', 'bold')
        .text(fname + ';  Duration = ' + tString + ';  bpm= '+ bpm01 );

    var trackLinesGroup = trackDisplayGroup.append('g');
    renderDraggableTrack(
      trackLinesGroup, beatListArray, color, trackTopY, trackBottomY, xScale);
  });
}


/**
 * @param xScale: how much to "zoom in" x axis
 */
function renderDraggableTrack(
        trackLinesGroup, beatListArray, color, trackTopY, trackBottomY,
        xScale) {
  // X position of the last beat for the track
  var xMax = d3.max(beatListArray) * xScale;

  // Add lines
  trackLinesGroup.attr('class', 'trackLinesGroup');
  trackLinesGroup.call(
    d3.drag()
      .on('drag', dragged)
      .on('end', dragEnded)
      .subject(setDragSubject)
  );

  // Add background rectangle to group for continuous hit area for
  // dragging
  var trackBkgrnd = trackLinesGroup.append('rect');
  trackBkgrnd.attr('fill', 'lightgrey');
  trackBkgrnd.attr('class', 'dragRect');
  trackBkgrnd.attr('y', trackTopY);
  trackBkgrnd.attr('width', xMax);
  trackBkgrnd.attr('height', trackBottomY - trackTopY);

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
}

/**
 * Set the subject's x and y coordinates that we're dragging.
 * This should be the Track Lines Group <g> element which includes the track
 * beat lines and the background hit area <rect>
 */
function setDragSubject() {
  var baseX = this.getCTM().e;
  var baseY = this.getCTM().f;

  return {
    x: d3.event.x,
    y: d3.event.y,
    baseX: baseX,
    baseY: baseY,
  };
}

/**
 * @param d: undefined
 */
function dragged() {
  var newX = d3.event.subject.baseX + (d3.event.x - d3.event.subject.x);

  d3.select(this).attr(
    "transform",
    'translate('
    + newX
    + ','
    + d3.event.subject.baseY
    +')'
  );
}


function dragEnded() {
  POSITION_INFO.track2PosX =
    d3.event.subject.baseX + (d3.event.x - d3.event.subject.x);
}

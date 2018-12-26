// Import commands allow us to import functions and modules from other
// javascript files -- like we do in python
import {AudioSourceInterface} from '/static/js/api/audio_source.js';
import {TrackAudioManager} from '/static/js/audio_logic/audio_context_logic.js';

/**
 * Here we create an instance of the class TrackAudioManager.  The track
 * audio manager will keep the tracks that we want to play and expose
 * the functions to play, stop, and seek the track position.
 */
var trackAudioManager = new TrackAudioManager();

// When the user presses the play / stop button, we tell the
// trackAudioManager instance what to do.
document.querySelector('#play1Button').onclick = function() {
  trackAudioManager.playTrack1();
};
document.querySelector('#pause1Button').onclick = function() {
  trackAudioManager.stopTrack1();
};

/**
 * Here, we make a call to the python flask server to get the track
 * audio information.  Once the audio information comes back and is
 * decoded, we load it into track1.  We pass it the trackAudioManager
 * because that's the track manager object we want to load the audio
 * information into.
 */
AudioSourceInterface.loadBackendTrack(trackAudioManager);


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

        renderTrackBeats(
          trackDisplayGroup, beatListArray, color, trackTopY, trackBottomY,
          xMax, xScale);
    });
}


function renderTrackBeats(
        trackDisplayGroup, beatListArray, color, trackTopY, trackBottomY, xMax,
        xScale) {
    // Add lines
    var trackLinesGroup = trackDisplayGroup.append('g');
    trackLinesGroup.call(
      d3.drag()
        .on('drag', dragged)
    );

    // Add background rectangle to group for continuous hit area for
    // dragging
    var trackBkgrnd = trackLinesGroup.append('rect');
    trackBkgrnd.attr('fill', 'lightgrey');
    trackBkgrnd.attr('x', 10);
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
 * @param d: undefined
 */
function dragged(d) {
  d3.select(this).attr("transform", 'translate('+d3.event.x+','+this.getCTM().f+')');
}

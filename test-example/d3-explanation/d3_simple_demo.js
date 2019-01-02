
/////ZOOM/////////////////////////////////////////////////////////////////////////////
var zoom = d3.zoom().scaleExtent([1, 1.1]).on("zoom", zoomed);

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

//////////////////////////////////////////////////////////////////////////////

/**
 * mainLoad function is the main function that does all the high level logic we
 * need to render the d3 elements
 */
function mainLoad() {
  // Here, we get the track info.  We can either make a HTTP request to a
  // backend python server, which will give us the right json info, or we can
  // generate it randomly (for prototyping and testing) as we are doing here.
  // Putting that logic inside of a function "hides" or more formally,
  // "encapsulates" the way we get the track info.  When the javascript UI is
  // working, we can easily change only this function to read from python
  // backend and everything else will still work fine.
  // trackInfoList is a list of two json objects.
  var trackInfoList = getTrackInfo();
  // display the track info in console for testing
  console.log(trackInfoList);

  /**
   * From this part forward, we start appending elements to the HTML DOM
   * element tree.
   * READ ABOUT DOM: https://www.w3schools.com/js/js_htmldom.asp)
   * The main part of our DOM at the beginnin (this step in the mainLoad
   * program) is as written in d3_simple_demo.html:
   *   <body>
   *     <svg ...>
   *     </svg>
   *   <body>
   *
   * The <svg/> element is our drawing canvas.  SVG is a subset of HTML
   * elements used specifically for drawing.
   * READ ABOUT SVG: https://developer.mozilla.org/en-US/docs/Web/SVG
   * HTML has standard elements like <body/> <div/> <head/>.  SVG also has
   * standard elements like <svg/> <g/>.
   * What we want to have is two tracks in the <svg></svg> element.  We will
   * represent each track as a group of lines.
   * We will use an SVG Group element to represent the groups <g/>:
   *   https://developer.mozilla.org/en-US/docs/Web/SVG/Element/g
   * We will use an SVG Rectangle element to represent the lines (as a thin
   * rectangle):
   *   https://developer.mozilla.org/en-US/docs/Web/SVG/Element/rect
   */



  /**
   * The below functions each render the SVG elements the same way.  One is the
   * original D3 examples you are used to looking at.  They are more confusing
   * because all functions are chained together.  "chained together" means that
   * the output of the functions are objects that you can call more functions
   * on.  You can read more about chaining here:
   *   https://www.i-programmer.info/programming/javascript/4676-chaining-fluent-interfaces-in-javascript.html
   */
  // renderMethodAllChained is the original, more confusing way to do the D3
  // track render.
  //
  // renderMethodAllChained(trackInfoList);

  // In renderMethodStepByStep, I have broken out the original chained method
  // calls into objects that map to what we are getting at each step.
  // Hopefully, this will be a clear illustration of the way D3 works for you.
  //
  renderMethodStepByStep(trackInfoList);
};


/**
 * This is the original, more confusing way of chaining all D3 calls together.
 * I will break this down into more clear steps in the next method.
 */
function renderMethodAllChained(trackInfoList) {
  var group = d3.select('svg').selectAll('g').data(trackInfoList).enter().append('g')
      .attr('name', 'track')
      .attr('transform', function(d) {return 'translate(10,' + d.y + ')';})
    .call(
      d3.drag()
        .on("start", dragstarted)
        .on('drag', dragged)
        .on("end", dragended));

  group.selectAll('rect')
      .data(function(d) {return d.trackData;})
      .enter().append('rect')
        .attr('fill', 'black')
        .attr('width', 2)
        .attr('height', 90)
        .attr('x', function(d, i) {return d*8;});
}


/**
 * In renderMethodStepByStep, I have broken out the original chained function
 * calls step by step.  Read the comments and code below to get a better idea
 * of what is rendered at each step.
 *
 * A lot of this information pertains to functions in the D3 javascript library,
 * so you can double check your book and also look at the information here:
 * http://knowledgestockpile.blogspot.com/2012/01/understanding-selectall-data-enter.html
 *
 * Another thing to note in this function is the variable names.  It is
 * important to be specific about variable names so that it will be easier
 * later on in a big function or a big program to know what something is
 * without having to read "up" in the function to see where it came from.
 */
function renderMethodStepByStep(trackInfoList) {
  // mainSvgElement is the main svg element in the HTML DOM.  It is the <svg/>
  // in <body> <svg ...> </svg> </body> in the d3_simple_demo.html file
  var mainSvgElement = d3.select('svg');


  /**
   * The rest of the logic below will basically be used to say:
   * 1. For each of our two sets of song data, create a group element (<g>)
   *    under the main <svg> element.
   * 2. Under each of the two group elements we create, create a list of
   *    skinny rectangle elements that represent a line in for the track.
   * 3. Bind any mouse actions like dragging to the different SVG elements.
   */

  // allPotentialGroupsInSvg represents all groups under the <svg> element (
  // which is the mainSvgElement).  The way we get all the groups under the svg
  // HTML element is by using the selectAll() function.  This function looks
  // under the svg element and finds any <g> elements.  NOTE that at this point,
  // there are NO <g> elements in the <svg> element.  This is fine and this is
  // also why I have named the variable "all POTENTIAL groups in svg".
  var allPotentialGroupsInSvg = mainSvgElement.selectAll('g');

  // D3's "data" function is what "binds" a set of data to a set of SVG (or
  // HTML) elements.  Here, we are binding each element in trackInfoList to the
  // a group element under the main svg element.  We are saying "each element
  // in the trackInfoList will be represented by a <g> element".
  // REMINDER: each element in trackInfoList is a JSON object that looks like:
  //   {
  //     id: 'track1',
  //     ...
  //     trackData: [5, 15, 2, 34, ...]
  //   }
  // The D3 data() function returns an object which represents a binding.
  var groupDataBinding = allPotentialGroupsInSvg.data(trackInfoList);;

  // We now have the list of trackInfoList items mapped 1<>1 to the set of <g>
  // elements.  The two D3 functions here (enter and append) are used to say:
  //   Each time a new element "enters" or becomes a member of the list of
  //   items, create (or "append") a new <g> if it does not exist already.
  // So at the beginning, there are two track info elements in trackInfoList
  // and no <g> elements, so we treat those two track elements as "new".
  // Therefore, we append a new group element for each.  The append() function
  // also returns a list of D3 <g> elements that have their own associated
  // functions (used below)
  var allGroupsInSvg = groupDataBinding.enter().append('g');

  // SVG <g> elements have attr() methods that allow us to set attributes and
  // transform behavior so we do that here for the groups that we've created
  allGroupsInSvg.attr('name', 'track')
      .attr('transform', function(d) {return 'translate(10,' + d.y + ')';});

  // SVG <g> elements also have a call() function that allows us to bind D3
  // animation methods to themselves.
  // Here, we are binding the drag action to the group of track beats.
  // Therefore, when we click on a bar and drag, it will affect the whole group.
  allGroupsInSvg.call(
      d3.drag()
        .on("start", dragstarted)
        .on('drag', dragged)
        .on("end", dragended));


  /**
   * The logic below renders a set of beat lines for each track group.  For
   * each <g> element we created above, we add a set of <rect> elements (one
   * rect) element for each beat line.  It is structurally similar to what we
   * did above when adding a set of <g> elements under the <svg> element.
   */

  // allPotentialRects represents all <rect> elements under the <g> element.
  // NOTE: We are dealing with 2 <g> elements, but these functions act on the
  // list as if we are only dealing with 1 <g> element.  D3 hides the logic
  // that applies operations on multiple elements in a list.
  var allPotentialRects = allGroupsInSvg.selectAll('rect');

  // We use the D3 data() method again to bind a list of data to all potential
  // <rect> elements within the <g> element.  I can explain the function inside
  // of the data() function and the "d" argument inside when we talk together.
  var rectDataBindings = allPotentialRects.data(function(d) {return d.trackData;});

  // Here again, we use the D3 enter() and append() function to say: for every
  // beat line that is "new", add a <rect> element.
  var rectElements = rectDataBindings.enter().append('rect');

  // Here we take all the <rect> elements and we add attributes to them.
  rectElements.attr('fill', 'black')
        .attr('width', 2)
        .attr('height', function(d) {return d;})
        .attr('x', function(d, i) {return i*8;});
}


function getTrackInfo() {
  return [
    {
      id: 'track1',
      y: 10,
      width: 100,
      trackData: d3.range(150).map(function () { return Math.round(Math.random()*50);}),
    },
    {
      id: 'track2',
      y: 110,
      width: 100,
      trackData: d3.range(150).map(function () { return Math.round(Math.random()*50);}),
    },
  ]
};

/**
 * All helper functions should be grouped together
 * Functions should be indented and formated like below. Indentation is 2
 *   spaces (or 4 -- whatever it is, it needs to be consistent)
 */
function dragstarted(d) {
  d3.select(this).raise().classed("active", true);
  startX=d3.event.x;
  console.log('startX: ', startX);
  return startX
}

function dragged(d) {
  d.x = d3.event.x;
  d3.select(this).attr("transform", 'translate('+d.x+','+this.getCTM().f+')');
}

function dragended(d) {
  d3.select(this).classed("active", false);
  endX=d3.event.x;
  console.log('endX: ', endX);
  return endX
}

function slided(d) {
  zoom.scaleTo(svg, d3.select(this).property("value"));
  var scalewidth = d3.select(this).property("value");
  return scalewidth;
}

function zoomed() {
  const currentTransform = d3.event.transform;
  group.attr("transform", currentTransform);
  slider.property("value", currentTransform.k);
}

/**
 * This function call executes the main function that we have in this
 * javascript file.  It starts the execution chain for rendering everything.
 */
mainLoad();

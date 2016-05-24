var margin = {top: 20, right: 50, bottom: 30, left: 50};
var width = 500 - margin.left - margin.right;
var height = 200 - margin.top - margin.bottom;

var x = d3.scale.linear()
  .range([0, width-80]);

yDomain = [-3,3];
var y = d3.scale.linear()
  .domain(yDomain)
  .range([height, 0]);

var color = d3.scale.ordinal()

var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom');

var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left');

var lineGenerator = d3.svg.line()
    .interpolate('basis')
    .x(function(d) { return x(d.time); })
    .y(function(d) { return y(d.val); });

var svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

function updateChart (data) {
  x.domain(d3.extent(data[0], function(d) { return d.time; }));

  var playheadData = [{'time':0, 'val':yDomain[0]}, {'time':0, 'val':yDomain[1]}];
  var playhead = svg.append('path')
    .attr('id', 'playhead')
    .attr('d', lineGenerator(playheadData))

  var playheadGhost = svg.append('path')
    .attr('id', 'playheadGhost')
    .attr('d', lineGenerator(playheadData))


  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);

  svg.append('g')
    .attr('class', 'y axis')
    .call(yAxis);

  // rectangle for capturing if mouse moves within area
  svg.append('rect')
    .attr('width', width)
    .attr('height', height)
    .style('fill', 'none')
    .style('pointer-events', 'all')
    .on('mousemove', mousemove)
    // .on('mouseout', function() { focus.style('display', 'none'); })
    // .on('mousemove', mousemove)
    .on('click', mouseclick);

  for (var i=0; i<data.length; i++) {
    svg.append('path')
    .attr('d', lineGenerator(data[i]))
    .attr('class', 'line')    
  }


  function mousemove() {
    var xpos = d3.mouse(this)[0];
    d3.select('#playheadGhost').attr('transform', function() {
      return 'translate('+xpos+',0)';
    });
  }

  function mouseclick() {
    var xpos = d3.mouse(this)[0];
    var t = x.invert(xpos);
    var dat = [{'time':t,'val':yDomain[0]},{'time':t,'val':yDomain[1]}];
    video.currentTime(t);
    d3.select('#playhead').attr('transform', function() {
      return 'translate('+xpos+',0)';
    })
  }

};
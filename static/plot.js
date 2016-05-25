Chart = function() {
  var margin = {top: 20, right: 50, bottom: 30, left: 50};
  var width = 500 - margin.left - margin.right;
  var height = 200 - margin.top - margin.bottom;

  var x = d3.scale.linear()
    .range([0, width-80]);

  var y = d3.scale.linear()
    .domain([-3, 3])
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


  var playheadData = [{'time':0, 'val':y.domain()[0]}, {'time':0, 'val':y.domain()[1]}];
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
    .on('mousemove', function() {
        var xpos = d3.mouse(this)[0];
        d3.select('#playheadGhost').attr('transform', function() {
          return 'translate('+xpos+',0)';
        });
      })
    .on('mouseover', function() { d3.select('#playheadGhost').style('opacity', 0.5); })
    .on('mouseout', function() { d3.select('#playheadGhost').style('opacity', 0); })
    // .on('mousemove', mousemove)
    .on('click', function () {
        var xpos = d3.mouse(this)[0];
        var t = x.invert(xpos);
        var dat = [{'time':t,'val':y.domain()[0]},{'time':t,'val':y.domain()[1]}];
        video.currentTime(t);
        d3.select('#playhead').attr('transform', function() {
          return 'translate('+xpos+',0)';
        })
      });

  this.nplots = 0;
  this.height = height;
  this.width = width;
  this.x = x;
  this.y = y;
  this.xAxis = xAxis;
  this.yAxis = yAxis;
  this.svg = svg;
  this.lineGenerator = lineGenerator;

  this.interactions = [];
};

Chart.prototype.updateChart = function(data) {
  var self = this;
  var iplot = this.nplots;
  dat = JSON.parse(data.data)
  this.x.domain(d3.extent(dat, function(d) { return d.time; }));

  this.svg.append('path')
    .attr('id', 'trace_'+this.nplots)
    .attr('d', this.lineGenerator(dat))
    .attr('class', 'line')
    .attr('transform', 'translate(0,'+this.y(iplot)+')')
  
  $('#visible_'+iplot).change(function() {
    var newOpacity = this.checked ? 1 : 0;
    d3.select('#trace_'+iplot).style('opacity', newOpacity)
  });

  this.nplots += 1;
};


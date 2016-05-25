var video = Popcorn('#video');
var loadCount = 0;
var events = "play pause timeupdate seeking".split(/\s+/g);

// when each is ready... 

video.on("canplayall", function() {

  // trigger a custom "sync" event
  this.emit("sync");

  // Listen for the custom sync event...    
}).on("sync", function() {

  // Iterate all events and trigger them on the video B
  // whenever they occur on the video A
  this.on("play", function() {
  });

  this.on("pause", function() {

  });

  this.on("timeupdate", function() {
    d3.select('#playhead').attr('transform', function() {
      return 'translate('+chart.x(video.currentTime())+',0)';
    })
  });

  this.on("seeking", function() {

  });
});
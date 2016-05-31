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

    tagger.update(video.currentTime());
    $('#currentTime').text(video.currentTime());
  });

  this.on("seeking", function() {

  });
});

var Tagger = function () {
  var self = this;

  this.tagDb = {};
  this.currentTime = 0;
  this.currentTagIx = 0;

  // bind to input box
  $('#tagInput').keyup(function(e) {
    if (e.keyCode==13) {
      $('#tagList').append('<li>'+$(this).val()+'</li>');
      self.appendDb($(this).val(), this.currentTagIx);
      $(this).val('');
    }
  });
}

Tagger.prototype.update = function (time) {
  this.currentTime = time;
  tagIx = this.timeToIx(time);
  if (this.currentTagIx !== tagIx) {
    this.currentTagIx = tagIx;
    this.renderList(tagIx);
  }
}

Tagger.prototype.renderList = function (ix) {
  $('#tagList').empty();
  if (typeof this.tagDb[ix] !== 'undefined') {
    var newlist = '';
    for (var i=0; i<this.tagDb[ix].length; i++) {
      newlist += '<li>'+this.tagDb[ix][i]+'</li>';
    }
    $('#tagList').append(newlist);    
  }
}

Tagger.prototype.timeToIx = function (time) {
  if (typeof time === 'undefined') {
    time = this.currentTime;
  }
  return Math.floor(time)
}

Tagger.prototype.appendDb = function (tag, ix) {
  if (typeof ix === 'undefined') {
    ix = this.timeToIx();
  }

  if (typeof this.tagDb[ix] === 'undefined') {
    this.tagDb[ix] = [tag];
  } else {
    this.tagDb[ix].push(tag);
  }
}

tagger = new Tagger();
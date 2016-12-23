(function() {

  var U = window.uestibulum;

  function guessEvent() {
    var now = new Date();

    var day = now.getDay();
    var hour = now.getHours();

    switch (day) {
      // Sunday
      case 0:
             if (hour >=  8 && hour < 10) return 'rehearsal';
        else if (hour >= 10 && hour < 13) return 'service';
        else if (hour >= 13 && hour < 15) return 'mixing';
        else if (hour >= 15 && hour < 18) return 'rehearsal';
        else if (hour >= 18 && hour < 21) return 'service';
        break;

      // Wednesday
      case 3:
             if (hour == 18) return 'rehearsal';
        else if (hour >= 19 && hour < 21) return 'service';
        break;
 
      // Tuesday, Thursday
      case 2: case 4:
        if (hour >= 19 && hour < 21) return 'rehearsal';
        break;

      // Monday, Friday, Saturday
      default:
    }

    return 'other';
  }

  function randomInt(max) {
    max = Math.floor(max);
    return Math.floor(Math.random() * max);
  }

  var curEvent;
  var curFace;
  var hidpi = U.config.hidpi;

  var facesForEvent = {
    mixing: ['m1', 'm2', 'm3'],
    rehearsal: ['r1', 'r2'],
    service: ['s1', 's2'],
    other: ['o1', 'o2', 'o3']
  };

  var greetingForEvent = {
    mixing: 'Get mixing!',
    rehearsal: 'Practice makes the master.',
    service: 'Worship the Lord!',
    other: 'Where words fail, music speaks.'
  };

  // Unneeded at present because all images are named after the faces:
  // <face-name>.jpg
  //var imagesForFace = { };

  var T = {
  
    name: 'music',

    init: function(uiView) {
      uiView.$el.addClass('theme-' + uiView.theme.name);
      curEvent = null;  // force the first render to guess the event
    },

    render: function(uiView, manualEvent, manualFaceIdx) {
      var prevEvent = curEvent;
      var prevFace = curFace;
      curEvent = manualEvent || guessEvent();

      if (curEvent != prevEvent) {

        // Get a face at random for this 
        var evFaces = facesForEvent[curEvent];
        var faceIdx = manualFaceIdx || randomInt(evFaces.length);
        curFace = evFaces[faceIdx];

        uiView.$el.removeClass(prevFace);
        uiView.$el.addClass(curFace);
        uiView.loginView.render();
        uiView.bgImgModel.set('url', 'themes/music/img/' +
          (hidpi ? 'hidpi/' : '') + curFace + '.jpg')
      }
    },

    unload: function(uiView) {
      uiView.$el.removeClass('theme-' + uiView.theme.name);
      uiView.$el.removeClass(curFace);
    },

    getGreeting: function() { return greetingForEvent[curEvent || 'other']; }

  };
  U.themes['music'] = T;
})();

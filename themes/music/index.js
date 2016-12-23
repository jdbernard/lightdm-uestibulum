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

  var curEvent;
  var hidpi = U.config.hidpi;

  var imagesByName = {
    mixing: [],
    rehearsal: [],
    service: [],
    other: [] }

  var T = {
  
    name: 'music',

    init: function(uiView) {
      uiView.$el.addClass('theme-' + uiView.theme.name);
    },

    render: function(uiView, manualEvent) {
      var prevEvent = curEvent;
      curEvent = manualEvent || guessEvent();

      if (curEvent != prevEvent) {
        uiView.$el.removeClass(prevEvent);
        uiView.$el.addClass(curEvent);
        uiView.loginView.render();
        uiView.bgImgModel.set('url', 'themes/music/img/' +
          (hidpi ? 'hidpi/' : '') + imagesByName[curEvent])
      }
    },

    unload: function(uiView) {
      uiView.$el.removeClass('theme-' + uiView.theme.name);
      uiView.$el.removeClass(curEvent);
    },

    getGreeting: function() { return 'Good ' + curEvent; }

  };
  U.themes['jdb'] = T;
})();

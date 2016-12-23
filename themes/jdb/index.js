(function() {

  var U = window.uestibulum;

  function currentTimePeriod() {
    var now = new Date();
    if (now.getHours() >= 21 || now.getHours() < 4) return 'night';
    else if (now.getHours() < 12) return 'morning';
    else if (now.getHours() < 18) return 'afternoon';
    else return 'evening';
  }

  var curTimePeriod;
  var hidpi = U.config.hidpi;

  var imagesByName = {
    morning: 'morning.png',
    afternoon: 'afternoon.png',
    evening: 'evening.png',
    night: 'night.gif' };

  var T = {
  
    name: 'jdb',

    init: function(uiView) {
      uiView.$el.addClass('theme-' + uiView.theme.name);
    },

    render: function(uiView, manualTimePeriod) {
      var prevTimePeriod = curTimePeriod;
      curTimePeriod = manualTimePeriod || currentTimePeriod();

      if (curTimePeriod != prevTimePeriod) {
        uiView.$el.removeClass(prevTimePeriod);
        uiView.$el.addClass(curTimePeriod);
        uiView.loginView.render();
        uiView.bgImgModel.set('url', 'themes/jdb/img/' +
          (hidpi ? 'hidpi/' : '') + imagesByName[curTimePeriod])
      }
    },

    unload: function(uiView) {
      uiView.$el.removeClass('theme-' + uiView.theme.name);
      uiView.$el.removeClass(curTimePeriod);
    },

    getGreeting: function() { return 'Good ' + curTimePeriod; }

  };
  U.themes['jdb'] = T;
})();

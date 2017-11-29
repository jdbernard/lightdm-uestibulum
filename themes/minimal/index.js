(function() {

  var U = window.uestibulum;

  var T = {
  
    name: 'minimal',

    init: function(uiView) {
      // Logic to setup the theme
      uiView.$el.addClass('theme-' + uiView.theme.name);
    },

    render: function(uiView) {
      // custom render logic
      uiView.loginView.render();
      uiView.$('input[name="pwd"]').focus();
    },

    unload: function(uiView) {
      // Logic to tear down the theme
      uiView.$el.removeClass('theme-' + uiView.theme.name);
    },

    getGreeting: function() { return ''; }

  };
  U.themes['minimal'] = T;
})();

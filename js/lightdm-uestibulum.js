(function() {

  var U = window.uestibulum = {};
  _.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g
  };

  U.ClockView = Backbone.View.extend({
    el: '#clock-panel',

    render: function() {
      var now = new Date();
      this.$el.find('.hours').text(now.getHours());
      this.$el.find('.minutes').text(now.getMinutes() < 10 ? "0" + now.getMinutes(): now.getMinutes());
    },

    initialize: function(options) {
      _.bindAll(this, 'render');
      setInterval(this.render, 1000);
      this.render();
    }
  });

  U.PowerView = Backbone.View.extend({
    el: '#power-panel',
    events: {
      'click #power-button':      'showPowerOptions',
      'mouseout #power-options':  'hidePowerOptions',
      'click #suspend':            'suspend',
      'click #restart':            'restart',
      'click #shutdown':           'shutdown'
    },
    
    initialize: function(options) {
      _.bindAll(this, 'showPowerOptions', 'hidePowerOptions', 'restart', 'shutdown', 'suspend');
      this.optionsEl = $('#power-options')[0];
    },

    showPowerOptions: function() { this.$el.addClass('active'); },
    hidePowerOptions: function(e) {
      if (e.target != this.optionsEl) return;
      this.$el.removeClass('active');
    },

    restart: function() { lightdm.restart(); },
    shutdown: function() { lightdm.shutdown(); },
    suspend: function() { lightdm.suspend(); }

  });

  U.LoginView = Backbone.View.extend({
    el: '#login-panel',
    events: {
      'click #user-display':            'showUserSelect',
      'click li.user':                  'selectUser',
      'keypress input[type=password]':  'enterPassword'
    },

    initialize: function(options) {
      _.bindAll(this, 'enterPassword', 'getUserName',
                'render', 'showPrompt', 'showUserSelect');

      this.uiView = options.uiView;
      window.show_prompt = this.showPrompt;
      this.user = lightdm.users[0];

      lightdm.authenticate(this.user.name);
      //lightdm.start_authentication(this.user.name);
    },

    getUserName: function(user) {
      return user.display_name || user.real_name || user.name;
    },

    render: function() {
      this.undelegateEvents();
      var greeting = 'Good ' + this.uiView.timePeriod;

      var $userListEl = this.$el.find('#users-list');
      $userListEl.html(
        _.map(lightdm.users, function(user) {
          return '<li class=user data-username="' + user.name + '">' + 
            this.getUserName(user) + '</li>';
        }, this).join('\n'));

      if (this.user) {
        this.$el.find('#greeting').text(greeting);
        this.$el.find('#user-display').text(this.getUserName(this.user));
      } 
      this.delegateEvents();
    },

    showUserSelect: function() {
      if (lightdm.lock_hint || lightdm.users.length === 1) return;

      this.$el.removeClass('failed-auth');
      this.$el.find('#users').addClass('select-user');
      lightdm.cancel_authentication();
      this.$el.find('input[type=password]').removeClass('active');
      this.user = null;
    },

    selectUser: function(e) {
      var username = $(e.target).attr('data-username');
      this.$el.find('#users').removeClass('select-user');
      this.user = _.find(lightdm.users, function(user) {
        return user.name == username; });
      lightdm.authenticate(this.user.name);
      this.render();
    },

    showPrompt: function(text, type) {
      if (type == 'password') {
        var $pwdInput = this.$el.find('input[type=password]');
        $pwdInput.addClass('active');
        $pwdInput.focus();
      }

      else alert(type + ': ' + text);
    },

    enterPassword: function(e) {
      this.$el.removeClass('failed-auth');
      //if (e.key != 'Enter') return;
      if (e.keyCode != 13) return;
      if (!lightdm.in_authentication) lightdm.authenticate(this.user.name);
      lightdm.respond($(e.target).val());
    }

  });

  U.SessionView = Backbone.View.extend({
    el: '#session-panel',
    events: {
      'click #session-display':   'showSessionSelect',
      'click li.session':         'selectSession'
    },

    initialize: function(options) {
      _.bindAll(this, 'render', 'showSessionSelect', 'selectSession');

      this.session = lightdm.sessions[0];
    },

    render: function() {
      this.$el.find('#sessions-list').html(
        _.map(lightdm.sessions, function(session) {
          return '<li class=session data-sessionkey="' + session.key + '">' +
            session.name + '</li>'; }).join('<li>&nbsp;|&nbsp;</li>'));

      if (this.session) {
        this.$el.find('#session-display').text(this.session.name); }
    },

    showSessionSelect: function() {
      this.$el.find('#sessions').addClass('select-session');
    },

    selectSession: function(e) {
      this.$el.find('#sessions').removeClass('select-session');
      var sessionKey = $(e.target).attr('data-sessionkey');
      this.session = _.find(lightdm.sessions, function(session) {
        return session.key == sessionKey; });
      this.render();
    }
  });

  U.UIView = Backbone.View.extend({
    el: 'body',
    events: {},

    initialize: function(options) {
      _.bindAll(this, 'render', 'authComplete', 'checkTimePeriod');

      window.authentication_complete = this.authComplete;
      window.autologin_timer_expired = function() {};

      if (lightdm.lock_hint) this.$el.addClass('lock-screen');

      this.timePeriod = 'day';
      this.loginView = new U.LoginView({uiView: this});
      this.sessionView = new U.SessionView();
      this.clockView = new U.ClockView();
      this.powerView = new U.PowerView();
      this.render();
    },

    authComplete: function() {
      if (lightdm.is_authenticated) {
        //lightdm.start_session(this.sessionView.session.key);
        lightdm.login(this.loginView.user, this.sessionView.session.key);
      }
      else {
        this.$el.find('#login-panel').addClass('failed-auth');
        lightdm.authenticate(this.loginView.user.name);
        //lightdm.start_authentication(this.loginView.user.name);
      }
    },

    render: function() {
      var prevTimePeriod = this.timePeriod;
      this.checkTimePeriod();

      if (this.timePeriod != prevTimePeriod) {
        this.$el.removeClass(prevTimePeriod);
        this.$el.addClass(this.timePeriod);
        this.loginView.render();
        this.sessionView.render();
      }
    },

    checkTimePeriod: function() {
      var now = new Date();
      if (now.getHours() >= 21 || now.getHours() < 4) this.timePeriod = 'night';
      else if (now.getHours() < 12) this.timePeriod = 'morning';
      else if (now.getHours() < 18) this.timePeriod = 'afternoon';
      else this.timePeriod = 'evening';
    }
  });

  $(document).ready(function() { 
    U.uiView = new U.UIView();
  });



})();


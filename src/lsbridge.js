(function(root, factory) {
  if(typeof define === 'function' && define.amd) {
    define([], factory);
  } else if(typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.lsbridge = factory();
  }
}(this, function() {

  /*
    - Storing messages in localStorage.
    - Clients subscribe to the changes and
      they get notified if a new message arrives.
  */

  var api = {};

  api.isLSAvailable = (function() {
    var mod = '_';
    try {
      localStorage.setItem(mod, mod);
      localStorage.removeItem(mod);
      return true;
    } catch(e) {
      return false;
    }
  })();

  if(api.isLSAvailable) {

    var interval = 100
      , intervalForRemoval = 200
      , ls = localStorage
      , listeners = {}
      , isLoopStarted = false
      , buffer = {};

    var loop = function() {
      for(var namespace in listeners) {
        var data = ls.getItem(namespace);
        if(data && buffer[namespace] && buffer[namespace].indexOf(data) === -1) {
          buffer[namespace].push(data);
          try {
            var parsed = JSON.parse(data);
            if(parsed) data = parsed;
          } catch(e) {}
          for(var i=0; i<listeners[namespace].length; i++) {
            listeners[namespace][i](data);
          }
          if(!ls.getItem(namespace + '-removeit')) {
            ls.setItem(namespace + '-removeit', '1');
            (function(n) {
              setTimeout(function() {
                ls.removeItem(n);
                ls.removeItem(n + '-removeit');
                buffer[namespace] = [];
              }, intervalForRemoval);
            })(namespace);
          }
        } else if(!data) {
          buffer[namespace] = [];
        }
      }
      setTimeout(loop, interval);
      return true;
    };

    api.send = function(namespace, data) {
      var raw = '';
      if(typeof data === 'function') { data = data(); }
      if(typeof data === 'object') {
        raw = JSON.stringify(data);
      } else {
        raw = data;
      }
      ls.setItem(namespace, raw);
    };


    api.subscribe = function(namespace, cb) {
      if(!listeners[namespace]) {
        listeners[namespace] = [];
        buffer[namespace] = [];
      }
      listeners[namespace].push(cb);
      if(!isLoopStarted) {
        isLoopStarted = loop();
      }
    };

    api.unsubscribe = function (namespace) {
      if(listeners[namespace]) {
        listeners[namespace] = [];
      }
      if(buffer[namespace]) {
        buffer[namespace] = [];
      }
    };

    api.getBuffer = function() {
      return buffer;
    }

  } else {
    api.send = api.subscribe = function() {
      throw new Error('localStorage not supported.');
    }
  }

  return api;
}));

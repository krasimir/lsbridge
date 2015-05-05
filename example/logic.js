var App = function() {

  var $ = function(sel) { return document.querySelector(sel); }

  var messages = [];
  var messagesEl = $('.js-messages');
  var log = function(str, color) {
    if(color) {
      str = '<span style="color: ' + color + ';">' + str + '</span>';
    }
    messages = ['> ' + str].concat(messages);
    messagesEl.innerHTML = messages.join('<br />');
  }

  var onSubscribeClicked = function() {
    var namespace = $('#namespace-subscribing').value;
    // Subscribing to a particular namespace
    lsbridge.subscribe(namespace, function(data) {
      log('<strong>' + namespace + ':</strong> ' + data.message);
    });
    log('Subscribed to <strong>' + namespace + '</strong> namespace.', '#999');
  }
  $('.js-subscribe').addEventListener('click', onSubscribeClicked);

  var sendNamespace = $('#namespace-sending');
  var sendMessage = $('#message');
  var onSendClicked = function() {
    lsbridge.send(
      sendNamespace.value,
      { message: sendMessage.value }
    );
    $('#message').value = '';
  }
  $('.js-send').addEventListener('click', onSendClicked);
  $('body').addEventListener('keypress', function(e) {
    e.keyCode === 13 && onSendClicked();
  });

  onSubscribeClicked();

};

window.onload = App;
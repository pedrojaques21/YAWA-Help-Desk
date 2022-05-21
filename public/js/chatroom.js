$(document).ready(function () {

  const socket = io();

  socket.on('message', msg => {
    console.log(msg);
  });

  $('#message_form').on('submit', () => {
    socket.emit('newChatMessage', $('#msg').val());
  });

  socket.on('newMessage', function (msg) {
    $('#messages').append('<li>' + (msg.id + ":" + msg.msg) + '</li>');
    window.scrollTo(0, document.body.scrollHeight);
  });
});

function intToRGB(i) {
  var c = (i & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();

  return "00000".substring(0, 6 - c.length) + c;
}

function hashCode(str) { // java String#hashCode
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var result = intToRGB(hash);
  console.log(result);
  return result;
}

$(document).ready(function () {

  var socket = io();

  //We don't need to pass the name, it will be obtained from the session
  socket.emit("join");

  $('form').submit(function () {
      socket.emit('chat message', $('#m').val());
      console.log($('#m').val());
      $('#m').val('');
      return false;
  });
  socket.on('chat message', function (msg) {
      $('#messages').append('<li style=background-color:#' + hashCode(msg.id) + '>' + (msg.id + ":" + msg.msg) + '</li>');
      window.scrollTo(0,document.body.scrollHeight);
  });

  socket.on('update',function(msg){
      $('#messages').append('<li style="background-color:#000000;color:#FFFFFF">' + (msg) + '</li>');
      window.scrollTo(0,document.body.scrollHeight);
  });
});
const io = require('socket.io')(server);

// convert a connect middleware to a Socket.IO middleware
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

io.use((socket, next) => {
  if (socket.request.user) {
    next();
  } else {
    next(new Error('unauthorized'))
  }
});

io.on('connect', (socket) => {
  console.log(`new connection ${socket.id}`);
  socket.on('whoami', (cb) => {
    cb(socket.request.user.username);
  });

  const session = socket.request.session;
  console.log(`saving sid ${socket.id} in session ${session.id}`);
  session.socketId = socket.id;
  session.save();

  //Chat
  socket.on("join", function(){
    console.log(socket.request.user.username+" joined server");
    io.emit("update", socket.request.user.username + " has joined the server.");
  });


  socket.on('chat message',function(msg){
    console.log('message: '+msg);
    var mensagem = {msg:msg, id:socket.request.user.username};
    io.emit('chat message', mensagem);
  })

});
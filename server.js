const express = require('express');
const app = express();
const server = require("http").createServer(app);
require('dotenv').config();
const port = process.env.PORT;

const session = require("express-session");
const bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
const ensureLoggedOut = require('connect-ensure-login').ensureLoggedOut;

const sessionMiddleware = session({ secret: "changeit", resave: false, saveUninitialized: false });
app.use(sessionMiddleware);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

app.use(express.static('public'));

//API Routes
const registerRoutes = require('./routes/registerRoutes');
app.use('/register', registerRoutes);

const loginRoutes = require('./routes/loginRoutes');
app.use('/login', loginRoutes);

const chatroomRoutes = require('./routes/chatroomRoutes');
app.use('/chatroom', chatroomRoutes);

app.get("/", (req, res) => {
  res.render('pages/index');
});

//Socket.io Stuff
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

server.listen(port, () => {
  console.log(`application is running at: http://localhost:${port}`);
});

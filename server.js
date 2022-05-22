require('dotenv').config();

const path = require('path');
const express = require('express');
const http = require('http');
const expressLayouts = require('express-ejs-layouts');

const app = express();
const server = http.createServer(app);

const session = require("express-session");
const bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
const ensureLoggedOut = require('connect-ensure-login').ensureLoggedOut;
const sessionMiddleware = session({ secret: "mySecretKey", resave: false, saveUninitialized: false });

//My Routers
const indexRouter = require('./routes/index')

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout')
app.use(expressLayouts);
app.use(express.static('public'));

app.use(sessionMiddleware);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter)

const user =  require('./controllers/userController')
const initializePassport = require('./passport-config')
initializePassport(
  passport,
  username => user.findUser(username, res),
  id => user.getById(id, res)
);

//API Routes
const registerRoutes = require('./routes/registerRoutes');
app.use('/register', registerRoutes);

const loginRoutes = require('./routes/loginRoutes');
app.use('/login', loginRoutes);

const chatroomRoutes = require('./routes/chatroomRoutes');
app.use('/chatroom', chatroomRoutes);

//Socket.io Stuff
const socketio = require('socket.io');
const io = socketio(server);

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));
//Run on new connection
io.on('connection', (socket) => {
  console.log(`New Connection ${socket.id}`);

  const session = socket.request.session;
  console.log(`saving sid ${socket.id} in session ${session.id}`);
  session.socketId = socket.id;
  session.save();

  //Chat
  socket.on("join", function(){
    console.log(socket.id+" joined server");
    io.emit("update", socket.id + " has joined the server.");
  });


  socket.on('chat message',function(msg){
    console.log('message: '+msg);
    var mensagem = {msg:msg, id:socket.id};
    io.emit('chat message', mensagem);
  })
});

server.listen(process.env.PORT || 3000, () => {
  console.log(`Application is running at: http://localhost:${process.env.PORT || 3000}`);
});

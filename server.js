require('dotenv').config();
const path = require('path');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

const session = require("express-session");
const bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
const ensureLoggedOut = require('connect-ensure-login').ensureLoggedOut;
const sessionMiddleware = session({ secret: "mySecretKey", resave: false, saveUninitialized: false });

app.use(sessionMiddleware);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

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

const user =  require('./controllers/userController')

passport.use(new LocalStrategy(
  (username, password, done) => {
    user.findUser(username, password, done);
  }
));

passport.serializeUser((user, cb) => {
  console.log(`SerializeUser ${user.id}`);
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  console.log(`DeserializeUser ${id}`);
  user.getById(id, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

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

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Application is running at: http://localhost:${port}`);
});

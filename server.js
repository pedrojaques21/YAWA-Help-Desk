require('dotenv').config();

const express = require('express');
const http = require('http');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require("body-parser");

const app = express();
const server = http.createServer(app);

const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
const ensureLoggedOut = require('connect-ensure-login').ensureLoggedOut;
const sessionMiddleware = session({ secret: "mySecretKey", resave: false, saveUninitialized: false });

//My Routers
const indexRouter = require('./routes/index')
const registerRoutes = require('./routes/register');
const loginRoutes = require('./routes/login');
const chatroomRoutes = require('./routes/chatroom');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout')
app.use(expressLayouts);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

//API Routes
app.use('/', indexRouter)
app.use('/register', registerRoutes);
app.use('/login', loginRoutes);
app.use('/chatroom', chatroomRoutes);

const user =  require('./controllers/userController')
const initializePassport = require('./passport-config')
initializePassport(
  passport,
  username => user.findUser(username, res),
  id => user.getById(id, res)
);

//Socket.io Stuff
const socketio = require('socket.io');
const io = socketio(server);

const Chatroom = require('./models/chatroom')
const Message = require('./models/message')

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
  socket.on("join", () => {
    console.log(socket.id + " joined server");
    io.emit("update", socket.id + " has joined the server.");
  });


  socket.on('chat message', async (msg) => {
    console.log('message: '+msg);
    var mensagem = {msg:msg, id:socket.id};
    const message = new Message({
      author: mensagem.id,
      message: mensagem.msg
    })
    try {
      const newMessage = await message.save()
    } catch (err) {
      console.log(err)
    }
    io.emit('chat message', mensagem);
  })
});

server.listen(process.env.PORT || 3000, () => {
  console.log(`Application is running at: http://localhost:${process.env.PORT || 3000}`);
});

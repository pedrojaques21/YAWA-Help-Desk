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
const methodOverride = require('method-override')

const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
const ensureLoggedOut = require('connect-ensure-login').ensureLoggedOut;
const sessionMiddleware = session({ secret: "mySecretKey", resave: false, saveUninitialized: false });

//My Routers
const indexRouter = require('./routes/index')
const registerRoutes = require('./routes/register');
const loginRoutes = require('./routes/login');
const chatroomRoutes = require('./routes/chatroom');
const ticketsRouter = require('./routes/tickets')
const faqsRouter = require('./routes/faqs')


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout')
app.use(expressLayouts);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));

app.use(sessionMiddleware);
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'))

app.use('/', indexRouter)
app.use('/register', registerRoutes);
app.use('/login', loginRoutes);
app.use('/chatroom', chatroomRoutes);
app.use('/tickets', ticketsRouter)
app.use('/faqs', faqsRouter)

const user =  require('./controllers/userController')
const initializePassport = require('./passport-config')
initializePassport(
  passport,
  username => user.findUser(username, res),
  id => user.getById(id, res)
);

//Socket.io Stuff
const io = require('socket.io')(server);

const Chatroom = require('./models/chatroom')
const Message = require('./models/message')

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

//Run on new connection
io.on('connection', socket => {
  const session = socket.request.session;
  console.log(`saving sid ${socket.id} in session ${session.id}`);
  session.socketId = socket.id;
  session.save();

  //Chat
  socket.on("join", () => {
    console.log(socket.id + " joined server");
    io.emit("update", socket.id + " has joined the server.");
  });


  socket.on('new-chat-message', async (room, msg) => {
    console.log( 'message: ' + msg );
    var newMessage = {
      msg: msg, 
      id: socket.id 
    };
    const message = new Message({
      author: newMessage.id,
      message: newMessage.msg
    })
    try {
      const createdMessage = await message.save()
      const chatroom = await Chatroom.updateOne(
        { title: room },
        {$push: {messages: createdMessage.id}}
      )
    } catch (err) {
      console.log(err)
    }
    io.emit('new-chat-message', newMessage);
  })
});

server.listen(process.env.PORT || 3000, () => {
  console.log(`Application is running at: http://localhost:${process.env.PORT || 3000}`);
});

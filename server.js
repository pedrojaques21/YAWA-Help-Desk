require('dotenv').config();

const express = require('express');
const http = require('http');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require("body-parser");
const passport = require("passport");
const flash = require('express-flash');
const session = require("express-session");
const methodOverride = require('method-override');
const emojis = require('emojis');

const app = express();
const server = http.createServer(app);

const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
const ensureLoggedOut = require('connect-ensure-login').ensureLoggedOut;

//App settings and Middlewares
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');

app.use(expressLayouts);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));
app.use(methodOverride('_method'));
app.use(flash());
const sessionMiddleware = session({ 
  secret: process.env.SESSION_SECRET, 
  resave: false, 
  saveUninitialized: false 
});
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

//My Routes
const indexRouter = require('./routes/index');
const registerRoutes = require('./routes/register');
const loginRoutes = require('./routes/login');
const logoutRoutes = require('./routes/logout');
const chatroomRoutes = require('./routes/chatroom');
const ticketsRouter = require('./routes/tickets');

app.use('/', indexRouter);
app.use('/register', ensureLoggedOut('/'), registerRoutes);
app.use('/login', ensureLoggedOut('/'), loginRoutes);
app.use('/logout', ensureLoggedIn('/'), logoutRoutes);
app.use('/chatroom', chatroomRoutes);
app.use('/tickets', ticketsRouter)
app.use('/faqs', faqsRouter)

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
  
  console.log(`new connection ${socket.id}`);

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
    console.log( 'message: ' + emojis.unicode(msg) );
    var newMessage = {
      msg: emojis.unicode(msg), 
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

const app = require("express")();
const server = require("http").createServer(app);
const port = process.env.PORT || 3000;

const session = require("express-session");
const bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const ensureLoggedOut = require('connect-ensure-login').ensureLoggedOut;

const sessionMiddleware = session({ secret: "mySecret", resave: false, saveUninitialized: false });
app.use(sessionMiddleware);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (!user.verifyPassword(password)) { return done(null, false); }
        return done(null, user);
      });
    }
));

app.get("/", (req, res) => {
  const isAuthenticated = !!req.user;
  if (isAuthenticated) {
    console.log(`user is authenticated, session is ${req.session.id}`);
  } else {
    console.log("unknown user");
  }
  res.sendFile("../views/index.html", { root: __dirname });
});

app.get("/register", ensureLoggedOut('/'), (req, res) => {

  res.sendFile("../views/register.html", { root: __dirname });
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);

app.post("/register",function(req,res){

  //New User in the DB
  const instance = new User({ username: req.body.username, password: req.body.password });
  instance.save(function (err, instance) {
    if (err) return console.error(err);

    //Let's redirect to the login post which has auth
    res.redirect(307, '/login');
  });

});

app.post("/logout", (req, res) => {
  console.log(`logout ${req.session.id}`);
  const socketId = req.session.socketId;
  if (socketId && io.of("/").sockets.get(socketId)) {
    console.log(`forcefully closing socket ${socketId}`);
    io.of("/").sockets.get(socketId).disconnect(true);
  }
  req.logout();
  res.cookie("connect.sid", "", { expires: new Date() });
  res.redirect("/");
});

passport.serializeUser((user, cb) => {
  console.log(`serializeUser ${user.id}`);
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  console.log(`deserializeUser ${id}`);
  User.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

server.listen(port, () => {
  console.log(`application is running at: http://localhost:${port}`);
});
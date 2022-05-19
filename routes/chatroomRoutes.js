const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

app.get("/chatroom", ensureLoggedIn('/'), (req,res) => {

  res.sendFile(__dirname + '/chatroom.html');

});
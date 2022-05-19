app.get("/chatroom", ensureLoggedIn('/'), (req,res) => {

  res.sendFile(__dirname + '/chatroom.html');

});
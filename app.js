const dotenv = require("dotenv");
const express = require('express');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const morgan = require('morgan');
const methodOverride = require('method-override');
const appRoutes = require('./routes/appRoute');
const favicon = require('serve-favicon');
const path = require('path');
const http = require('http');
const socket = require('socket.io');
const router = express.Router();
const {currentlyGuest, loggedIn} = require('./middlewares/authentication');
var app = express()
const controller = require('./controllers/appController');
const server = http.createServer(app)
const io = socket(server)
const port = process.env.PORT || 3000

var numPlayers = 0

//Whenever someone connects this gets executed
io.on('connection', function(socket){
    console.log('User connected');

    socket.on('joined', function(msg) {
        numPlayers = msg.numPlayers
        if (numPlayers === "2")
            msg.color = "black"
        socket.emit('player', msg)
    });

    socket.on('play', function (roomId) {
        socket.broadcast.emit('play', {roomId, numPlayers});
    });


    socket.on('move', function (msg) {
        socket.broadcast.emit('move', msg);
    });

    //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', function () {
        console.log('A user disconnected');
        numPlayers = 1
        io.emit('roomId_on_disconnect', {})
    });

    socket.on('roomId_on_disconnect', function(msg) {
        //route that directs controller through post request
        //to eventually decrease numPlayers by 1
        router.post('/disconnected/' + msg.roomId, loggedIn, controller.disconnected)
    });
});

app.set('view engine', 'ejs');
dotenv.config();

mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_POINTER}`, 
                {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    server.listen(port, () => {
        console.log('Server is running on port', 3000);
    });
})
.catch(err=>console.log(err.message));

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

app.use(session(
{
    secret: `${process.env.SECRET}`,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60*60*1000, httpOnly: true },
    store: new MongoStore(
    {
        mongoUrl: `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_POINTER}`
    })
}));

app.use(flash());

app.use((req, res, next) =>
{
    res.locals.user = req.session.user || null;
    res.locals.editorPieces = req.session.editorPieces || null;
    res.locals.errors = req.flash('error');
    res.locals.successes = req.flash('success');
    next();
});

app.use('/', appRoutes);

app.use((req, res, next) =>
{
    let error = new Error("The server cannot find " + req.url);
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) =>
{
    if (!error.status)
    {
        error.status = 500;
        error.message = "Internal Server Error";
    }

    res.render("./main/error", { error: error });
});

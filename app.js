const dotenv = require("dotenv");
const express = require('express');
const injector = require('express-script-injector');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const morgan = require('morgan');
const methodOverride = require('method-override');
const appRoutes = require('./routes/appRoute');

const app = express();
app.set('view engine', 'ejs');
dotenv.config();

mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_POINTER}`, 
                {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    app.listen(process.env.PORT || 3000, () => { 
        console.log('Server is running on port', 3000);
    });
})
.catch(err=>console.log(err.message));

app.use(express.static('public'));
//app.use(injector({path: __dirname + '/public/js'}))
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

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

app.use('/', appRoutes);
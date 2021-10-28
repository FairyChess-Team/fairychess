const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const appRoutes = require('./routes/appRoute');
const dotenv = require("dotenv");

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
app.use(morgan('tiny'));

app.use('/', appRoutes);
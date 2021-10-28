const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const appRoutes = require('./routes/appRoute');

const app = express();
app.set('view engine', 'ejs');

mongoose.connect('mongodb+srv://ultimateUser:WScyh50KwhjyvRRX@fairychess.qcf83.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', 
                {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    app.listen(process.env.PORT || 3001, ()=>{ 
        console.log('Server is running on port', 3001);
    });
})
.catch(err=>console.log(err.message));

app.use(express.static('public'));
app.use(morgan('tiny'));
app.listen(process.env.PORT || 3000);

app.use('/', appRoutes);
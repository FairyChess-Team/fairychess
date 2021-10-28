const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const app = express();

let port = 3000;
let host = 'localhost';
app.set('view engine', 'ejs');

app.listen(port, host, () =>
{
    console.log("FairyChess V1.0 is running on port ", port);
});

app.use(express.static('public'));
app.use(morgan('tiny'));

app.get('/', (req, res) =>
{
    res.render('test');
});

app.get('/editor', (req, res) =>
{
    res.render('editor');
});
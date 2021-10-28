const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const app = express();
app.set('view engine', 'ejs');

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
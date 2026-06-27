require("dotenv").config();
const express = require('express');
const app = express();

const cors = require('cors');
const loginRoute = require('./routes/login.route')
const signUpRoute = require('./routes/signUp.route')
const cartRoute = require('./routes/cart.routes')
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use('/',loginRoute)
app.use('/',signUpRoute)
// app.use('/',cartRoute)
module.exports = app;
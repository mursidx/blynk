const express = require("express");
const app = express();
require("dotenv").config();
const indexRouter = require("./routes/index");
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const productRouter = require('./routes/product');
const expressSession = require("express-session");
require('./config/db')
require('./config/googleOauth-config')
const path = require('path');
const cookieParser = require("cookie-parser");

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); 
app.use(express.static(path.join(__dirname, 'public')))
app.use(expressSession({
    resave: true,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
}))

app.use("/", indexRouter);
app.use('/auth', authRouter);
app.use('/admin',adminRouter);
app.use('/products', productRouter);

app.listen(3000);

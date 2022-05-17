const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
const path = require("path")

//process.env.DB_URL is stored in Heroku's built in env variables
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/recipe-tracker';
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const secret = process.env.SECRET || 'notagoodsecret';
//config for session stored in mongo 
const sessionConfig = {
    store: MongoStore.create({
        mongoUrl: dbUrl,
        touchAfter: 24 * 60 * 60
    }),
    name: 'session',
    secret,
    resave: false,
    saveUnitialized: true,
    cookie:{
        httpOnly: true,
        //session expires in a week from login
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
//using passport for authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//keep track of currently logged in user
app.use((req, res, next)=>{
    res.locals.currentUser = req.user;
    next();
})

//routes for backend api
app.use('/', userRoutes);

//error middleware
app.use((err, req, res, next)=>{
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Something went wrong'
    res.status(statusCode).render('error', {err})
})

//for sending static file request to client
app.use(express.static(path.join(__dirname, "client", "build")))

//reaches this catchall routehandler if the api routes above are not able to handle the request
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Serving on port ${PORT}`)
})
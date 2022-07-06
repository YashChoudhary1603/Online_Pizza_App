require("dotenv").config();
const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
const expressLayout = require("express-ejs-layouts");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const port = process.env.PORT || 3000;
const flash =require('express-flash');
// const MongoDbStoree = require("connect-mongo")
// const MongoDbStore = new MongoDbStoree(session);
//session ko DATABASE ME store karne ke liye ye package use karte hai
const Emitter = require('events');
const http = require('http')



//Assets
app.use(express.static("public"));
app.use(cors());
app.use(flash());
app.use(express.urlencoded({extended:false}));
app.use(express.json());
//Database connection
const url = "mongodb://localhost:27017/pizza";
mongoose.connect(url, {
  useNewUrlParser: true,
  //useCreateIndex: true,
  useUnifiedTopology: true,
  //useFindAndModify: true,
});

const connection = mongoose.connection;

connection.once("open", () => {
    console.log("Database connected...");
  }).on('error', function (err) {
      console.log(err);
    });






//session Store
// let mongoStore = new MongoDbStore({
//    mongooseConnection : connection,
//    collection :'sessions'
// })

//Event Emitter
const eventEmitter =  new Emitter()
app.set('eventEmitter', eventEmitter);

//Session config
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    //store: mongoStore,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },//24hours
  })
);

//passport related task
const passportInit = require('./app/config/passport');
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

//global middleware taki session  hume har request me mile (req.session) nam se
app.use((req,res,next)=>{
  res.locals.session =req.session;
  res.locals.user =req.user
  next();
})



//set template engine  
app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"resources/views"));
app.use(expressLayout);

//Adding the routes file and calling the function
require('./routes/web')(app)



const server = app.listen(port, () => {
  console.log(`The app is running on server ${port}`);
});


//socket connection
const io = require('socket.io')(server)

io.on('connection',(socket)=>{
    //join
    //console.log(socket.id)
    socket.on('join',(orderId)=>{
      //console.log(orderId)
      
      socket.join(orderId)
    })
})

eventEmitter.on('orderUpdated',(data)=>{
    io.to(`order_${data.id}`).emit('orderUpdate',data)
});


eventEmitter.on("orderPlaced",(data)=>{
  console.log(data)
  io.to("adminRoom").emit("orderPlaced", data);
});
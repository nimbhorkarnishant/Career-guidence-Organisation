const express =require('express')
const user_router=require('./user/routes/user_router')
const mongoose=require('mongoose')
const app=express()
const path=require('path');
var session = require('express-session');
var cookieParser = require('cookie-parser');
app.use(cookieParser());






mongoose.connect('mongodb://localhost/node_js_learncess_org', {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
})


app.use(session({secret: "Shh, its a secret!",saveUninitialized: true,resave: true}));
app.set('view engine','ejs')
app.set('views', path.join(__dirname, './user/views'));
app.use(express.static(__dirname + '/user/views/static'));
app.use(express.urlencoded({ extended: false }))
app.use("/",user_router)

// app.get('/new',function(req,res){
//   if(req.session.page_views){
//      req.session.page_views++;
//      res.send("You visited this page " + req.session.page_views + " times");
//   } else {
//      req.session.page_views = 1;
//      res.send("Welcome to this page for the first time!");
//   }
// });

app.listen(5000)

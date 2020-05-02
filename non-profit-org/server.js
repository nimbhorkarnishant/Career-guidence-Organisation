const express =require('express')
const user_router=require('./user/routes/user_router')
const volunteer_router=require('./volunteer/routes/volunteer_router')
const club_router=require('./club_detail/routes/club_router')
const mongoose=require('mongoose')
const fileUpload = require('express-fileupload');
const app=express()
const path=require('path');
var flash = require('connect-flash');
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
app.use(flash());
app.use(fileUpload());



app.use("/",user_router)
app.use("/",volunteer_router)
app.use("/",club_router)


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

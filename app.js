var express = require('express');
var path = require('path');
const moment=require('moment');
const mongoose = require('mongoose');
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');
const session=require('express-session');
//cookie 数据存放在客户的浏览器上，session 数据放在服务器上。
//session 运行在服务器端，当客户端第一次访问服务器时，可以将客户的登录信息保存。
//当客户访问其他页面时，可以判断客户的登录状态，做出提示，相当于登录拦截。
const MongoStore=require('connect-mongo')(session);
var app = express();
app.locals.moment=moment;


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//设置的中间键
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
//静态文件处理
app.use("/assets",express.static("assets"))

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(bodyParser());//post req.body
app.use(cookieParser('123456'));
app.use(session({
  secret:"123456",
  name:'sessionId',
  cookie:{maxAge:60*1000},
  rolling:true,
  store:new MongoStore({
    url:"mongodb://localhost:27017/app"//session保存到指定的数据库
  })
}));

//链接数据库
mongoose.connect("mongodb://localhost/app",{useNewUrlParser:true});
//提示数据库连接成功
const con=mongoose.connection;
con.on('open',function(){
  console.log("数据库连接成功");
})

//退出程序
app.get('/loginout',function(req,res){
  req.session.destroy(function(err){
    if(err) throw err;
    console.log("退出成功");
  })
  //重定向登录
  res.redirect('/login');
})

app.use('/login',require('./routes/login'));
app.use('/add', require('./routes/add'));
app.use('/product',require('./routes/product'));
app.use('/register',require('./routes/register'));


// error handler
app.use(function (err, req, res, next) {
  res.send('error');
});
app.listen(4000);
module.exports = app;
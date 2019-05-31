const express=require('express');
const router=express.Router();
const md5=require('md5');
const user=require('../models/user');
//GET   /login login.ejs发送给客户端


router.get("/",function(req,res){
    res.render("login");
})

router.post('/',function(req,res){
    //提交的数据如何获取
    console.log(req.body.username);
    console.log(req.body.password);
    user.find({
        username:(req.body.username),
        password:md5(req.body.password)//加密数据库密码
    },function(err,result){
        if(err) throw err;
        console.log(result);
        if (result.length){
            req.session.username=req.body.username;
            req.session.password=md5(req.body.password);
            console.log("登录成功");
            res.redirect("/add/list");
        }else{
            console.log("密码错误或用户不存在");
            res.render('login');
        }
    })



})

module.exports=router;
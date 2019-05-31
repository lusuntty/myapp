const express=require('express');
const router=express.Router();
const product=require('../models/product');
const fs=require('fs');
const path=require('path');
const formidable=require('formidable');
const login=require('../middlewares/login');//判断权限中间键

router.get('/delete/:id',login,function(req,res){
    // req.params.id
    //根据ID查询数据库  删除这个数据
    product.findByIdAndRemove(req.params.id,function(err){
        if(err) throw err;
        console.log("删除成功");
        //删除相应的图片
        // fs.unlink(path.join(__dirname,"../",'uploads',req.query.img),function(){
        //     if(err) throw err;
        //     console.log("图片删除成功");
        // });
        //客户端保持list页面展示
        // res.end('delect success')
        // res.redirect("back");//重定向方法一 指定删除后页面
        res.redirect("/add/list");//方法二 指定删除后页面跳转到的页面
    })
})
router.get('/update/:id',login,function(req,res){
    //提供更新数据的页面 update.ejs
    product.findById(req.params.id,function(err,result){
        if(err) throw err;
        res.render("update",{data:result})
    })
})

router.post('/update/:id',login,function(req,res){
    //解析数据
    const form=new formidable.IncomingForm();
    form.keepExtensions=true;
    form.uploadDir=path.join(__dirname,"../","uploads");
    form.parse(req,function(err,fields,files){
        if(err) throw err;
        //数据组装
        var obj={
            ...fields,//扩展文件
            updateAt:new Date()//更新的时间字段
        }
        //判断数据图片有没有更新
        // if(files.pic.name){//图片更新
        //     obj.pic="/"+path.basename(files.pic.path);
        // }else{//图片没有更新 使用原来图片

        // }

        product.findByIdAndUpdate(req.params.id,obj,function(err){
            if(err) throw err;
            console.log("更新成功");
            res.redirect('/add/list');
        })
    })
    //保存到数据库

    //路由重定向

})

module.exports=router;
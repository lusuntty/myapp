const express = require('express');
const path = require('path');
const formidable = require('formidable');
const router = express.Router();
const product=require("../models/product");
const login=require('../middlewares/login');//判断权限中间键
var arr = [];

router.get("/", login,function (req, res) {//login是判断是否已经登录 没登录则跳转到login页面
    res.render("add");
})

router.post('/', function (req, res) {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.uploadDir = path.join(__dirname, "../", "uploads");
    form.parse(req, function (err, fields, files) {
        if (err) throw err;
        //保存数据
        var obj = {
            ...fields,
            // pic: "/" + path.basename(files.pic.path),
        }
        var productIstance=new product(obj);//集合的实例 一个文档 一天数据
        productIstance.save();//保存数据
        // productIstance.save(function(err){
        //     if(err) throw err;
        //     console.log("保存成功");
        // })

        res.redirect('/add/list');
        // res.end('success');
    })
})

router.get('/list', function (req, res) {
    console.log(arr)

    //获取cookie
    //res.send(req.cookies)
    // //获取数据库数据
    product.find({},function(err,results){
        if(err) throw err;
        console.log(results);
       res.render('list',{arr:results})
        console.log(results);
    })
    // // res.render('list', {arr})
})

module.exports = router;
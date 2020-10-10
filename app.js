const express=require('express');
const rest=require("./routes/rest_handler");
var bodyparser=require('body-parser');
var path=require('path');

var app=express()

app.use(bodyparser.json())

app.set('view engine', 'ejs');

app.get('/',function(req,res){
    res.render('user-interface')
})

app.get('/user-list',rest.table);
app.post('/signup',rest.store);
app.get('/myrank',rest.user);

app.listen(process.env.PORT ||5000);






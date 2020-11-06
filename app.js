
const express=require('express');
const rest=require("./routes/rest_handler");
var bodyparser=require('body-parser');
var port=process.env.PORT||5000;
var app=express()

app.use(bodyparser.json())

app.set('view engine', 'ejs');

app.get('/',function(req,res){
    res.render('user-interface')
})

app.get('/user-list',rest.table);
app.get('/user-rank-list',rest.table_rank);
app.post('/signup',rest.store);
app.get('/myrank',rest.user);

app.listen(port,function(){
console.log('listening on '+port);});







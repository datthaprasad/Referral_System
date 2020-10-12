var db=require('../database');


//For Handling GET request by ADMIN
const table=(req,res,next)=>{
  var limit=20;
  if(req.query.limit && req.query.limit!=null){
    limit=req.query.limit;
  }
  var sql='SELECT * FROM data ORDER BY Referral_Count DESC LIMIT '+limit;
    db.query(sql, function (err, data, fields) {
    if (err){
       console.log(err.message);
       res.status(500).send("SOMETHING WENT WRONG")
    }
    else{ 
        res.status(200).render('../views/user-list.ejs',{ title: 'User List', userData: (data)})
    }
  });
}

//For Handling POST request by ADMIN
const store=(req,res,next)=>{
  const {U_ID,E_ID,R_ID}=req.body;
  
  var sql=`INSERT INTO data values(NULL,"${U_ID}","${E_ID}",0)`;
  db.query(sql, function (err, data, fields) {
    if (err){
      console.log(err.message);
      res.status(500).send("SOMETHING WENT WRONG, PLEASE TRY AGIAN LATER")
    } 
    else{  
      if(R_ID && R_ID!=null){
        var sql=`UPDATE data SET Referral_Count=Referral_Count+1 where UserID="${R_ID}"`;
        db.query(sql, function (err, data, fields) {
          if (err){
             console.log(err.message);
             res.status(500).send("SOMETHING WENT WRONG")
          }
        });
      }
      res.status(200).json("data stored");
    }
  });
 
}

//For Handling GET request by user
const get_by_user=(req,res,next)=>{
  db.query("set @row_number=0",function(error,datas,fields){
    if(error){
      res.status(500).json("SOMETHING WENT WRONG");
    }
    else{
      var sql='select rank,referral_count from (select (@row_number:=@row_number+1) as rank,userid,emailid,referral_count from data order by referral_count desc) as newdata where userid="'+req.query.U_ID+'"';
      db.query(sql, function (err, data, fields) {
        if (err){
           console.log(err.message);
           res.status(404).json("NOT FOUND");
        }
        else{  
            res.status(200).json(data[0]);
        }
      });
    }
  })
 
}



exports.user=get_by_user;
exports.table=table;
exports.store=store;
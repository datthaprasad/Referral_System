var db=require('../database');


//For Handling GET request by ADMIN
const table=(req,res,next)=>{
  var limit=0;
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
  
  var sql=`INSERT INTO data values("${U_ID}","${E_ID}",0)`;
  db.query(sql, function (err, data, fields) {
    if (err){
      console.log(err.message);
      res.status(500).send("SOMETHING WENT WRONG")
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
  var sql='SELECT UserID,EmailID,Referral_Count,(select count(*)+1 from data where Referral_Count>(select Referral_Count from data where UserID="'+req.query.U_ID+'")) as Rank from data where UserID="'+req.query.U_ID+'"';
  db.query(sql, function (err, data, fields) {
    if (err){
       console.log(err.message);
       res.status(404).json("NOT FOUND");
    }
    else{  
      console.log(data);
        res.status(200).json(data[0]);
    }
  });
}



exports.user=get_by_user;
exports.table=table;
exports.store=store;
var db=require('../database');


//For Handling GET request by ADMIN
const table=(req,res,next)=>{
  var limit=100;
  if(req.query.limit && req.query.limit!=null){
    limit=req.query.limit;
  }
  var sql='SELECT * FROM data LIMIT '+limit;
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
  let R_COUNT;//store referral_Count
try{
  db.query(`select Referral_Count from data where UserID='${req.query.U_ID}'`,function(err,data,fields){
    if(err){

      res.status(500).json("SOMETHING WENT WRONG, TRY AGAIN"+err.message);
    }
    else{
	try{
        R_COUNT=data[0].Referral_Count;
	}
	catch(err){
		res.json("WRONG USER ID, TRY AGAIN");
		return 0;
	}
        if(R_COUNT===0){
          let count;
          console.log("count is 0");
          var sql=`select count(*) as rank from (select Referral_Count from data where Referral_Count>(select Referral_Count from data where UserID="${req.query.U_ID}") group by Referral_Count) as data`
          db.query(sql, function (err, data, fields) {
            if (err){
               console.log(err.message);
               res.status(404).json("NOT FOUND");
            }
            else{  
                count=data[0].rank;
            }
          });

        db.query("set @row_number=0",function(error,datas,fields){
          if(error){
            res.status(500).json("SOMETHING WENT WRONG");
          }
          else{
            var sql=`select rank,referral_count from (select (@row_number:=@row_number+1)+${count} as rank,userid,emailid,referral_count from data where Referral_Count=0) as newdata where userid="${req.query.U_ID}"`;
            db.query(sql, function (err, data, fields) {
              if (err){
                 console.log(err.message);
                 res.status(404).json("NOT FOUND");
              }
              else{  
                console.log(data[0]);
                  res.status(200).json(data[0]);
              }
            });
          }
        })}
      
        else{
          var sql=`select EmailID,Referral_Count,(select count(*)+1 from(select Referral_Count from data where Referral_Count>(select Referral_Count from data where UserID="${req.query.U_ID}") group by Referral_Count) as data) as rank from data where UserID="${req.query.U_ID}"`
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
    }
  })
}
catch(err){
res.json("YOU DONT HAVE USER ID");
}

 
 
}

//Handle Rank order in table view
const table_rank=(req,res,next)=>{
  var limit=100;
  if(req.query.limit && req.query.limit!=null){
    limit=req.query.limit;
  }
  var sql='SET @row_number=0';
    db.query(sql, function (err, data, fields) {
    if (err){
       console.log(err.message);
       res.status(500).send("SOMETHING WENT WRONG")
    }
    else{ 
      var sql=`select * from ((select rank,UserID,EmailID,t1.Referral_Count from (select * from data d where d.Referral_Count>0) t1 join (select *,(@row_number:=@row_number+1) as rank from (select d.Referral_Count from data d where d.Referral_Count>0 group by Referral_Count order by Referral_Count desc) as dps ) t2 on t1.Referral_Count=t2.Referral_Count order by rank)
       UNION  
      (select (@row_number:=@row_number+1) as rank,UserID,EmailID,Referral_Count from data where Referral_Count=0)) d where d.rank<="`+limit+`" order by rank`;
      db.query(sql,function(err,data,fields){
        if(err){
          console.log(err.message);
          res.status(500).send("SOMETHING WENT WRONG")
        }
        else{
          res.status(200).render('../views/user-rank-list.ejs',{ title: 'User List', userData: (data)})
        }
      })
    }
  });
}



exports.user=get_by_user;
exports.table=table;
exports.store=store;
exports.table_rank=table_rank;
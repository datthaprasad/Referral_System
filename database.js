var mysql = require('mysql');
require('custom-env').env(true)
var conn = mysql.createConnection({
  host: process.env.MYSQL_HOST||'localhost',//'localhost', // Replace with your host name
  user: process.env.MYSQL_USER||'root' ,      // Replace with your database username
  password: process.env.MYSQL_PASS ||'dp.com' ,      // Replace with your database password
  database:process.env.MYSQL_DB ||'referral_system'  // // Replace with your database Name
}); 
conn.connect(function(err) {
  if (err) console.log(err.message);
  else
  console.log('Database is connected successfully !');
});
module.exports = conn;

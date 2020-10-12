var mysql = require('mysql');
require('custom-env').env(true)
var conn = mysql.createConnection({
  host: process.env.HOST,//'localhost', // Replace with your host name
  user: process.env.USER_NAME ,      // Replace with your database username
  password: process.env.PASSWORD ,      // Replace with your database password
  database:process.env.DATABASE  // // Replace with your database Name
}); 
conn.connect(function(err) {
  if (err) console.log(err.message);
  else
  console.log('Database is connected successfully !');
});
module.exports = conn;
var mysql = require('mysql');
var conn = mysql.createConnection({
  host: 'localhost', // Replace with your host name
  user: 'root',      // Replace with your database username
  password: 'dp.com',      // Replace with your database password
  database: 'referral_system' // // Replace with your database Name
}); 
conn.connect(function(err) {
  if (err) console.log(err.message);
  else
  console.log('Database is connected successfully !');
});
module.exports = conn;
var mysql = require('mysql');
var conn = mysql.createConnection({
  host: "sql12.freemysqlhosting.net",//'localhost', // Replace with your host name
  user: 'sql12369897',      // Replace with your database username
  password: 'Q8tGJP6G33',      // Replace with your database password
  database: 'sql12369897' // // Replace with your database Name
}); 
conn.connect(function(err) {
  if (err) console.log(err.message);
  else
  console.log('Database is connected successfully !');
});
module.exports = conn;
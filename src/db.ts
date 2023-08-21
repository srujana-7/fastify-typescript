


import mysql from 'mysql';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'your_db_user',
  password: 'your_db_password',
  database: 'todo_db'
});

export default connection;

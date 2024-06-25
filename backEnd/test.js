const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: 8081,
    password: '', // Your MySQL root password
    database: 'sisiii_project' // Ensure this matches exactly with your database name
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting: ' + err.stack);
        return;
    }
    console.log('Connected as id ' + db.threadId);
    db.end(); // Close the connection immediately for this test
});

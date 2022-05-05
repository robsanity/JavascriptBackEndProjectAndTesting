'use strict'

const sqlite = require('sqlite3');
const db = new sqlite.Database('path_file_database', (err) => {
    if(err){
        throw err;
    }
});





const sql = 'SELECT * FROM table_name';

db.all(sql, (err, rows) => {
    if (err){
        throw err;
    }
    else{
        //do
    }
});
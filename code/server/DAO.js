'use strict';
/* Data Access Object (DAO) module*/

const sqlite = require('sqlite3');
const dayjs = require('dayjs');

const db = require('./db');

// get all SKUs
exports.listSKUs = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM SKUs`;
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject({error: `Database error during the retrieval of the SKUs`});
        return;
      }
      const SKUs = rows.map((t) => ({ id: t.id}));
      resolve(SKUs);
    });
  });
};

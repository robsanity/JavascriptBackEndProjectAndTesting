'use strict';
const db = require('../db.js');

function listSKUItems() {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM SKUItems";
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject({ error: "no SKUItems in database" });
                return;
            }
            const SKUItems = rows.map((t) => ({ RFID: t.RFID, SKUId: t.idSKU, Available: t.available, DateOfStock: t.dateOfStock }));
            resolve(SKUItems);
        });
    });
};

function findSKUItems(SKUId) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM SKUItems WHERE available=1 AND idSKU=?";
        db.all(sql, [SKUId], (err, rows) => {
            if (err) {
                reject({ error: "no SKUItems in database" });
                return;
            }
            const SKUItems = rows.map((t) => ({ RFID: t.RFID, SKUId: t.idSKU, DateOfStock: t.dateOfStock }));
            resolve(SKUItems);
        });
    });
};

function findSKUItem(rfid) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM SKUItems WHERE RFID=?";
        db.all(sql, [rfid], (err, rows) => {
            if (err) {
                reject({ error: "no SKUItems in database" });
                return;
            }
            const SKUItems = rows.map((t) => ({ RFID: t.RFID, SKUId: t.idSKU, Available: t.available, DateOfStock: t.dateOfStock }));
            resolve(SKUItems);
        });
    });
};

function createSKUItem(rfid, SKUId, date) {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO SKUItems (RFID, idSKU, dateOfStock) VALUES (?,?,?)";
        db.run(sql, [rfid, SKUId, date], function(err) {
            if(err) {
                reject({ error: "no insert" });
            }
            else
            {
            resolve(rfid);
            }
        });
    });
};
function addRetOrdtoSKUITEM(returnOrderid){
    return new Promise((resolve,reject )=>{
        const sql = "UPDATE SKUItems SET returnOrderId = ?"
        db.run(sql,[returnOrderid],function(err){
            if (err) {
                reject({ error: "no update" });

            }
            resolve(true);
        })
    })
}



function modifySKUItem(newrfid, newavailable, newdate,rfid) {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE SKUItems SET RFID=?, available=?, dateOfStock=? WHERE RFID=?";
        db.all(sql, [ newrfid, newavailable, newdate,rfid], (err, rows) => {
            if (err) {
                reject({ error: "no update" });

            }
            resolve(true);
        });
    });
};

function deleteSKUItem(rfid) {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM SKUItems WHERE RFID=?";
        db.all(sql, [rfid], (err, rows) => {
            if (err) {
                reject({ error: "no delete" });

            }
            resolve(true);
        });
    });
};


function createSKUItemNoDate(rfid, SKUId) {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO SKUItems (RFID, idSKU) VALUES (?,?)";
        db.run(sql, [rfid, SKUId], function(err) {
            if(err) {
                console.log(err);
                reject({ error: "no insert" });
            }
            else
            {
            resolve(true);
            }
        });
    });
};
function deleteALLSKUItems() {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM SKUItems";
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject({ error: "no delete" });

            }
            resolve(true);
        });
    });
}

module.exports = { listSKUItems, findSKUItems, findSKUItem, createSKUItem, deleteALLSKUItems, modifySKUItem, deleteSKUItem, createSKUItemNoDate, addRetOrdtoSKUITEM }
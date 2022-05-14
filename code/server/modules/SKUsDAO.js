'use strict';
const db = require('../db.js');



function listSKUs() {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM SKUs`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject({ error: `Database error during the retrieval of the SKUs` });
                return;
            }
            const SKUs = rows.map((t) => ({ idSKU: t.idSKU, description: t.description, weight: t.weight, volume: t.volume, notes: t.notes, idPosition: t.idPosition, avaibleQuantity: t.avaibleQuantity, price: t.price }));
            resolve(SKUs);
        });
    });
};

function findSKU(idSKU) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM SKUs WHERE idSKU = ?`;
        db.all(sql, [idSKU], (err, rows) => {
            if (err) {
                reject({ error: `Database error during the retrieval of the SKUs` });
                return;
            }
            const SKUs = rows.map((t) => ({ description: t.description, weight: t.weight, volume: t.volume, notes: t.notes, idPosition: t.idPosition, avaibleQuantity: t.avaibleQuantity, price: t.price }));
            resolve(SKUs);
        });
    });
};

function createSKU(description, weight, volume, notes, availableQuantity, price) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO SKUs (description,weight,volume,notes,availableQuantity,price) values (?,?,?,?,?,?)';
        db.run(sql, [description, weight, volume, notes, availableQuantity, price], function (err) {
            if (err) {
                reject(err + 'Errore');
            }
            else {
                resolve(this.lastID);
            }
        })
    });
};

function updateSKU(description,weight,volume,notes,price,availableQuantity,idSKU) {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE  SKUs SET description = ?, weight = ?, volume = ?, notes = ?, price =  ?, availableQuantity = ? WHERE idSKU = ? && UPDATE Positions SET occupiedWeight";
        db.run(sql, [description,weight,volume,notes,price,availableQuantity,idSKU], function(err){
            if (err){
                reject(err + 'Error');
            }
            else{
                resolve (this.lastID);
            }
        })
    });
};
function updatePosition() {
    return new Promise((resolve, reject) => {
        const sql1 = "UPDATE SKUs SET idPosition = ? WHERE idSKU = ?";
        const sql2 = "UPDATE Position JOIN SKUs on idPosition SET idPosition = ? ,occupiedWeight = occupiedWeight + weight , occupiedVolume = occupiedVolume + volume, WHERE idSKU = ? AND idPosition = ?"
        
    });
};

function deleteSKU() {
    return new Promise((resolve, reject) => {

    });
};

module.exports = { listSKUs, findSKU, createSKU, updateSKU, deleteSKU }
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

//funzionate

function findSKU(idSKU) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM SKUs WHERE idSKU = ?`;
        db.all(sql, [idSKU], (err, rows) => {
            if (err) {
                reject({ error: `Database error during the retrieval of the SKUs` });
                return;
            }
            const SKUs = rows.map((t) => ({idSKU:t.idSKU, description: t.description, weight: t.weight, volume: t.volume, notes: t.notes, idPosition: t.idPosition, avaibleQuantity: t.avaibleQuantity, price: t.price }));
            resolve(SKUs);
        });
    });
};

//funzionante


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

//funzionate

function updateSKU(description,weight,volume,notes,price,availableQuantity,idSKU,idSKU2,idSKU3,idSKU4) {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE SKUs SET description = ?, weight = ?, volume = ?, notes = ?, price =  ?, availableQuantity = ? WHERE idSKU = ? "; 
        const sql2 = "UPDATE Positions SET occupiedWeight = Positions.occupiedWeight + (SELECT weight FROM SKUs WHERE Positions.idPosition = SKUs.idPosition AND idSKU = ?), occupiedVolume = occupiedVolume + (SELECT volume FROM SKUs WHERE Positions.idPosition = SKUs.idPosition AND idSKU = ?) WHERE idPosition = (SELECT idPosition FROM SKUs WHERE idSKU = ?)  ";

        db.run(sql, [description,weight,volume,notes,price,availableQuantity,idSKU], function(err){
            if (err){
                reject(err + 'Error');
            }
            else{
                
                resolve (this.lastID);
            }

        })
        db.run(sql2, [idSKU2,idSKU3,idSKU4], function(err){
            if (err){
                reject(err + 'Error');
            }
            else{
                
                resolve (this.lastID);
            }

        })
    });
};

//funzionante


function updatePosition(idSKU1,idSKU2,idSKU3,idPosition,idSKU4,idSKU5,idSKU6,idPosition2) {
    return new Promise((resolve, reject) => {
        const sql =  "UPDATE Positions SET occupiedWeight = Positions.occupiedWeight - (SELECT weight FROM SKUs WHERE Positions.idPosition = SKUs.idPosition AND idSKU = ?),  occupiedVolume = Positions.occupiedVolume - (SELECT volume FROM SKUs WHERE Positions.idPosition = SKUs.idPosition AND idSKU = ?) WHERE idPosition = (SELECT idPosition FROM SKUs WHERE idSKU = ?)";
        const sql2 = "UPDATE SKUs SET idPosition = ? WHERE idSKU = ?"
        const sql3 = "UPDATE Positions SET occupiedWeight = Positions.occupiedWeight + (SELECT weight FROM SKUs WHERE idSKU = ?), occupiedVolume = Positions.occupiedVolume + (SELECT volume FROM SKUs WHERE idSKU = ?) WHERE idPosition = ?";
        db.run(sql, [idSKU1,idSKU2,idSKU3], function(err){
            if(err){
                reject(err + 'Error');
            }
            else {
                resolve(this.lastID)
            }
        })
        db.run(sql2, [idPosition,idSKU4],function(err){
            if(err){
                reject(err +'Error');
            }else {
                resolve (this.lastID);
            }
        })
        db.run(sql3, [idSKU5,idSKU6,idPosition2],function(err){
            if(err){
                reject(err+ 'Error');
            }else{
                resolve(this.lastId);
            }
        })
        //
    });
};

//funzionante

function deleteSKU(idSKU) {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM SKUs WHERE idSKU = ?"
        db.run(sql,[idSKU],function(err){
            if(err){
                reject(err +'Error')
            }
            else {
                resolve(this.lastID)
            }
        })
    });
};

//tutto funzionante

module.exports = { listSKUs, findSKU, createSKU, updateSKU, updatePosition, deleteSKU}
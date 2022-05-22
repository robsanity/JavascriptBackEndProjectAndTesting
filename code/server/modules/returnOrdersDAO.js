'use strict';
const db = require('../db.js');

function listReturnOrders() {
    return new Promise((resolve, reject) => {
        
        const sql = "SELECT idReturnOrder,idRestockOrder,returnDate FROM ReturnOrders";
        const sql2 = "SELECT idReturnOrder, idSKU, description,price,RFID FROM Products";
        db.all(sql2, [], (err, rows) => {
            if (err) {
                reject({ error: `Database error` });
                return;
            }
            
            const lello = rows.map((t) => ({ idReturnOrder: t.idReturnOrder, idSKU: t.idSKU, description: t.description, price: t.price, RFID: t.RFID }));

            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject({ error: `Database error` });
                    return;
                }
                
                const we = rows.map((k) => ({ idReturnOrder: k.idReturnOrder, returnDate: k.returnDate, idRestockOrder: k.idRestockOrder, products: [] }));
                for (let i = 0; i < we.length; i++) {
                    for (let k = 0; k < lello.length; k++) {
                        if (we[i].idReturnOrder == lello[k].idReturnOrder) {
                            we[i].products.push(lello.reduce((x => x = lello[k])));

                        }
                    }
                }


                resolve(we);
            });
        });

    });
};
//funzionante

function findRetOrder(idReturnOrder) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT idReturnOrder,idRestockOrder,returnDate FROM ReturnOrders WHERE idReturnOrder = ?";
        const sql2 = "SELECT idSKU, description,price,RFID from Products WHERE idReturnOrder = ?";
        db.all(sql2, [idReturnOrder], (err, rows) => {
            if (err) {
                reject({ error: `Database error` });
                return;
            }
            const lello = rows.map((t) => ({ idSKU: t.idSKU, description: t.description, price: t.price, RFID: t.RFID }));
            db.all(sql, [idReturnOrder], (err, rows) => {
                if (err) {
                    reject({ error: `Database error` });
                    return;
                }
                const products = rows.map((k) => ({ idReturnOrder: k.idReturnOrder, returnDate: k.returnDate, idRestockOrder: k.idRestockOrder }));
                products.map((elem) => {
                    elem.products = [lello];
                    resolve(products);
                });

            });
        });
    });
};

//funzionante
function getRetID() {
    return new Promise((resolve, reject) => {
        const sql = "SELECT idReturnOrder FROM ReturnOrders ";
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject({ error: `Database error` });
                return;
            }
            var franco = rows.map((j) => ({ idReturnOrder: j.idReturnOrder }));



            resolve(franco);
        });
    });
};

function createRetOrder(idReturnOrder, returnDate, idRestockOrder, idSKUItem) {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO ReturnOrders (idReturnOrder,returnDate,idRestockOrder,idSKUItem) VALUES(?,?,?,?)";
        db.run(sql, [idReturnOrder, returnDate, idRestockOrder, idSKUItem], function (err) {
            if (err) {
                reject(err + 'Errore');
            }
            else {
                resolve(idReturnOrder);
            }
        })
    });
};
function updateProducts(){
    return new Promise((resolve,reject)=>{
        const sql = "INSERT INTO Products (idSKU,description,price,RFID,idReturnOrder) VALUES (SELECT idSKU,description,price,RFID,idReturnOrder FROM SKUItems sku,SKU SK,ReturnOrders RO WHERE sku.RFID = RO.idSKUItems AND sku.idSKU = SK.idSKU"
        db.run(sql,[],function(err){
            if (err) {
                reject(err + 'Errore');
            }
            else {
                resolve(this.lastID);
            }
        });
        });
    };

//funzionante


function getIDMax() {
    return new Promise((resolve, reject) => {
        const sql = "SELECT MAX(idReturnOrder) AS idReturnOrder FROM ReturnOrders ";
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject({ error: `Database error` });
                return;
            }
            var franco = rows.map((j) => ({ idReturnOrder: j.idReturnOrder }));



            resolve(franco);
        });
    });
};

function deleteRetOrder(idReturnOrder){
    return new Promise((resolve,reject)=>{
        const sql = "DELETE FROM ReturnOrders WHERE idReturnOrder = ?"
        db.run(sql,[idReturnOrder], function(err){
        if(err){
            reject({error : "no data to delete"});
            return;
        }
        else {
            resolve(this.lastID);
        }
    });
})
};

// tutto funzionante, imlementare updatePRoducts o no?
function deleteDatas(){
    return new Promise((resolve,reject)=>{
        const sql = "DELETE FROM ReturnOrders";
        db.run(sql,[], function(err){
            if(err){
                reject(err);
            }
            else {
                resolve(this.lastID);
            }
        })
    })
}


module.exports = { listReturnOrders, findRetOrder, getRetID, createRetOrder, getIDMax,updateProducts,deleteRetOrder, deleteDatas }
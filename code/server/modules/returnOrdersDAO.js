'use strict';
const sqlite = require('sqlite3');
const db = new sqlite.Database('database.db', (err) => {
    if (err) throw err;
  });
function listReturnOrders() {
    return new Promise((resolve, reject) => {
        
        const sql = "SELECT idReturnOrder,idRestockOrder,returnDate FROM ReturnOrders";
        const sql2 = "SELECT idReturnOrder, idSKU, description,price,RFID FROM Products";
        db.all(sql2, [], (err, rows) => {
            if (err) {
                reject({ error: `Database error` });
                return;
            }
            
            const array = rows.map((t) => ({ idReturnOrder: t.idReturnOrder, idSKU: t.idSKU, description: t.description, price: t.price, RFID: t.RFID }));

            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject({ error: `Database error` });
                    return;
                }
                
                const we = rows.map((k) => ({ id: k.idReturnOrder, returnDate: k.returnDate, idRestockOrder: k.idRestockOrder, products: [] }));
                for (let i = 0; i < we.length; i++) {
                    for (let k = 0; k < array.length; k++) {
                        if (we[i].idReturnOrder == array[k].idReturnOrder) {
                            we[i].products.push(array.reduce((x => x = array[k])));

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
            const array = rows.map((t) => ({ idSKU: t.idSKU, description: t.description, price: t.price, RFID: t.RFID }));
            db.all(sql, [idReturnOrder], (err, rows) => {
                if (err) {
                    reject({ error: `Database error` });
                    return;
                }
                const products = rows.map((k) => ({ id: k.idReturnOrder, returnDate: k.returnDate, idRestockOrder: k.idRestockOrder }));
                products.map((elem) => {
                    elem.products = [array];
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
            var riga = rows.map((j) => ({ id: j.idReturnOrder }));



            resolve(riga);
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
            var riga = rows.map((j) => ({ idReturnOrder: j.idReturnOrder }));



            resolve(riga);
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

function addProducts(idSKU,description,price,RFID,idReturnOrder){
    return new Promise((resolve,reject)=>{
        const sql = "INSERT INTO Products (idSKU,description,price,RFID,idReturnOrder) VALUES (?,?,?,?,?)";
        db.run(sql,[idSKU,description,price,RFID,idReturnOrder],function(err){
            if(err){
                reject(err);
            }
            else {
                resolve(this.lastID);
            }
        })
    })
}


function deleteProducts(){
    return new Promise((resolve,reject)=>{
        const sql = "DELETE FROM Products";
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



module.exports = { listReturnOrders, findRetOrder, getRetID, createRetOrder, getIDMax,updateProducts,deleteRetOrder, deleteDatas, deleteProducts,addProducts }
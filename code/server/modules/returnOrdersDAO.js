'use strict';
const db = require('../db.js');

function listReturnOrders() {
    return new Promise((resolve,reject) => {
        // 2 query per creare i 2 array
        const sql =  "SELECT idReturnOrder,idRestockOrder,returnDate FROM ReturnOrders";
        const sql2 = "SELECT SK.idSKU,description,price,RFID FROM SKUs SK, SKUItems SKUIt WHERE SK.idSKU = SKUIt.idSKU ";
        db.all(sql2, [], (err, rows) => {
            if (err) {
                reject({ error: `Database error` });
                return;
            }
            //array di products
            const lello = rows.map((t) => ({idSKU: t.idSKU, description:t.description,price:t.price,RFID:t.RFID}));
            
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject({ error: `Database error` });
                    return;
                }
                //array finale con pop e slice dell'array di products per avere tutto nello stesso ordine
                const products = rows.map((k) => ({idReturnOrder: k.idReturnOrder,returnDate: k.returnDate,idRestockOrder: k.idRestockOrder}));
                lello.reverse();
                while (lello.length>0){
                let gino = lello.pop();
                products.map((elem) => {
                    elem.products = [gino];
                    });
                    lello.splice(-1);
                gino = [];
                };
                resolve(products);
            });
                
        });
    });
};

 

module.exports = {listReturnOrders}
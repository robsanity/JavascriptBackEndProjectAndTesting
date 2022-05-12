'use strict'
function getRestockOrders() {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM restockOrders WHERE state!='ISSUED'";
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject({ error: "no restock orders in database" });
                return;
            }
            const restockOrders = rows.map((t) => ({
                id: t.id, issueDate: t.issueDate, state: t.state,
                 supplierId: t.supplierId, transportNote: t.transportNote
            }));
            resolve(restockOrders);
        });
    });
}

function getISSUEDRestockOrders() {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM restockOrders WHERE state='ISSUED'";
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject({ error: "no restock orders with state ISSUED in database" });
                return;
            }
            const restockOrdersISSUED = rows.map((t) => ({
                id: t.id, issueDate: t.issueDate, state: t.state,
                supplierId: t.supplierId
            }));
            
            resolve(restockOrdersISSUED);
        });
    });
}

function getByIdRestockOrders(id) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM restockOrders WHERE idRestockOrder=?";
        db.all(sql, [id], (err, rows) => {
            if (err) {
                reject({ error: "no restock orders with the given id in database" });
                return;
            }
            const restockOrdersById = rows.map((t) => ({
                id: t.id, issueDate: t.issueDate, state: t.state,
                supplierId: t.supplierId, transportNote: t.transportNote
            }));
            resolve(restockOrdersById);
        });
    });
}

function getToBeReturnRestockOrders(id) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT SIidSKU as SKUId, rfid  FROM RestockOrders RO, RestockOrderItems ROI, Items I, SKUItems SI WHERE RO.idRestockOrder=? AND RO.idRestockOrder=ROI.idRestockOrder AND ROI.idItem=I.idItem AND I.idSKU=SI.idSKU";                  
        db.all(sql, [id], (err, rows) => {
            if (err) {
                reject({ error: "no restock orders with the given id in database" });
                return;
            }
            const RestockOrdersToBeReturn = rows.map((t) => ({ SKUId: t.SKUId, rfid: t.rfid }));
            resolve(RestockOrdersToBeReturn);
        });
    });
}


module.exports = { getRestockOrders, getISSUEDRestockOrders, getByIdRestockOrders, getToBeReturnRestockOrders };
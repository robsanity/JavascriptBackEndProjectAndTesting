'use strict'

const db = require("../db");
/*
async function listIntOrders() {

        let completed = await getCompleted();
        let notCompleted = await getNotCompleted();
        let listProductsNotCompleted = await getProductsNotCompleted();
        let listProductsCompleted = await getProductsCompleted();


        let listNotCompleted = notCompleted.map((nt) => ({
            id: nt.id,
            issueDate: nt.issueDate,
            state: nt.state,
            products:
                listProductsNotCompleted
                    .filter((p) => p.id = nt.id)
                    .map(element => ({
                        SKUId: element.SKUId,
                        description: element.description,
                        price: element.price,
                        qty: element.qty
                    })),
            customerId: nt.customerId
        }
        ));

        let listCompleted = completed.map((nt) => ({
            id: nt.id,
            issueDate: nt.issueDate,
            state: nt.state,
            products:
                listProductsCompleted
                    .filter((p) => p.id = nt.id)
                    .map(element => ({
                        SKUId: element.SKUId,
                        description: element.description,
                        price: element.price,
                        rfid: element.rfid
                    })),
            customerId: nt.customerId
        }
        ));

        let internalOrder = []
        internalOrder.push(listCompleted);
        internalOrder.push(listNotCompleted);
        internalOrder.sort((a, b) => a.id - b.id);

        return internalOrder;

}
*/
/*
async function findIntOrderIssued() {

        let productsIssued = await getProductsNotCompleted();
        let IOIssued = await getIssued();

        let issuedInternalOrder = IOIssued.map((o) => ({
            id: o.id,
            issueDate: o.issueDate,
            state: o.state,
            products:
                productsIssued
                    .filter((p) => p.id = o.id)
                    .map(element => ({
                        SKUId: element.SKUId,
                        description: element.description,
                        price: element.price,
                        qty: element.qty
                    })),
            customerId: o.customerId
        }
        ));

        return issuedInternalOrder;

}
*/
/*
async function findIntOrderAccepted() {

        let productsAccepted = await getProductsNotCompleted();
        let IOAccepted = await getAccepted();

        let acceptedInternalOrder = IOAccepted.map((o) => ({
            id: o.id,
            issueDate: o.issueDate,
            state: o.state,
            products:
                productsAccepted
                    .filter((p) => p.id = o.id)
                    .map(element => ({
                        SKUId: element.SKUId,
                        description: element.description,
                        price: element.price,
                        qty: element.qty
                    })),
            customerId: o.customerId
        }
        ));
        return acceptedInternalOrder;

}
*/
/*
function createIntOrder(issueDate, products, customerId) {
    return new Promise((resolve, reject) => {
        let sql = "INSERT INTO InternalOrders (date, idCustomer) values (?,?)";
        let lastID = "SELECT last_insert_rowid() as lastId";

        db.all(lastID, [], (err, rows) => {
            if (err) {
                reject({ error: "no insert" });
                return;
            }
            else {
                lastID=rows[0];
            }
        });

        db.all(sql, [issueDate, customerId], (err, rows) => {
            if (err) {
                reject({ error: "no insert" });
                return;
            }
        });

        sql = "INSERT INTO InternalOrdersSKUs (idInternalOrder, idSKU, quantity) values (?,?,?)";
        products.forEach((p) => {
            db.all(sql, [lastID, p.SKUId, p.qty], (err, rows) => {
                if (err) {
                    reject({ error: "no insert" });
                    return;
                }
            })
        })

        resolve(true);
    });
}
*/
/*
async function createIntOrder(issueDate, products, customerId) {

        let idIntOrder=await insertIO(issueDate, customerId);
        for (let p of products) {
            await insertIOS(idIntOrder, p.SKUId, p.qty);
        }

}
*/
function insertIO(issueDate, customerId) {
    return new Promise((resolve, reject) => {
        let sql = "INSERT INTO InternalOrders (date, idCustomer) values (?,?)";
        let lastID = "SELECT last_insert_rowid() as lastId";
        db.all(sql, [issueDate, customerId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            } else {
                db.all(lastID, [], (err, rows) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    else {
                        resolve(rows[0].lastId);
                    }
                });
            }
        });
    })
}

function insertIOS(id, SKUId, qty){
    return new Promise((resolve, reject) => {
        let sql = "INSERT INTO InternalOrdersSKUs (idInternalOrder, idSKU, quantity) values (?,?,?)";
        
            db.all(sql, [id, SKUId, qty], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                else {
                    resolve(true)
                }
            })
    })
}

function updateIntOrder(id, newState, products) {
    if (newState !== 'COMPLETED') {
        return new Promise((resolve, reject) => {
            let sql = "UPDATE InternalOrders SET state=? WHERE idInternalOrder=?"
            db.all(sql, [newState, id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                else {
                    resolve(true);
                    return;
                }
            });
        });
    }
    else {
        //TO BE COMPLETED
        return new Promise((resolve, reject) => {
            //update state
            let sql = "UPDATE InternalOrders SET state=? WHERE idInternalOrder=?"
            db.all(sql, [newState, id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
            });

            //per ogni rfid SET available=0 e collego l'item all'internal order;

            sql = "UPDATE SKUItems SET available=0, internalOrderId=? WHERE rfid=?"
            products.forEach((p) => {
                db.all(sql, [id, p.rfid], (err, rows) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                })
            })


            //elimino da internalorderskus

            sql = "DELETE FROM InternalOrdersSKUs WHERE idSKU=? AND idInternalOrder=?"
            products.forEach((p) => {
                db.all(sql, [p.SkuID, id], (err, rows) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                })
            })


            resolve(true);
        });
    }
}

function deleteIntOrder(id) {
    return new Promise((resolve, reject) => {
        let sql = "DELETE FROM InternalOrdersSKUs WHERE idInternalOrder=?";
        db.all(sql, [id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
        });

        sql = "DELETE FROM InternalOrders WHERE idInternalOrder=?";
        db.all(sql, [id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
        });

        resolve(true);
    });
}


function getNotCompleted() {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM InternalOrders WHERE state!='COMPLETED'";
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            let notCompleted = rows.map((t) => ({ id: t.idInternalOrder, issueDate: t.date, state: t.state, customerId: t.idCustomer }));
            resolve(notCompleted);
        });
    });
}

function getCompleted() {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM InternalOrders WHERE state=='COMPLETED'"
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            let completed = rows.map((t) => ({ id: t.idInternalOrder, issueDate: t.date, state: t.state, customerId: t.idCustomer }));
            resolve(completed);
        });
    });
}

function getProductsNotCompleted() {
    return new Promise((resolve, reject) => {
        let sql = "SELECT IOS.idInternalOrder AS id, S.idSKU AS SKUId, S.description AS description, S.price AS price, IOS.quantity AS qty FROM InternalOrdersSKUs IOS, SKUs S WHERE IOS.idSKU=S.idSKU "
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
}

function getProductsCompleted() {
    return new Promise((resolve, reject) => {
        let sql = "SELECT SI.internalOrderId AS id, SI.idSKU AS SKUId, S.description AS description, S.price AS price, SI.RFID AS rfid FROM SKUItems SI, SKUs S WHERE SI.idSKU=S.idSKU"
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
}

function getIssued() {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM InternalOrders WHERE state=='ISSUED'"
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            let issued = rows.map((t) => ({ id: t.idInternalOrder, issueDate: t.date, state: t.state, customerId: t.idCustomer }));
            resolve(issued);
        });
    });
}

function getAccepted() {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM InternalOrders WHERE state=='ACCEPTED'"
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            let accepted = rows.map((t) => ({ id: t.idInternalOrder, issueDate: t.date, state: t.state, customerId: t.idCustomer }));
            resolve(accepted);
        });
    });
}

function deleteDatas() {
    return new Promise((resolve, reject) => {
        let sql = "DELETE FROM InternalOrdersSKUs";
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            else {
                sql = "DELETE FROM InternalOrders";
                db.all(sql, [], (err, rows) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    else {
                        resolve(true);
                    }
                });
        
                
            }
        });

        
    });
}

function getSKUsIO() {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM InternalOrdersSKUs";
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            else {
                resolve(rows);
            }
        });
    });
}

function getIO() {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM InternalOrders";
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            else {
                resolve(rows);
            }
        });
    });
}


module.exports = {getSKUsIO, getIO, insertIO, insertIOS, updateIntOrder, deleteIntOrder, getCompleted, getNotCompleted, getProductsCompleted, getProductsNotCompleted, getIssued, getAccepted, deleteDatas }
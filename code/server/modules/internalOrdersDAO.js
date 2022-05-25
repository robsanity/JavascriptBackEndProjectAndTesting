'use strict'

const db = require("../db");


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

function insertIOS(id, SKUId, qty) {
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
                else {
                    //per ogni rfid SET available=0 e collego l'item all'internal order;

                    let sql1 = "UPDATE SKUItems SET available=0, internalOrderId=? WHERE rfid=?"
                    let sql2 = "DELETE FROM InternalOrdersSKUs WHERE idSKU=? AND idInternalOrder=?"

                    for (let p of products) {
                        db.all(sql1, [id, p.RFID], (err, rows) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                            else {
                                //elimino da internalorderskus
                                db.all(sql2, [p.SkuID, id], (err, rows) => {
                                    if (err) {
                                        reject(err);
                                        return;
                                    }
                                })

                            }
                        })

                    }
                    resolve(true);

                }
            });

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
            else {
                sql = "DELETE FROM InternalOrders WHERE idInternalOrder=?";
                db.all(sql, [id], (err, rows) => {
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


module.exports = { getSKUsIO, getIO, insertIO, insertIOS, updateIntOrder, deleteIntOrder, getCompleted, getNotCompleted, getProductsCompleted, getProductsNotCompleted, getIssued, getAccepted, deleteDatas }
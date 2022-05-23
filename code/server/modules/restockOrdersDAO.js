'use strict'
const db = require('../db.js');

async function getRestockOrders() {

    let restockList = await getRestockList();
    let listProducts = await getProducts();
    let listSkuItems = await getSkuItems();

    let restockOrders =
        restockList.map(
            (ro) => ({
                id: ro.id,
                issueDate: ro.issueDate,
                state: ro.state,
                products:
                    listProducts
                        .filter((p) => p.id = ro.id)
                        .map(element => ({
                            SKUId: element.SKUId,
                            description: element.description,
                            price: element.price,
                            qty: element.qty
                        })),
                supplierId: nt.supplierId,
                transportNote: (ro.state != 'ISSUED' ? {} : ro.transportNote),
                skuItems: ((ro.state == 'ISSUED' || ro.state == 'DELIVERED') ? {} :
                    listSkuItems
                        .filter((si) => si.id = ro.id)
                        .map(element => ({
                            SKUId: element.SKUId,
                            rfid: element.rfid
                        }))
                )
            })
        )

    return restockOrders;

    /* }
     catch (error) {
         throw error;*/
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
        const sql = "SELECT SI.idSKU AS SKUId, TR.idSKUItem AS rfid FROM SKUItems SI, TestResults TR WHERE SI.RFID=TR.idSKUItem AND TR.result=0 AND restockOrderId=?";
        db.all(sql, [id], (err, rows) => {
            if (err) {
                reject({ error: "no restock orders to be return in database" });
                return;
            }
            resolve(rows);
        });
    });
}

function createRestockOrder(issueDate, products, supplierId) {
    return new Promise((resolve, reject) => {
        let sql = "INSERT INTO RestockOrders (issueDate, idSupplier) values (?,?)";
        let idRestockOrder = "SELECT last_insert_rowid() as lastId";


        db.all(sql, [issueDate, supplierId], (err, rows) => {
            if (err) {
                reject({ error: "no insert" });
                return;
            }
            else {
                //se inserito restock order continua
                console.log("INSERITO RESTOCK ORDER")
                db.all(idRestockOrder, [], (err, rows) => {
                    if (err) {
                        reject({ error: "no last id" });
                        return;
                    }
                    else {
                        //acquisito id Restock Order
                        idRestockOrder = rows[0].lastId;
                        console.log("ID RESTOCK ORDER" + idRestockOrder);
        
                        let idItemSQL = "SELECT last_insert_rowid() as lastId";
                        let idItem = 0;
                        let sqlI = "INSERT INTO Items (idSKU, description, price, idSupplier) values (?,?,?,?)"
                        let sqlROI = "INSERT INTO RestockOrderItems (idRestockOrder, idItem, quantity) values (?,?,?)"
                        
                        for (let p of products) {
                            db.all(sqlI, [p.SKUId, p.description, p.price, supplierId], (err, rows) => {
                                if (err) {
                                    reject({ error: "no insert" });
                                    return;
                                }
                                else {
                                    console.log("INSERITO ITEM" + p.SKUId)
                                    //se inserito in Items
                                    db.all(idItemSQL, [], (err, rows) => {
                                        if (err) {
                                            reject({ error: "no last id" });
                                            return;
                                        }
                                        else {
                                            //acquisito idItem
                                            idItem = rows[0].lastId;
                                            console.log("ID ITEM" + idItem);
                                            db.all(sqlROI, [idRestockOrder, idItem, p.qty], (err, rows) => {
                                                if (err) {
                                                    reject({ error: "no insert" });
                                                    return;
                                                }
                                                else {
                                                    console.log("INSERITO IN RO ITEMS" + idRestockOrder+idItem)
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    }
                }); 

            }
        });
        resolve(true);
    });

}



function putStateRestockOrder(id, newState) {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE RestockOrders SET state=? WHERE idRestockOrder=?";
        db.all(sql, [newState, id], (err, rows) => {
            if (err) {
                reject({ error: "no update" });

            }
            resolve(true);
        });
    });
}

function putSkuItemsOfRestockOrder(id, skuItems) {
    return new Promise((resolve, reject) => {
        let sql = "UPDATE SKUItems SET available=1, restockOrderId=? WHERE RFID=? AND idSKU=?";

        skuItems.forEach((si) => {

            db.all(sql, [id, si.rfid, si.SKUId], (err, rows) => {
                if (err) {
                    reject({ error: "no update" });

                }
            });

        })

        resolve(true);

    });
}

function putTNRestockOrder(id, TN) {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE RestockOrders SET transportNote=? WHERE idRestockOrder=?";
        db.all(sql, [TN, id], (err, rows) => {
            if (err) {
                reject({ error: "no update" });

            }
            resolve(true);
        });
    });
}



function deleteRestockOrder(id) {
    return new Promise((resolve, reject) => {
        let sql = "DELETE FROM RestockOrderItems WHERE idRestockOrder=?";
        db.all(sql, [id], (err, rows) => {
            if (err) {
                reject({ error: "no delete" });
                return;
            }
        });

        sql = "DELETE FROM RestockOrders WHERE idRestockOrder=?";
        db.all(sql, [id], (err, rows) => {
            if (err) {
                reject({ error: "no delete" });
                return;
            }
        });

        resolve(true);
    });
}


function getRestockList() {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM restockOrders";
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject({ error: "no restock orders without state ISSUED in database" });
                return;
            }
            const restockOrders = rows.map((t) => ({
                id: t.id, issueDate: t.issueDate, state: t.state,
                supplierId: t.supplierId
            }));

            resolve(restockOrders);
        });
    });
}

function getProducts() {
    return new Promise((resolve, reject) => {
        const sql = "SELECT ROI.idRestockOrder AS id, I.idSKU AS SKUId, I.description AS description, I.price AS price, ROI.quantity AS qty FROM RestockOrderItems ROI, Items I WHERE ROI.idItem=I.idItems"
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject({ error: "error in1 " });
                return;
            }
            resolve(rows);
        });
    });
}

function getSkuItems() {
    return new Promise((resolve, reject) => {
        const sql = "SELECT restockOrderId AS id, idSKU AS SKUId, RFID AS rfid FROM SKUItems WHERE restockOrderId!= NULL"
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject({ error: "error in database" });
                return;
            }
            resolve(rows);
        });
    });
}

function deleteDatas() {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM RestockOrders";
        db.run(sql, [], function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve(this.lastID);
            }
        })
    })
}
function initialize() {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO Users (idUser,name,surname,email,type) VALUES (1,'Giuseppe','Regina','gr@a.it','clerk'); INSERT INTO SKUs (idSKU,description,weight,volume,notes,availableQuantity,price) values (1,'ciao',12,13,'ciaao',10,12); INSERT INTO Items (idItems,idSKU,description,price,idSupplier) VALUES (1,1,'CIAO',77,1); INSERT INTO RestockOrders(idRestockOrder,issueDate,state,idSupplier,transportNote) VALUES (1,'2022-10-10','DELIVERED',1,'ciao'); INSERT INTO RestockOrderItems (idRestockOrder,idItem,quantity) VALUES (1,1,10);"
        db.run(sql, [], function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve(this.lastID);
            }
        });
    });
}




module.exports = { getRestockOrders, getByIdRestockOrders, getToBeReturnRestockOrders, createRestockOrder, putStateRestockOrder, putTNRestockOrder, putSkuItemsOfRestockOrder, deleteRestockOrder, getRestockList, getProducts, getSkuItems, deleteDatas, initialize };
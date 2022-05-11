class restockOrdersDAO {
    listRestockOrders() {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM restockOrders";            
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject({ error: "no restock orders in database" });
                    return;
                }
                const restockOrders = rows.map((t) => ({ id: t.id, issueDate: t.issueDate, state: t.state, 
                    products: t.products, supplierId: t.supplierId, transportNote: t.transportNote, skuItems: t.skuItems }));
                    //valutare come fare array di products e skuitems
                resolve(restockOrders);
            });
        });
    }

    listRestockOrdersISSUED() {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM restockOrders WHERE state='ISSUED'";            
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject({ error: "no restock orders with state ISSUED in database" });
                    return;
                }
                const restockOrdersISSUED = rows.map((t) => ({ id: t.id, issueDate: t.issueDate, state: t.state, 
                    products: t.products, supplierId: t.supplierId, skuItems: t.skuItems }));
                    //valutare come fare array di products e skuitems(che deve essere vuoto)
                resolve(restockOrdersISSUED);
            });
        });
    }

    listRestockOrdersById(id) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM restockOrders WHERE id=?";            
            db.all(sql, [id], (err, rows) => {
                if (err) {
                    reject({ error: "no restock orders with the given id in database" });
                    return;
                }
                const restockOrdersById = rows.map((t) => ({ id: t.id, issueDate: t.issueDate, state: t.state, 
                    products: t.products, supplierId: t.supplierId, transportNote: t.transportNote, skuItems: t.skuItems }));
                    //valutare come fare array di products e skuitems
                resolve(restockOrdersById);
            });
        });
    }
    
    listRestockOrdersToBeReturn(id) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM restockOrders WHERE id=?";           //completare la query          
            db.all(sql, [id], (err, rows) => {
                if (err) {
                    reject({ error: "no restock orders with the given id in database" });
                    return;
                }
                const RestockOrdersToBeReturn = rows.map((t) => ({ SKUId: t.SKUId, rfid:t.rfid}));
                resolve(RestockOrdersToBeReturn);
            });
        });
    }
}

module.exports = restockOrdersDAO;
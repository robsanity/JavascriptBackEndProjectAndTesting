'use strict';

class testDescriptorsDAO {
    getTestDescriptors() {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM testDescriptors";
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject({ error: "Database error during the retrieval of the testDescriptors" });
                    return;
                }
                const testDescriptors = rows.map((t) => ({ id: t.id, name: t.name, procedureDescription: t.procedureDescription, idSKU: t.idSKU }));
                resolve(testDescriptors);
            });
        });
    };

    getByIdTestDescriptors(idToReturn) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM testDescriptors WHERE id=?";
            db.all(sql, [idToReturn], (err, rows) => {
                if (err) {
                    reject({ error: "no test descriptor associated id" });
                    return;
                }
                const testDescriptors = rows.map((t) => ({ id: t.id, name: t.name, procedureDescription: t.procedureDescription, idSKU: t.idSKU }));
                resolve(testDescriptors);
            });
        });
    };

    insertTestDescriptor(name, procedureDescription, idSKU) {

    }
}

module.exports = testDescriptorsDAO;
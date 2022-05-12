'use strict';


function getTestDescriptors() {
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

function getByIdTestDescriptors(idToReturn) {
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

function insertTestDescriptor(name, procedureDescription, idSKU) {

}

function updateTestDescriptor(id, newName, newProcedureDescription, newIdSKU) {

}

function deleteTestDescriptor(id) {

}


module.exports = { getTestDescriptors, getByIdTestDescriptors, insertTestDescriptor, updateTestDescriptor, deleteTestDescriptor };
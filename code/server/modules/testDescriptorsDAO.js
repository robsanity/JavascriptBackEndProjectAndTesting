'use strict';
const db = require('../db.js');

function getTestDescriptors() {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM TestDescriptors";
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject({ error: "Database error during the retrieval of the testDescriptors" });
                
            }
            const testDescriptors = rows.map((t) => ({ id: t.idDescriptor, name: t.name, procedureDescription: t.procedureDescription, idSKU: t.idSKU }));
            resolve(testDescriptors);
        });
    });
};

function getByIdTestDescriptors(idToReturn) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM TestDescriptors WHERE idDescriptor=?";
        db.all(sql, [idToReturn], (err, rows) => {
            if (err) {
                reject({ error: "no test descriptor associated id" });
                
            }
            const testDescriptors = rows.map((t) => ({ id: t.idDescriptor, name: t.name, procedureDescription: t.procedureDescription, idSKU: t.idSKU }));
            resolve(testDescriptors);
        });
    });
};

function insertTestDescriptor(name, procedureDescription, idSKU) {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO TestDescriptors (name, procedureDescription, idSKU) values (?,?,?)";
        db.run(sql, [name, procedureDescription, idSKU], function(err)  {
            if (err) {
                reject({ error: "no insert" });
                
            }
            resolve(true);
        });
    });
}

function updateTestDescriptor(id, newName, newProcedureDescription, newIdSKU) {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE TestDescriptors SET name=?, procedureDescription=?, idSKU=? WHERE idDescriptor=?";
        db.run(sql, [newName, newProcedureDescription, newIdSKU, id], function(err)  {
            if (err) {
                reject({ error: "no update" });
                
            }
            resolve(true);
        });
    });
}

function deleteTestDescriptor(id) {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM TestDescriptors WHERE idDescriptor=?";
        db.run(sql, [id], function(err) {
            if (err) {
                reject({ error: "no delete" });
                
            }
            resolve(true);
        });
    });
}

function deleteALLTestDescriptor() {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM TestDescriptors";
        db.run(sql, [], function(err)  {
            if (err) {
                reject({ error: "no delete" });
                
            }
            resolve(true);
        });
    });
}

function updateID (idDescriptor1,idDescriptor2){
    return new Promise((resolve, reject) => {
        const sql = "UPDATE TestDescriptors SET idDescriptor=? WHERE idDescriptor=?";
        db.run(sql, [idDescriptor1,idDescriptor2],function(err) {
            if (err) {
                reject({ error: "no update" });
                
            }
                resolve(true);
        });
    });
}


module.exports = { getTestDescriptors, getByIdTestDescriptors, insertTestDescriptor, updateTestDescriptor, deleteTestDescriptor, deleteALLTestDescriptor,updateID };
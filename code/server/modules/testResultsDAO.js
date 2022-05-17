'use strict';
const db = require('../db.js');

function getTestResults(rfid) {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM testResults WHERE idSKUITEM=?";
        db.all(sql, [rfid], (err, rows) => {
            if (err) {
                reject({ error: "no test results associated to sku item" });
                
            }
            const testResults = rows.map((t) => ({ id: t.idResults, idTestDescriptor: t.idTestDescriptor, date: t.date, result: t.result }));
            resolve(testResults);
        });
    });
}

function getByIdTestResults(rfid, id) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM testResults WHERE idResults=? AND idSKUItem=?";
        db.all(sql, [id, rfid], (err, rows) => {
            if (err) {
                reject({ error: "no test result associated to id or no sku item associated to rfid rfid" });
                
            }
            const testResults = rows.map((t) => ({ id: t.idResults, idTestDescriptor: t.idTestDescriptor, date: t.date, result: t.result }));
            resolve(testResults);
        });
    });
}

function checkId(id) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM testResults WHERE idResults=?";
        db.all(sql, [id], (err, rows) => {
            if (err) {
                reject({ error: "no test result associated to id" });
                
            }
            const testResults = rows.map((t) => ({ id: t.idResult }));
            resolve(testResults);
        });
    });
}

function insertTestResult(rfid, idTestDescriptor, date, result) {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO TestResults (idTestDescriptor, date, result, idSKUItem) values (?,?,?,?)";
        db.all(sql, [idTestDescriptor, date, result, rfid], (err, rows) => {
            if (err) {
                reject({ error: "no insert" });
                
            }
            resolve(true);
        });
    });
}

function updateTestResults(id, rfid, newIdTestDescriptor, newDate, newResult) {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE TestResults SET idTestDescriptor=?, date=?, result=? WHERE idResults=? AND idSKUItem=?";
        db.all(sql, [newIdTestDescriptor, newDate, newResult, id, rfid], (err, rows) => {
            if (err) {
                reject({ error: "no update" });
                
            }
            resolve(true);
        });
    });
}

function deleteTestResult(rfid, id) {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM TestResults WHERE idResults=? AND idSKUItem=?";
        db.all(sql, [id, rfid], (err, rows) => {
            if (err) {
                reject({ error: "no delete" });
                
            }
            resolve(true);
        });
    });
}


module.exports = { getTestResults, getByIdTestResults, checkId, insertTestResult, updateTestResults, deleteTestResult };
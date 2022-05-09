'use strict';

class testResultsDAO {
    listTestResults(rfid) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM testResults WHERE idSKUITEM=?";          
            db.all(sql, [rfid], (err, rows) => {
                if (err) {
                    reject({ error: "no sku item associated to rfid" });
                    return;
                }
                const testResults = rows.map((t) => ({ id: t.id, idTestDescriptor: t.idTestDescriptor, date: t.date, result: t.result }));
                resolve(testResults);
            });
        });
    }

    listTestResultsById(rfid, id) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM testResults WHERE idTestDescriptor=? AND idSKUItem=?";           
            db.all(sql, [id, rfid], (err, rows) => {
                if (err) {
                    reject({ error: "no test result associated to id or no sku item associated to rfid rfid" });
                    return;
                }
                const testResults = rows.map((t) => ({ id: t.id, idTestDescriptor: t.idTestDescriptor, date: t.date, result: t.result }));
                resolve(testResults);
            });
        });
    }
}

module.exports = testResultsDAO;
'use strict';

class testResultsDAO {
    getTestResults(rfid) {
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

    getByIdTestResultsById(rfid, id) {
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

    //controlla se c'è almeno un rfid nella table testresults
    checkRfid(rfid) {

    }
}

module.exports = testResultsDAO;
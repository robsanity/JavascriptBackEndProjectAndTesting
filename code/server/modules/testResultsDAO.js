'use strict';

class testResultsDAO {
    listTestResults(rfid) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM testResults";            //completare query con rfid
            db.all(sql, [], (err, rows) => {
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
            const sql = "SELECT * FROM testResults";            //completare query con rfid e id
            db.all(sql, [], (err, rows) => {
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
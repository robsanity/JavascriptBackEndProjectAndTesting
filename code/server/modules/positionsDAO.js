'use strict';
const sqlite = require('sqlite3');
const db = new sqlite.Database('database.db', (err) => {
    if (err) throw err;
  });
function listPositions() {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Positions";
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject({ error: "no positions in database" });
                return;
            }
            const positions = rows.map((t) => ({ positionID: t.idPosition, aisleID: t.aisleId, row: t.row, col: t.col, maxWeight: t.maxWeight, maxVolume: t.maxVolume, occupiedWeight: t.occupiedWeight, occupiedVolume: t.occupiedVolume }));
            resolve(positions);
        });
    });
};

function checkPosition(positionId) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Positions WHERE idPosition=?";
        db.all(sql, [positionId], (err, rows) => {
            if (err) {
                reject({ error: "no position in database" });
                return;
            }
            const positions = rows.map((t) => ({ positionID: t.idPosition, aisleID: t.aisleId, row: t.row, col: t.col, maxWeight: t.maxWeight, maxVolume: t.maxVolume, occupiedWeight: t.occupiedWeight, occupiedVolume: t.occupiedVolume }));
            resolve(positions);
        });
    });
}

function createPositions(positionID, aisleID, row, col, maxWeight, maxVolume) {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO Positions (idPosition, aisleId, row, col, maxWeight, maxVolume) values (?,?,?,?,?,?)";
        db.all(sql, [positionID, aisleID, row, col, maxWeight, maxVolume], (err, rows) => {
            if (err) {
                reject({ error: "no insert" });

            }
            resolve(positionID);
        });
    });
};


function modifyPosition(positionID, newPositionID, newAisleID, newRow, newCol, newMaxWeight, newMaxVolume, newOccupiedWeight, newOccupiedVolume) {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE Positions SET idPosition=?, aisleId=?, row=?, col=?, maxWeight=?, maxVolume=?, occupiedWeight=?, occupiedVolume=? WHERE idPosition=?";
        db.all(sql, [newPositionID, newAisleID, newRow, newCol, newMaxWeight, newMaxVolume, newOccupiedWeight, newOccupiedVolume, positionID], (err, rows) => {
            if (err) {
                reject(err);

            }
            resolve(true);
        });
    });
};

function modifyPositionID(newPositionID,positionID,newAisleID, newRow, newCol) {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE Positions SET idPosition = ?, aisleId=?, row=?, col=? WHERE idPosition = ?";
        db.run(sql, [newPositionID, newAisleID, newRow, newCol, positionID], function(err){
            if (err) {
                reject(err);

            }
            resolve(true);
        });
    });
};

function deletePosition(positionID) {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM PositionS WHERE idPosition=?";
        db.all(sql, [positionID], (err, rows) => {
            if (err) {
                reject({ error: "no delete" });

            }
            resolve(true);
        });
    });
};

function deleteALLPosition() {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM PositionS";
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);

            }
            resolve(true);
        });
    });
};

module.exports = { listPositions, checkPosition, createPositions, modifyPosition, modifyPositionID, deletePosition, deleteALLPosition }
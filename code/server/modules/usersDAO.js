'use strict'
const db = require('../db.js');

function getSuppliers() {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Users WHERE type='supplier'";
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject({ error: "no suppliers in database" });
                return;
            }
            const suppliers = rows.map((t) => ({ id: t.idUser, name: t.name, surname: t.surname, email: t.email }));
            resolve(suppliers);
        });
    });
}

function getUsers() {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Users WHERE type!='manager'";
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject({ error: "no users in database" });
                return;
            }
            const users = rows.map((t) => ({ id: t.idUser, name: t.name, surname: t.surname, email: t.email, type: t.type }));
            resolve(users);
        });
    });
}

//cerca user con username e type
function checkUser(username, type) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Users WHERE email=? AND type=?";
        db.all(sql, [username, type], (err, rows) => {
            if (err) {
                reject({ error: "no users in database" });
                return;
            }
            const users = rows.map((t) => ({ id: t.idUser, name: t.name, surname: t.surname, email: t.email, type: t.type }));
            resolve(users);
        });
    });
}

function findUser(id) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Users WHERE idUser=?";
        db.all(sql, [id], (err, rows) => {
            if (err) {
                reject({ error: "no users in database" });
                return;
            }
            resolve(true);
        });
    });
}

function insertUser(username, name, surname, type) {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO Users (name, surname, email, type) values (?,?,?,?)";
        db.all(sql, [name, surname, username, type], (err, rows) => {
            if (err) {
                reject({ error: "no insert" });

            }
            resolve(true);
        });
    });
}

function login(username, password, type){
    const sql = "SELECT * FROM Users WHERE type=? AND email=? AND password=?";
    return new Promise((resolve, reject) => {
        db.all(sql, [type, username, password], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(
                    rows.map((u) => ({id: u.idUser, name: u.name, surname: u.surname, email: u.email, type: u.type}))
                )
            }
        })
    });
}

function updateUser(username, oldType, newType) {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE Users SET type=? WHERE email=? AND type=?";
        db.all(sql, [newType, username, oldType], (err, rows) => {
            if (err) {
                reject({ error: "no update" });

            }
            resolve(true);
        });
    });
}

function deleteUser(username, type) {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM Users WHERE email=? AND type=?";
        db.all(sql, [username, type], (err, rows) => {
            if (err) {
                reject({ error: "no delete" });

            }
            resolve(true);
        });
    });
}

function deleteALLUser() {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM Users";
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject({ error: "no delete" });

            }
            resolve(true);
        });
    });
}

module.exports = { getSuppliers, getUsers, checkUser, findUser, insertUser, updateUser, deleteUser, deleteALLUser };
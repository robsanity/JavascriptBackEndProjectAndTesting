'use strict'

class usersDAO {
    userInfo() {

    }

    listSuppliers() {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM users WHERE type='supplier'";
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject({ error: "no suppliers in database" });
                    return;
                }
                const suppliers = rows.map((t) => ({ id: t.id, name: t.name, surname: t.surname, email: t.email }));
                resolve(suppliers);
            });
        });
    }

    listUsers() {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM users";            
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject({ error: "no users in database" });
                    return;
                }
                const users = rows.map((t) => ({ id: t.id, name: t.name, surname: t.surname, email: t.email, type: t.type }));
                resolve(users);
            });
        });
    }

    //cerca user con username e type
    checkUser(username, type) {

    }

    insertUser(username, name, surname, type) {

    }

    updateUser(username, oltType, newType) {

    }

    deleteUser(username, type) {
        
    }
}

module.exports = usersDAO;
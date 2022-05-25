const usersDAO = require('../modules/usersDAO');


describe("Test user", () => {
    beforeAll( async () => {
        await usersDAO.deleteALLUsers();
    })

    beforeEach(async () => {
        await usersDAO.deleteALLUsers();
    })

    test("Database start", async () => {
        let res = await usersDAO.getUsers();
        expect(res.length).toStrictEqual(0);
        res = await usersDAO.getSuppliers();
        expect(res.length).toStrictEqual(0);
    })

    testLogin("a.b@gmail.com", "A", "B", "clerk", "password")
    testGetUsers();
    testCheckUser("name.surname@ezwh.com", "name", "surname", "clerk", "password");
    testInsertUsers("a.b@gmail.com", "A", "B", "clerk", "password");
    testUpdateUser("name.surname@ezwh.com", "name", "surname", "clerk", "supplier", "password")
    testDeleteUser("name.surname@ezwh.com", "supplier");
})

function testLogin(username, name, surname, type, pass){
    test("login", async () => {
        let res = await usersDAO.getUsers();
        expect(res.length).toStrictEqual(0);

        let newUser = await usersDAO.insertUser(
            username, 
            name, 
            surname, 
            type,
            pass
        );
        expect(newUser).toStrictEqual(true);
        res = await usersDAO.getUsers();
        expect(res.length).toStrictEqual(1);

        res = await usersDAO.login(username, pass, type);
        expect(res.length).toStrictEqual(1);

        expect(res[0].username).toStrictEqual(username);
        expect(res[0].name).toStrictEqual(name);

    })
}

function testGetUsers() {
    test("getUsers and getSuppliers", async () => {
        let res = await usersDAO.getUsers();
        expect(res.length).toStrictEqual(0);

        let newUser = await usersDAO.insertUser(
            "a.b@gmail.com",
            "A",
            "B",
            "clerk",
            "password"
        );
        expect(newUser).toStrictEqual(true);
        res = await usersDAO.getUsers();
        expect(res.length).toStrictEqual(1);
        res = await usersDAO.getSuppliers();
        expect(res.length).toStrictEqual(0);

        newUser = await usersDAO.insertUser(
            "c.d@gmail.com",
            "C",
            "D",
            "supplier",
            "password"
        );
        expect(newUser).toStrictEqual(true);
        res = await usersDAO.getUsers();
        expect(res.length).toStrictEqual(2);
        res = await usersDAO.getSuppliers();
        expect(res.length).toStrictEqual(1);
    })
}

function testCheckUser(username, name, surname, type, pass) {
    test("findUser and checkUser", async () => {
        let res = await usersDAO.getUsers();
        expect(res.length).toStrictEqual(0);

        let newUser = await usersDAO.insertUser(
            username,
            name,
            surname,
            type,
            pass
        );
        expect(newUser).toStrictEqual(true);
        res = await usersDAO.getUsers();
        expect(res.length).toStrictEqual(1);

        let findUser = await usersDAO.findUser(username);
        expect(findUser).toStrictEqual(true);
        let checkUser = await usersDAO.checkUser(username, type);
        expect(checkUser.length).toStrictEqual(1);

        expect(checkUser[0].email).toStrictEqual(username);
        expect(checkUser[0].name).toStrictEqual(name);
        expect(checkUser[0].surname).toStrictEqual(surname);
        expect(checkUser[0].type).toStrictEqual(type);
    })
}

function testInsertUsers(username, name, surname, type, pass) {
    test("insertUser", async () => {
        let res = await usersDAO.getUsers();
        expect(res.length).toStrictEqual(0);

        let newUser = await usersDAO.insertUser(
            username, 
            name, 
            surname, 
            type,
            pass
        );
        expect(newUser).toStrictEqual(true);
        res = await usersDAO.getUsers();
        expect(res.length).toStrictEqual(1);

        expect(res[0].email).toStrictEqual(username);
        expect(res[0].name).toStrictEqual(name);
        expect(res[0].surname).toStrictEqual(surname);
        expect(res[0].type).toStrictEqual(type);
    })
}

function testUpdateUser(username, name, surname, oldType, newType, pass) {
    test("updateUser", async () => {
        let res = await usersDAO.getUsers();
        expect(res.length).toStrictEqual(0);

        let newUser = await usersDAO.insertUser(
            username,
            name,
            surname,
            oldType,
            pass
        );
        expect(newUser).toStrictEqual(true);
        res = await usersDAO.getUsers();
        expect(res.length).toStrictEqual(1);

        res = await usersDAO.updateUser(username, oldType, newType);
        expect(res).toStrictEqual(true);

        let checkUser = await usersDAO.checkUser(username, oldType);
        expect(checkUser.length).toStrictEqual(0);

        checkUser = await usersDAO.checkUser(username, newType);
        expect(checkUser.length).toStrictEqual(1);

        expect(checkUser[0].email).toStrictEqual(username);
        expect(checkUser[0].name).toStrictEqual(name);
        expect(checkUser[0].surname).toStrictEqual(surname);
        expect(checkUser[0].type).toStrictEqual(newType);
    })
}

function testDeleteUser(username, type) {
    test("deleteUser", async () => {
        let res = await usersDAO.getUsers();
        expect(res.length).toStrictEqual(0);

        let newUser = await usersDAO.insertUser(
            username,
            "name",
            "surname",
            type
        );
        expect(newUser).toStrictEqual(true);
        res = await usersDAO.getUsers();
        expect(res.length).toStrictEqual(1);

        res = await usersDAO.deleteUser(username, type);
        expect(res).toStrictEqual(true);

        res = await usersDAO.getUsers();
        expect(res.length).toStrictEqual(0);
    })
}
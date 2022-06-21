const chai = require('chai');
const chaiHttp = require('chai-http');
const restockOrdersDAO = require('../modules/restockOrdersDAO');
const itemsDAO = require('../modules/itemsDAO');
const SKUItemsDAO = require('../modules/SKUItemsDAO');
const usersDAO = require('../modules/usersDAO');
const SKUsDAO = require('../modules/SKUsDAO');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test restock order', () => {
    beforeEach(async () => {
        await restockOrdersDAO.deleteDatas();
        await itemsDAO.deleteALLItems();
        await SKUItemsDAO.deleteALLSKUItems();
        await usersDAO.deleteALLUsers();
        await SKUsDAO.deleteDatas();
        usersDAO.insertUser("username", "name", "surname", "supplier", "testpassword");
        let u = await usersDAO.getUsers()
        await SKUsDAO.createSKUWithOnlyId(12);
        await SKUsDAO.createSKUWithOnlyId(180);
        await itemsDAO.createItem("product", 10, 12, u[0].id, 10);
        await itemsDAO.createItem("product", 18, 180, u[0].id, 11);
    })

    getRestock();
    getRestockIssued();
    postRestockOrder();
    putRestockOrder();
    deleteRestockOrder();


})

function getRestock() {
    it('get restock order', function (done) {
        //usersDAO.insertUser("username", "name", "surname", "supplier", "testpassword");

        //  .then(function (res) {
        usersDAO.getUsers()
            .then(function (res) {
                let idSupplier = res[0].id;
                let body = {
                    issueDate: "2021/11/29 09:33",
                    products: [{ "SKUId": 12, "itemId": 10, "description": "a product", "price": 10, "qty": 30 },
                    { "SKUId": 180, "itemId": 18, "description": "another product", "price": 11, "qty": 20 }],
                    supplierId: idSupplier
                }
                agent.post('/api/restockOrder')
                    .send(body)
                    .then(function (res) {
                        res.should.have.status(201);
                        agent.get('/api/restockOrders')
                            .then(function (res) {
                                res.should.have.status(200);
                                done();
                            }).catch(done)

                    }).catch(done)
            }).catch(done);
    }
    )
}


function getRestockIssued() {
    it('get restock order issued', function (done) {
        //usersDAO.insertUser("username", "name", "surname", "supplier", "testpassword")
        //  .then(function (res) {
        usersDAO.getUsers()
            .then(function (res) {
                let idSupplier = res[0].id;
                let body = {
                    "issueDate": "2021/11/29 09:33",
                    "products": [{ "SKUId": 12, "itemId": 10, "description": "a product", "price": 10.99, "qty": 30 },
                    { "SKUId": 180, "itemId": 18, "description": "another product", "price": 11.99, "qty": 20 }],
                    "supplierId": idSupplier
                }
                agent.post('/api/restockOrder')
                    .send(body)
                    .then(function (res) {
                        res.should.have.status(201);
                        agent.get('/api/restockOrdersIssued')
                            .then(function (res) {
                                res.should.have.status(200);
                                done();
                            }).catch(done)

                    }).catch(done)
            }).catch(done)

    })
}

function postRestockOrder() {
    it('post restock order ', function (done) {
        //usersDAO.insertUser("username", "name", "surname", "supplier", "testpassword")
        //  .then(function (res) {
        usersDAO.getUsers()
            .then(function (res) {
                let idSupplier = res[0].id;
                let body = {
                    "issueDate": "2021/11/29 09:33",
                    "products": [{ "SKUId": 12, "itemId": 10, "description": "a product", "price": 10.99, "qty": 30 },
                    { "SKUId": 180, "itemId": 18, "description": "another product", "price": 11.99, "qty": 20 }],
                    "supplierId": idSupplier
                }
                agent.post('/api/restockOrder')
                    .send(body)
                    .then(function (res) {
                        res.should.have.status(201);
                        done();
                    }).catch(done)
            }).catch(done)

    })
}

function putRestockOrder() {
    it('put restock order ', function (done) {
        // usersDAO.insertUser("username", "name", "surname", "supplier", "testpassword")
        //   .then(function (res) {
        usersDAO.getUsers()
            .then(function (res) {
                let idSupplier = res[0].id;
                let body = {
                    "issueDate": "2021/11/29 09:33",
                    "products": [{ "SKUId": 12, "itemId": 10, "description": "a product", "price": 10.99, "qty": 30 },
                    { "SKUId": 180, "itemId": 18, "description": "another product", "price": 11.99, "qty": 20 }],
                    "supplierId": idSupplier
                }
                agent.post('/api/restockOrder')
                    .send(body)
                    .then(function (res) {
                        res.should.have.status(201);
                        agent.get('/api/restockOrders')
                            .then(function (res) {
                                res.should.have.status(200);
                                let idRO = res.body[0].id;
                                let body = {
                                    "newState": "DELIVERED"
                                }
                                agent.put('/api/restockOrder/' + idRO)
                                    .send(body)
                                    .then(function (res) {
                                        res.should.have.status(200)
                                        done();
                                    }).catch(done)
                            }).catch(done)
                    }).catch(done)
            }).catch(done)

    })
}

function deleteRestockOrder() {
    it('delete restock order ', function (done) {
        // usersDAO.insertUser("username", "name", "surname", "supplier", "testpassword")
        //   .then(function (res) {
        usersDAO.getUsers()
            .then(function (res) {
                let idSupplier = res[0].id;
                let body = {
                    "issueDate": "2021/11/29 09:33",
                    "products": [{ "SKUId": 12, "itemId": 10, "description": "a product", "price": 10.99, "qty": 30 },
                    { "SKUId": 180, "itemId": 18, "description": "another product", "price": 11.99, "qty": 20 }],
                    "supplierId": idSupplier
                }
                agent.post('/api/restockOrder')
                    .send(body)
                    .then(function (res) {
                        res.should.have.status(201);
                        agent.get('/api/restockOrders')
                            .then(function (res) {
                                res.should.have.status(200);
                                let idRO = res.body[0].id;
                                let body = {
                                    "newState": "DELIVERED"
                                }
                                agent.delete('/api/restockOrder/' + idRO)
                                    .then(function (res) {
                                        res.should.have.status(204)
                                        done();
                                    }).catch(done)
                            }).catch(done)
                    }).catch(done)
            }).catch(done)
    })
}
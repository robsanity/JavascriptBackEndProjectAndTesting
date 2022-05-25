const chai = require('chai');
const chaiHttp = require('chai-http');
const restockOrdersDAO = require('../modules/restockOrdersDAO');
const itemsDAO = require('../modules/itemsDAO');
const SKUItemsDAO = require('../modules/SKUItemsDAO');
const usersDAO = require('../modules/usersDAO');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test get restock order', () => {
    beforeEach(async () => {
        await restockOrdersDAO.deleteDatas();
        await itemsDAO.deleteALLItems();
        await SKUItemsDAO.deleteALLSKUItems();
        await usersDAO.deleteALLUsers();
    })

    getRestock();
    getRestockIssued();


})

function getRestock() {
    it('get restock order', function (done) {
        usersDAO.insertUser("username", "name", "surname", "supplier", "testpassword")
            .then(function (res) {
                usersDAO.getUsers()
                    .then(function (res) {
                        let idSupplier = res[0].id;
                        let body = {
                            "issueDate": "2021/11/29 09:33",
                            "products": [
                                { "SKUId": 12, "description": "a product", "price": 10.99, "qty": 3 },
                                { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 3 }
                            ],
                            "customerId": idSupplier
                        }
                        agent.post('/api/internalOrders')
                            .send(body)
                            .then(function (res) {
                                res.should.have.status(201);
                                agent.get('/api/internalOrders')
                                    .then(function (res) {
                                        res.should.have.status(200);
                                        done();
                                    }).catch(done)

                            }).catch(done)
                    }).catch(done)
            }).catch(done)
    })
}

function getRestockIssued() {
    it('get restock order issued', function (done) {
        usersDAO.insertUser("username", "name", "surname", "supplier", "testpassword")
            .then(function (res) {
                usersDAO.getUsers()
                    .then(function (res) {
                        let idSupplier = res[0].id;
                        let body = {
                            "issueDate": "2021/11/29 09:33",
                            "products": [
                                { "SKUId": 12, "description": "a product", "price": 10.99, "qty": 3 },
                                { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 3 }
                            ],
                            "customerId": idSupplier
                        }
                        agent.post('/api/internalOrders')
                            .send(body)
                            .then(function (res) {
                                res.should.have.status(201);
                                agent.get('/api/internalOrdersIssued')
                                    .then(function (res) {
                                        res.should.have.status(200);
                                        done();
                                    }).catch(done)

                            }).catch(done)
                    }).catch(done)
            }).catch(done)
    })
}


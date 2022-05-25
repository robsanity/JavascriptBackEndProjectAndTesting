const chai = require('chai');
const chaiHttp = require('chai-http');
const internalOrdersDAO = require('../modules/internalOrdersDAO');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('testInternalOrd', () => {
    beforeEach(async () => {
        await internalOrdersDAO.deleteDatas();
    })

    testCreateIO(201, "2021/11/29 09:33", [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 3 }, { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 3 }], 1);
    testModifyIOA(200, "2021/11/29 09:33", [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 3 }, { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 3 }], 1);
    testModifyIOC(200, "2021/11/29 09:33", [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 3 }, { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 3 }], 1);
    testGetIO(201, 200, "2021/11/29 09:33", [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 3 }, { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 3 }], 194)
    deleteIO("2021/11/29 09:33", 194);
});

function testGetIO(expectedHTTPStatus1, expectedHTTPStatus, issueDate, products, customerId) {
    it('Get the Internal Orders', function (done) {
        let IO = {
            issueDate: issueDate,
            customerId: customerId,
            products: products
        }
        agent.post('/api/internalOrders')
            .send(IO)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus1);
                agent.get('/api/internalOrders')
                    .then(function (r) {
                        r.should.have.status(expectedHTTPStatus);
                        done();
                    }).catch(done);
            }).catch(done);
    })
}


function testCreateIO(expectedHTTPStatus, issueDate, products, customerId) {
    it('create an Internal Order', function (done) {
        let IO = {
            issueDate: issueDate,
            customerId: customerId,
            products: products
        }
        agent.post('/api/internalOrders')
            .send(IO)
            .then(function (res) {
                done();
                res.should.have.status(expectedHTTPStatus)

            }).catch(done);

    })
}

function testModifyIOA(expectedHTTPStatus, issueDate, products, customerId) {
    it('Modify an Internal Order', function (done) {

        internalOrdersDAO.insertIO(issueDate, customerId)
            .then((res) => {
                for (let p of products) {
                    internalOrdersDAO.insertIOS(res, p.SKUId, p.qty);
                }
                let body = {
                    newState: "ACCEPTED"
                };
                agent.put('/api/internalOrders/' + res)
                    .send(body)
                    .then(function (r) {
                        r.should.have.status(expectedHTTPStatus);
                        done();
                    }).catch(done);
            }).catch(done);

    })
}

function testModifyIOC(expectedHTTPStatus, issueDate, products, customerId) {
    it('Modify an Internal Order', function (done) {

        internalOrdersDAO.insertIO(issueDate, customerId)
            .then((res) => {
                for (let p of products) {
                    internalOrdersDAO.insertIOS(res, p.SKUId, p.qty);
                }
                let body = {
                    newState: "COMPLETED",
                    products: [{ "SkuID": 12, "RFID": "12345678901234567890123456789016" }, { "SkuID": 180, "RFID": "12345678901234567890123456789038" }]
                };
                agent.put('/api/internalOrders/' + res)
                    .send(body)
                    .then(function (r) {
                        r.should.have.status(expectedHTTPStatus);
                        done();
                    }).catch(done);
            }).catch(done);

    })
}


function deleteIO(issueDate, customerId) {
    it("delete IO", function (done) {
        internalOrdersDAO.insertIO(issueDate, customerId)
            .then( (res) => {
                agent
                    .delete("/api/internalOrders/" + res)
                    .then(function (r) {
                        r.should.have.status(204);
                        done();
                    }).catch(done);
            }).catch(done);
    });
}
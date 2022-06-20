const chai = require('chai');
const chaiHttp = require('chai-http');
const SKUsDAO = require('../modules/SKUsDAO');
const testDescriptorsDAO = require('../modules/testDescriptorsDAO');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test test descriptors', () => {
    beforeEach(async () => {
        await testDescriptorsDAO.deleteALLTestDescriptor();
        await SKUsDAO.deleteDatas();
    })

    postTestDescriptors();
    getTestDescriptors();
    getByIdTestDescriptors();
    putTestDescriptors();
    deleteTestDescriptors();


})

function postTestDescriptors() {
    it('post test descriptors ', function (done) {
        SKUsDAO.createSKU("description", 10, 10, "notes", 30, 10.55)
            .then(function (res) {
                SKUsDAO.listSKUs()
                    .then(function (res) {
                        let idSKU = res[0].id;
                        let body = {
                            name: "test descriptor 3",
                            procedureDescription: "This test is described by...",
                            idSKU: idSKU
                        }
                        agent.post('/api/testDescriptor')
                            .send(body)
                            .then(function (res) {
                                res.should.have.status(201);
                                done();
                            }).catch(done)
                    }).catch(done)
            }).catch(done)
    })
}

function getTestDescriptors() {
    it('get test descriptors ', function (done) {
        SKUsDAO.createSKU("description", 10, 10, "notes", 30, 10.55)
            .then(function (res) {
                SKUsDAO.listSKUs()
                    .then(function (res) {
                        let idSKU = res[0].id;
                        let body = {
                            name: "test descriptor 3",
                            procedureDescription: "This test is described by...",
                            idSKU: idSKU
                        }
                        agent.post('/api/testDescriptor')
                            .send(body)
                            .then(function (res) {
                                res.should.have.status(201);
                                agent.get('/api/testDescriptors')
                                    .then(function (res) {
                                        res.should.have.status(200);
                                        done();
                                    })
                            }).catch(done)
                    }).catch(done)
            }).catch(done)
    })
}

function getByIdTestDescriptors() {
    it('get by id test descriptors ', function (done) {
        SKUsDAO.createSKU("description", 10, 10, "notes", 30, 10.55)
            .then(function (res) {
                SKUsDAO.listSKUs()
                    .then(function (res) {
                        let idSKU = res[0].id;
                        let body = {
                            name: "test descriptor 3",
                            procedureDescription: "This test is described by...",
                            idSKU: idSKU
                        }
                        agent.post('/api/testDescriptor')
                            .send(body)
                            .then(function (res) {
                                res.should.have.status(201);
                                agent.get('/api/testDescriptors')
                                    .then(function (res) {
                                        res.should.have.status(200);
                                        let idTD = res.body[0].id;
                                        agent.get('/api/testDescriptors/' + idTD)
                                            .then(function (res) {
                                                res.should.have.status(200);
                                                done();
                                            })
                                    })
                            }).catch(done)
                    }).catch(done)
            }).catch(done)
    })
}

let idSKU = 0;

function putTestDescriptors() {
    it('put test descriptors ', function (done) {
        SKUsDAO.createSKU("description", 10, 10, "notes", 30, 10.55)
            .then(function (res) {
                SKUsDAO.listSKUs()
                    .then(function (res) {
                        idSKU = res[0].id;
                        let body = {
                            name: "test descriptor 3",
                            procedureDescription: "This test is described by...",
                            idSKU: idSKU
                        }
                        agent.post('/api/testDescriptor')
                            .send(body)
                            .then(function (res) {
                                res.should.have.status(201);
                                agent.get('/api/testDescriptors')
                                    .then(function (res) {
                                        res.should.have.status(200);
                                        let idTD = res.body[0].id;
                                        let body = {
                                            newName: "test descriptor 1",
                                            newProcedureDescription: "This test is described by...",
                                            newIdSKU: idSKU
                                        }
                                        agent.put('/api/testDescriptor/' + idTD)
                                            .send(body)
                                            .then(function (res) {
                                                res.should.have.status(200);
                                                done();
                                            }).catch(done)
                                    }).catch(done)
                            }).catch(done)
                    }).catch(done)
            }).catch(done)
    })
}

function deleteTestDescriptors() {
    it('delete test descriptors ', function (done) {
        SKUsDAO.createSKU("description", 10, 10, "notes", 30, 10.55)
            .then(function (res) {
                SKUsDAO.listSKUs()
                    .then(function (res) {
                        let idSKU = res[0].id;
                        let body = {
                            name: "test descriptor 3",
                            procedureDescription: "This test is described by...",
                            idSKU: idSKU
                        }
                        agent.post('/api/testDescriptor')
                            .send(body)
                            .then(function (res) {
                                res.should.have.status(201);
                                agent.get('/api/testDescriptors')
                                    .then(function (res) {
                                        res.should.have.status(200);
                                        let idTD = res.body[0].id;
                                        agent.delete('/api/testDescriptor/' + idTD)
                                            .then(function (res) {
                                                res.should.have.status(204);
                                                done();
                                            }).catch(done)
                                    })
                            }).catch(done)
                    }).catch(done)
            }).catch(done)
    })
}

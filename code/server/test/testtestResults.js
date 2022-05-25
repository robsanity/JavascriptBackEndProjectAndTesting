const chai = require('chai');
const chaiHttp = require('chai-http');
const testResultsDAO = require('../modules/testResultsDAO');
const testDescriptorDAO = require('../modules/testDescriptorsDAO');
const skuitemsDAO = require('../modules/SKUItemsDAO');
const SKUsDAO = require('../modules/SKUsDAO');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);


describe('test', () => {
    beforeEach(async () => {
        await SKUsDAO.deleteDatas();
        await testDescriptorDAO.deleteALLTestDescriptor();
        await skuitemsDAO.deleteALLSKUItems();
        await testResultsDAO.deleteALLTestResult();

    })
    testCreateTestResult(201, 9999, "2022-11-11", false);
    testGetByRFID(201, 200, 9999);
    testGetByRFIDANDID(200, 9999);
    testModifyTestResults(200, 12, "2020-12-11", true);
    //testDelete(204,80,9999)
});


function testCreateTestResult(expectedHTTPStatus, rfid, Date, Result) {
    it('create testResult', function (done) {
        SKUsDAO.createSKU("product1", 20, 20, "good", 20, 20)
            .then((idsku) => {
                skuitemsDAO.createSKUItem(9999, idsku, "2020-12-12");
                skuitemsDAO.addRetOrdtoSKUITEM(3);
                testDescriptorDAO.insertTestDescriptor("Preliminar test", "easytest", idsku);
                testDescriptorDAO.getTestDescriptors()
                    .then((res) => {
                        let test =
                        {
                            rfid: rfid,
                            idTestDescriptor: res[0].id,
                            Date: Date,
                            Result: Result
                        };
                        agent.post('/api/skuitems/testResult')
                            .send(test)
                            .then(function (r) {
                                r.should.have.status(expectedHTTPStatus);

                                done();
                            }).catch(done);
                    })
            })
    })
}

function testGetByRFID(expectedHTTPStatus1, expectedHTTPStatus2, requestid) {
    it('get 1 testResult', function (done) {
        SKUsDAO.createSKU("product1", 20, 20, "good", 20, 20)
            .then((idsku) => {
                skuitemsDAO.createSKUItem(9999, idsku, "2020-12-12");
                skuitemsDAO.addRetOrdtoSKUITEM(3);
                testDescriptorDAO.insertTestDescriptor("Preliminar test", "easytest", idsku);
                testDescriptorDAO.getTestDescriptors()
                    .then((res) => {
                        let test =
                        {
                            rfid: requestid,
                            idTestDescriptor: res[0].id,
                            Date: "2020-12-12",
                            Result: false
                        };


                        agent.post('/api/skuitems/testResult')
                            .send(test)
                            .then(function (z) {
                                z.should.have.status(expectedHTTPStatus1);
                                agent.get('/api/skuitems/' + requestid + '/testResults')
                                    .then(function (s) {
                                        s.should.have.status(expectedHTTPStatus2);

                                        done();
                                    }).catch(done);
                            })
                    })
            })
    })
}


function testGetByRFIDANDID(expectedHTTPStatus, requestid) {
    it('get 1 testResult from 1 rfid', function (done) {
        SKUsDAO.createSKU("product1", 20, 20, "good", 20, 20)
            .then((idsku) => {
                skuitemsDAO.createSKUItem(9999, idsku, "2020-12-12");
                skuitemsDAO.addRetOrdtoSKUITEM(3);
                testDescriptorDAO.insertTestDescriptor("Preliminar test", "easytest", idsku);
                testDescriptorDAO.getTestDescriptors()
                    .then((res) => {
                        let test =
                        {
                            rfid: requestid,
                            idTestDescriptor: res[0].id,
                            Date: "2020-12-12",
                            Result: false
                        };
                        testResultsDAO.insertTestResult(test.rfid, test.idTestDescriptor, test.Date, test.Result);
                        testResultsDAO.getTestResults(9999)
                            .then(function (z) {

                                agent.get('/api/skuitems/' + requestid + '/testResults/' + z[0].id)
                                    .then(function (s){
                                        s.should.have.status(expectedHTTPStatus);

                                        done();
                                    }).catch(done);
                            })
                    })
            })
    })
}


function testModifyTestResults(expectedHTTPStatus, newIdTestDescriptor, newDate, newResult) {
    it('modify 1 test Result', function (done) {
        SKUsDAO.createSKU("product1", 20, 20, "good", 20, 20)
            .then((idsku) => {
                skuitemsDAO.createSKUItem(9999, idsku, "2020-12-12");
                skuitemsDAO.addRetOrdtoSKUITEM(3);
                testDescriptorDAO.insertTestDescriptor("Preliminar test", "easytest", idsku);
                testDescriptorDAO.getTestDescriptors()
                    .then((res) => {
                        let test =
                        {
                            rfid: 9999,
                            idTestDescriptor: res[0].id,
                            Date: "2020-12-12",
                            Result: false
                        };
                        SKUsDAO.createSKU("product1", 20, 20, "good", 20, 20)
                            .then((idsku2) => {
                                testDescriptorDAO.insertTestDescriptor("Test2", "long test", idsku2);
                                testDescriptorDAO.updateID(newIdTestDescriptor, res[0].id)
                                testResultsDAO.insertTestResult(test.rfid, test.idTestDescriptor, test.Date, test.Result);
                                testResultsDAO.getTestResults(9999)
                                    .then(function (z) {
                                        let update = {
                                            newIdTestDescriptor: newIdTestDescriptor,
                                            newDate: newDate,
                                            newResult: newResult
                                        }
                                        agent.put('/api/skuitems/' + 9999 + '/testResult/' + z[0].id)
                                            .send(update)
                                            .then(function (s) {
                                                s.should.have.status(expectedHTTPStatus);
                                                done();
                                            }).catch(done);
                                    })
                            })
                    })
            })
        })
    }

 /*    function testDelete (expectedHTTPStatus,requestid,requestrfid){
        it('delete 1 test result', function (done) {
            SKUsDAO.createSKU("product1", 20, 20, "good", 20, 20)
                .then((idsku) => {
                    skuitemsDAO.createSKUItem(9999, idsku, "2020-12-12");
                    skuitemsDAO.addRetOrdtoSKUITEM(3);
                    testDescriptorDAO.insertTestDescriptor("Preliminar test", "easytest", idsku);
                    testDescriptorDAO.getTestDescriptors()
                        .then((n) => {
                            let test =
                            {
                                rfid: requestrfid,
                                idTestDescriptor: res[0].id,
                                Date: "2020-12-12",
                                Result: false
                            }; 
                            agent.post('/api/skuitems/testResult')
                                .send(test)
                                .then(function (z) {
                                    testResultsDAO.updateIDResult(requestid,requestrfid)
                                    .then(function (k){
                                    agent.delete('/api/skuitems/' + requestrfid + '/testResult/'+requestid)
                                    .then(function (del){
                                        del.should.have.status(expectedHTTPStatus);
                                        done();
                                    }).catch(done);
                                })
                            })
                        })
                    })
                })
            } */
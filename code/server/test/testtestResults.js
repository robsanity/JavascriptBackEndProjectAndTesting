const chai = require('chai');
const chaiHttp = require('chai-http');
const testResultsDAO = require('../modules/testResultsDAO');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);


describe('test', () => {
    beforeEach(async () => {
        await testResultsDAO.deleteALLTestResult()
    })
    testCreateTestResult(201,9999,2,"2022-11-11","ACCEPTED")

});

function testCreateTestResult(expectedHTTPStatus,rfid,idTestDescriptor,Date,Result){
    it('create test', function(done){
    let test = {rfid:rfid,idTestDescriptor:idTestDescriptor,Date:Date,Result:Result};
    agent.post('/api/skuitems/testResult')
    .send(test)
    .then(function(res){
        res.should.have.status(expectedHTTPStatus);
    }).catch(done);
})
}
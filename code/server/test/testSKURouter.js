const chai = require('chai');
const chaiHttp = require('chai-http');
const { listSKUs } = require('../modules/SKUsDAO');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);
describe('get /api/skus', function () {
    it('GETsku', function (done) {
        agent.get('/api/skus')
            .then(function (res) {
                res.should.have.status(200);
                
                done();
            });
    });
});

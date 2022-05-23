const chai = require('chai');
const chaiHttp = require('chai-http');
const { listSKUs } = require('../modules/SKUsDAO');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);
describe('get /api/items', function () {
    it('GETitem', function (done) {
        agent.get('/api/items')
            .then(function (res) {
                console.log('errore è '+ res.error)
                res.should.have.status(200);
                
            
            })
            .catch(done);
    });
});

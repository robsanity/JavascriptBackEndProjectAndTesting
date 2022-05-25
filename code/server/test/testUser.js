const chai = require('chai');
const chaiHttp = require('chai-http');
const usersDAO = require('../modules/usersDAO');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);


describe('test', () => {
    beforeEach(async () => {
        await usersDAO.deleteALLUsers()
    })


    newItem(201, '12345678901234567890123456789015', 1, '2021/11/29 12:30');
    getItem(201, '12345678901234567890123456789015', 1, '2021/11/29 12:30');
    updateItem(200, '22345678901234567890123456789015', 5, '2021/11/29 15:30');
    deleteItem('12345678901234567890123456789015', 1, '2021/11/29 12:30');

});

function newItem(expectedHTTPStatus, rfid, SKUId, date) {
    it('add SKUItem', function (done) {
        let k = { RFID: rfid, SKUId: SKUId, date: date };
        agent.post('/api/skuitem')
            .send(k)
            .then(function (res) {
                done();
                res.should.have.status(expectedHTTPStatus);
                res.body.should.equal(k);
            })


    });

}

function getItem(expectedHTTPStatus, rfid, SKUId, date) {

    it('get SKUitem', function (done) {
        let k = { RFID: rfid, SKUId: SKUId, date: date };
        agent.post('/api/skuitem')
            .send(k)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                agent.get('/api/skuitems/' + rfid)
                    .then(function (res) {
                        res.should.have.status(200);
                        done();
                    }).catch(done);

            }).catch(done);
    });
}


function updateItem(expectedHTTPStatus, newrfid, newava, newdate) {
    it('update SKUItem', function (done) {
        let k = { RFID: '12345678901234567890123456789015', SKUId: 1, date: '2021/11/29 12:30' };
        agent.post('/api/skuitem')
            .send(k)
            .then(function (r) {
                r.should.have.status(201);
                const body = {
                    newRFID: newrfid,
                    newAvailable: newava,
                    newDateOfStock: newdate
                };
                agent.put('/api/skuitems/' + '12345678901234567890123456789015')
                    .send(body)
                    .then(function (r) {
                        r.should.have.status(expectedHTTPStatus);
                        done();
                    }).catch(done);

            }).catch(done);
});
}

function deleteItem(rfid, SKUId, date) {
    it("delete SKUItem", function (done) {
        let k = { RFID: rfid, SKUId: SKUId, date: date };
        agent.post('/api/skuitem')
            .send(k)
            .then(function (r) {
                r.should.have.status(201);
                agent.delete("/api/skuitems/" + rfid)
                    .send(rfid)
                    .then(function (res) {
                        res.should.have.status(204);
                        done();
                    }).catch(done);
            }).catch(done);
    });
}
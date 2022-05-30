const chai = require('chai');
const chaiHttp = require('chai-http');
const SKUsDAO = require('../modules/SKUsDAO');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);


describe('test', () => {
    beforeEach(async () => {
        await SKUsDAO.deleteDatas()
    })


    newSKU(201, 'ciao', 12, 12, 'we', 12, 12);
    getSKU(200, 'iao', 12, 12, 'we', 12, 12);
    update(200, 'bella', 10, 10, 'campione', 8, 30);
    updateSkuPosition(200, 800211);
    deletesku(204);
    newSKU(201, 'ciao', 12, 12, 'we', 12, 12);

});

function newSKU(expectedHTTPStatus, description, weight, volume, notes, availableQuantity, price) {
    it('add sku', function (done) {
        let k = { description: description, weight: weight, volume: volume, notes: notes, availableQuantity: availableQuantity, price: price };
        agent.post('/api/sku')
            .send(k)
            .then(function (res) {
                done();
                res.should.have.status(expectedHTTPStatus);
                
            }).catch(done);


    });

}

function getSKU(expectedHTTPStatus, description, weight, volume, notes, availableQuantity, price) {

    it('GETsku', function (done) {
        let sku = { description: description, weight: weight, volume: volume, notes: notes, availableQuantity: availableQuantity, price: price }
        agent.post('/api/sku')
            .send(sku)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                done();
            })
        agent.get('/api/skus')
            .then(function (res) {
                done();
                res.should.have.status(expectedHTTPStatus);
                
            }).catch(done);

    })
}


function update(expectedHTTPStatus, description, weight, volume, notes, price, availableQuantity) {
    it('update SKU', function (done) {
        SKUsDAO.createSKU('allora', 10, 10, 'hola', 44, 43)
        .then((res)=>{
        const body = {
            description: description,
            weight: weight,
            volume: volume,
            notes: notes,
            price: price,
            availableQuantity: availableQuantity,
        };
        agent.put('/api/sku/' + res)
            .send(body)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                done();
            })
        }).catch(done);
    })
}

function updateSkuPosition(expectedHTTPStatus, position) {
    it("Update an sku position", function (done) {
        SKUsDAO.createSKU("a", 10, 5, "f", 10.99, 50)
        .then((res)=>{
        let body = { position: position };
        agent
            .put("/api/sku/" + res + "/position")
            .send(body)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
        }).catch(done);
    });
}

function deletesku(expectedHTTPStatus) {
    it("delete sku", function (done) {
        SKUsDAO.createSKU("a", 10, 5, "f", 10.99, 50)
        .then((res)=>{
            agent
            .delete("/api/skus/" + res)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
        }).catch(done);
        
    });
}




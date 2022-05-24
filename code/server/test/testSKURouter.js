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
    getSKU(201, 'iao', 12, 12, 'we', 12, 12);
    update(200, 'bella', 10, 10, 'campione', 8, 30);
    updateSkuPosition(200, 800211);
    deletesku();

});

function newSKU(expectedHTTPStatus, description, weight, volume, notes, availableQuantity, price) {
    it('add sku', function (done) {
        let k = { description: description, weight: weight, volume: volume, notes: notes, availableQuantity: availableQuantity, price: price };
        agent.post('/api/sku')
            .send(k)
            .then(function (res) {
                done();
                res.should.have.status(expectedHTTPStatus);
                res.body.should.equal(k);
            })


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
                res.should.have.status(201);
                done();
            })

    });
}


function update(expectedHTTPStatus, description, weight, volume, notes, price, availableQuantity) {
    it('update SKU', async function () {
        let k = await SKUsDAO.createSKU('allora', 10, 10, 'hola', 44, 43);
        const body = {
            description: description,
            weight: weight,
            volume: volume,
            notes: notes,
            price: price,
            availableQuantity: availableQuantity,
        };
        agent.put('/api/sku/' + k)
            .send(body)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                done();
            })

    })
}

function updateSkuPosition(expectedHTTPStatus, position) {
    it("Update an sku position", async function () {
        let id = await SKUsDAO.createSKU("a", 10, 5, "f", 10.99, 50);
        let z = { position: position };
        agent
            .put("/api/sku/" + id + "/position")
            .send(z)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function deletesku() {
    it("delete sku", async function () {
        let id = await SKUsDAO.createSKU("a", 10, 5, "f", 10.99, 50);
        agent
            .delete("/api/skus/" + id)
            .send(id)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}




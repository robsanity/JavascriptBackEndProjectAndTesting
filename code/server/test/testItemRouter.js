const chai = require('chai');
const chaiHttp = require('chai-http');
const itemsDAO = require('../modules/itemsDAO');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);


describe('test', () => {
    beforeEach(async () => {
        await itemsDAO.deleteALLItems()
    })


    newItem(201, 'new item', 12, 1, 2, 10.99);
    getItem(201, 'new item', 12, 1, 2, 10.99);
    updateItem(200, 'new description', 88, 77, 66, 0.99);
    deleteItem('new item', 12, 1, 2, 10.99);

});

function newItem(expectedHTTPStatus, description, id, SKUId, supplierId, price) {
    it('add item', function (done) {
        let k = { id: id, description: description, SKUId: SKUId, supplierId: supplierId, price: price };
        agent.post('/api/item')
            .send(k)
            .then(function (res) {
                done();
                res.should.have.status(expectedHTTPStatus);
                res.body.should.equal(k);
            })


    });

}

function getItem(expectedHTTPStatus, description, id, SKUId, supplierId, price) {

    it('get item', function (done) {
        let k = { id: id, description: description, SKUId: SKUId, supplierId: supplierId, price: price };
        agent.post('/api/item')
            .send(k)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                
            })
        agent.get('/api/items/'+ id)
            .then(function (res) {
                res.should.have.status(200);
            
            }).catch(done);

    });
}


function updateItem(expectedHTTPStatus, description, id, SKUId, supplierId, price) {
    it('update item', async function () {
        let k = await itemsDAO.createItem("description", 3, 4, 5, 99);
        const body = {
            description: description,
            id: id,
            SKUId: SKUId,
            supplierId: supplierId,
            price: price
        };
        agent.put('/api/item/' + 3)
            .send(body)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                done();
            })

    })
}

function deleteItem(description, id, SKUId, supplierId, price) {
    it("delete item", async function () {
         await itemsDAO.createItem(description, id, SKUId, supplierId, price); //???
        agent
            .delete("/api/items/" + id)
            .send(id)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

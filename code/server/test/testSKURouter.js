const chai = require('chai');
const chaiHttp = require('chai-http');
const SKUsDAO = require('../modules/SKUsDAO');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);


describe('test', () =>{
    beforeEach(async () => {
        await SKUsDAO.deleteDatas()
    })
  
    getSKU();
    newSKU(200,'ciao',12,12,'we',12,12);
});

function newSKU(expectedHTTPStatus,description, weight, volume, notes, availableQuantity, price){
    it('add sku', function (done) {
        let k = { description: description, weight: weight, volume: volume, notes: notes, availableQuantity:availableQuantity, price:price};
            agent.post('/api/sku')
                .send(k)
                    .then(function (res) {
                    done();
                    res.should.have.status(expectedHTTPStatus);
                    res.body.should.equal(k);
                    console.log(k);
                })
                
                });
    
            }

function getSKU(){
it('GETsku', function (done) {
    let k = SKUsDAO.createSKU('ciao',12,12,'we',12,12);
        agent.get('/api/skus')
            .then(function (res) {
                console.log(res.body[0].description
                    );
                done();
                res.should.have.status(200);
                res.body[0].description.should.equal('ciao');
                res.body[0].weight.should.equal(12);
                res.body[0].volume.should.equal(12);
                res.body[0].availablequantity.should.equal(12);
                res.body[0].notes.should.equal('we');
                res.body[0].price.should.equal(12);
                res.body[0].idSKU.should.equal(k);
                res.body.length.should.equal(1);
            })
         });
}


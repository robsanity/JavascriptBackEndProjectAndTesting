const chai = require('chai');
const chaiHttp = require('chai-http');
const returnOrdersDAO = require('../modules/returnOrdersDAO');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('testreturn', () => {
    beforeEach(async () => {
        await returnOrdersDAO.deleteDatas()
    })
    newRet(201,"2021-02-02",5);
});

function newRet(expectedHTTPStatus,returnDate,idRestockOrder){
    it('add retord', async function(){
        let products = [{"SKUId":12,"description":"a product","price":10.99,"RFID":"9999"},
        {"SKUId":180,"description":"another product","price":11.99,"RFID":"99999"}];
        let ret = {returnDate:returnDate,products:products,idRestockOrder:idRestockOrder};
        console.log(ret);
        agent.post('/api/returnOrder')
        .send(ret)
        .then(function (res) {
            res.should.have.status(expectedHTTPStatus)
            done();   
            console.log(ret);
        })
        
         
    })
}
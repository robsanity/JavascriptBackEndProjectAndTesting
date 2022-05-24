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
    testlistReturnOrders(200);
    testfindRetOrder(200,3);
    testDeleteRetOrd(204,3);
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

function testlistReturnOrders(expectedHTTPStatus){
    it('get all retord', function(done){
        returnOrdersDAO.createRetOrder(3,"2023-11-11",3,9999)
            agent.get('/api/returnOrders')
            .then(function (res){
                res.should.have.status(expectedHTTPStatus);
                done();
            }) 
        })
}

function testfindRetOrder(expectedHTTPStatus,idReturnOrder){
    it('get retOrdby his id',function(done){
        returnOrdersDAO.createRetOrder(3,"2021-11-11",5,9999)
        .then((res)=>{
            agent.get('/api/returnOrders/' + res)
            .then(function(res){
                res.should.have.status(expectedHTTPStatus);
                done();
                
            })
        })
    })
}
function testDeleteRetOrd(expectedHTTPStatus,idReturnOrder){
    it('get retOrdby his id',function(done){
        returnOrdersDAO.createRetOrder(3,"2021-11-11",5,9999)
        .then((res)=>{
            agent.delete('/api/returnOrder/' + res)
            .then(function(res){
                res.should.have.status(expectedHTTPStatus);
                done();
                
            })
        })
    })
}
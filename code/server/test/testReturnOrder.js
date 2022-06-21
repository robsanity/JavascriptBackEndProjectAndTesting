const chai = require('chai');
const chaiHttp = require('chai-http');
const returnOrdersDAO = require('../modules/returnOrdersDAO');
const restockOrdersDAO = require('../modules/restockOrdersDAO');
const usersDAO = require('../modules/usersDAO');   
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('testreturn', () => {
    beforeEach(async () => {
        await returnOrdersDAO.deleteDatas()
        await restockOrdersDAO.deleteDatas();
        await usersDAO.deleteALLUsers();
        await usersDAO.insertUser("a","b","c","supplier","s");
        let k = await usersDAO.getSuppliers();
       
        let z = await restockOrdersDAO.insertRO("2022/11/11 09:20",k[0].id);
       
    })
    newRet(201,"2021-02-02");
    testlistReturnOrders(200);
    testfindRetOrder(200,3);
    testDeleteRetOrd(204);
});

function newRet(expectedHTTPStatus,returnDate){
    it('add retord', function(done){
        returnOrdersDAO.createRetOrder(3,"2021-02-02",5,'11112222333311112222333311112222');
        restockOrdersDAO.getRestockList()
        .then(function (g){
           
        let products = [{"SKUId":12,"itemId":10,"description":"a product","price":10.99,"RFID":"11112222333311112222333311112222"},
        {"SKUId":180,"itemId":10,"description":"another product","price":11.99,"RFID":'11112222333311112222333311112222'}];
        let ret = {returnDate:returnDate,products:products,restockOrderId:g[0].id};
        agent.post('/api/returnOrder')
        .send(ret)
        .then(function (res) {
            
            res.should.have.status(expectedHTTPStatus)   
            done();
        }).catch(done);
    }).catch(done)
})
}

function testlistReturnOrders(expectedHTTPStatus){
    it('get all retord', function(done){
        returnOrdersDAO.createRetOrder(3,"2023-11-11",3,9999)
            agent.get('/api/returnOrders')
            .then(function (res){
                res.should.have.status(expectedHTTPStatus)
                done();
            }).catch(done);
        })
}

function testfindRetOrder(expectedHTTPStatus,idReturnOrder){
    it('get retOrdby his id',function(done){
        returnOrdersDAO.createRetOrder(3,"2021-11-11",5,9999)
        .then((res)=>{
            agent.get('/api/returnOrders/' + idReturnOrder)
            .then(function(res){
                res.should.have.status(expectedHTTPStatus);
                done();
                
            }).catch(done);
        }).catch(done);
    })
}
function testDeleteRetOrd(expectedHTTPStatus){
    it('get retOrdby his id',function(done){
        returnOrdersDAO.createRetOrder(3,"2021-11-11",5,9999)
        .then((res)=>{
            agent.delete('/api/returnOrder/' + res)
            .then(function(res){
                res.should.have.status(expectedHTTPStatus);
                done();
                
            }).catch(done);
        }).catch(done);
    })
}
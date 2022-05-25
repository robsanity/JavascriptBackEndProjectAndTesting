const chai = require('chai');
const chaiHttp = require('chai-http');
const positionsDAO = require('../modules/positionsDAO');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test', () => {
    beforeEach(async () => {
        await positionsDAO.deleteALLPosition()
    })
    testcreate(201,1,1,8,7,55,80);
    testlistPosition(201,200,1,1,8,7,55,80);
    testupdatePosition(200,1,7,7,70,70,70,70);
    testmodifypositionID(200,3);
    testdeletePosition(204);
    //testcreate(201,1,1,8,7,55,80);
});


function testcreate(expectedHTTPStatus,positionID, aisleID, row, col, maxWeight, maxVolume){
    it('create position', function(done){
        let pos = {positionID:positionID, aisleID:aisleID,row:row,col:col,maxWeight:maxWeight,maxVolume:maxVolume};
        agent.post('/api/position')
        .send(pos)
        .then(function(res){
            res.should.have.status(expectedHTTPStatus);
            done();
        }).catch(done);
    })
}

function testlistPosition(expectedHTTPStatus1,expectedHTTPStatus2,positionID, aisleID, row, col, maxWeight, maxVolume){
    it('list positions',function(done){
        let pos = {positionID:positionID, aisleID:aisleID,row:row,col:col,maxWeight:maxWeight,maxVolume:maxVolume};
        agent.post('/api/position')
        .send(pos)
        .then(function(res){
            
            res.should.have.status(expectedHTTPStatus1);
            
        //}).catch(done)
        agent.get('/api/positions')
        .then(function(r){
            
                r.should.have.status(expectedHTTPStatus2);
                done();
            }).catch(done);
        });
    });
}

function testupdatePosition(expectedHTTPStatus,aisleID,row,col,maxWeight,maxVolume,occupiedWeight,occupiedVolume){
    it('update Poistion values',function(done){
        let po = {positionID:2, aisleID:5,row:5,col:5,maxWeight:100,maxVolume:100};
        agent.post('/api/position')
        .send(po)
        .then((res)=>{
            done();
            let pos = {
                newAisleID:aisleID,
                newRow:row,
                newCol:col,
                newMaxWeight:maxWeight,
                newMaxVolume:maxVolume,
                newOccupiedWeight:occupiedWeight,
                newOccupiedVolume:occupiedVolume
            };
            

            agent.put('/api/position/2')
            .send(pos)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                
            })
        }).catch(done);
    });
    
}

function testmodifypositionID(expectedHTTPStatus,newPositionID){
    it('modify position id',function(done){
        let po = {positionID:2, aisleID:5,row:5,col:5,maxWeight:100,maxVolume:100};
        agent.post('/api/position')
        .send(po)
        .then(function(res){
            let newpos = {newPositionID:newPositionID};
            agent.put('/api/position/2/changeID')
            .send(newpos)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                done();
            })
        }).catch(done);
 
        })
    }
   



    function testdeletePosition(expectedHTTPStatus){
        it('delete position ',function(done){
            let po = {positionID:2, aisleID:5,row:5,col:5,maxWeight:100,maxVolume:100};
            agent.post('/api/position')
            .send(po)
            .then(function(res){
                agent.delete('/api/position/2')
                .then(function (r) {
                    r.should.have.status(expectedHTTPStatus);
                    done();
                })
            }).catch(done);
     
            })
        }

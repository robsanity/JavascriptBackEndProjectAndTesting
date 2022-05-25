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


    newUser(201, 'user1@ezwh.com', 'John', 'Smith', 'testpassword', 'customer');
    getUser(200, 'user1@ezwh.com', 'John', 'Smith', 'testpassword', 'customer');
    getCustomerSession(200, 'user2@ezwh.com', 'John', 'Smith', 'testpassword', 'customer');
    updateUser(200, 'user2@ezwh.com', 'John', 'Smith', 'testpassword', 'clerk', 'supplier');
    deleteUser('user1@ezwh.com', 'John', 'Smith', 'testpassword', 'customer');

});

function newUser(expectedHTTPStatus, username, name, surname, password, type) {
    it('add User', function (done) {
        let k = { username: username, name: name, surname: surname, password: password, type: type };
        agent.post('/api/newUser')
            .send(k)
            .then(function (res) {
                done();
                res.should.have.status(expectedHTTPStatus);
                res.body.should.equal(k);
            })


    });

}

function getUser(expectedHTTPStatus, username, name, surname, password, type) {

    it('get Users(except managers)', function (done) {
        let k = { username: username, name: name, surname: surname, password: password, type: type };
        agent.post('/api/newUser')
            .send(k)
            .then(function (r) {
                r.should.have.status(201);
                agent.get('/api/users')
                    .then(function (res) {
                        res.should.have.status(expectedHTTPStatus);
                        done();
                    }).catch(done);

            }).catch(done);
    });
}

function getCustomerSession(expectedHTTPStatus, username, name, surname, password, type) {

    it('get Customers session', function (done) {
        let k = { username: username, name: name, surname: surname, password: password, type: type };
        agent.post('/api/newUser')
            .send(k)
            .then(function (r) {
                r.should.have.status(201);
                const body = {
                    username: username,
                    password: password
                };
                agent.post('/api/customerSessions')
                     .send(body)
                     .then(function (res) {
                        res.should.have.status(expectedHTTPStatus);
                        done();
                    }).catch(done);

            }).catch(done);
    });
}

function updateUser(expectedHTTPStatus, username, name, surname, password, type, newType) {
    it('update User rights', function (done) {
        let k = { username: username, name: name, surname: surname, password: password, type: type };
        agent.post('/api/newUser')
            .send(k)
            .then(function (r) {
                r.should.have.status(201);
                const body = {
                    oldType: type,
                    newType: newType,
                };
                agent.put('/api/users/'+username)
                    .send(body)
                    .then(function (r) {
                        r.should.have.status(expectedHTTPStatus);
                        done();
                    }).catch(done);

            }).catch(done);
    });
}

function deleteUser(username, name, surname, password, type) {
    it("delete User", function (done) {
        let k = { username: username, name: name, surname: surname, password: password, type: type };
        agent.post('/api/newUser')
            .send(k)
            .then(function (r) {
                r.should.have.status(201);
                agent.delete("/api/users/" + username + "/" + type)
                    .then(function (res) {
                        res.should.have.status(204);
                        done();
                    }).catch(done);
            }).catch(done);
    });
}
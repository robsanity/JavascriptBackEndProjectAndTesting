const chai = require('chai');
const chaiHttp = require('chai-http');
const SKUsDAO = require('../modules/SKUsDAO')
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test test descriptors', () => {
    beforeEach(async () => {
        await deleteALLTestDescriptor();
        await deleteDatas();

    })

    


})
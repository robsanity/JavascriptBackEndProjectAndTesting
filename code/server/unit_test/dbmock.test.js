const SKUsDAO = require('./modules/SKUsDAO');
const dao = require('./modules/mockSKUsDAO');

describe('get SKU', ()=>{
    beforeEach(()=>{
        dao.findSKU.mockReset();
        dao.findSKU.mockReturnValueOnce({
            
        });
    });
}); 
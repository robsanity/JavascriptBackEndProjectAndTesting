const RestockOrdersDAO = require('../modules/RestockOrdersDAO');

describe("Test RestockOrder", () => {
    beforeAll(() => {
        RestockOrdersDAO.deleteDatas();
    })

    beforeEach(() => RestockOrdersDAO.deleteDatas())

    test("Database start", async () => {
        let res = await RestockOrdersDAO.getRestockOrders();
        expect(res.length).toStrictEqual(0);
    })

    testgetRestockOrder();

    
});

function initialize(){
    async() =>{
         await RestockOrdersDAO.initialize();
    }
}


function testgetRestockOrder(){
    test("Test Get Orders", async () => {
        let res = await RestockOrdersDAO.getRestockOrders();
        console.log(res.length);
        expect(res.length).toStrictEqual(0);
    });
}
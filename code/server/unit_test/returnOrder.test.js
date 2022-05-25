
const returnOrderDAO = require('../modules/returnOrdersDAO');

describe("Test ReturnOrder", () => {
    beforeAll(async() => {
        await returnOrderDAO.deleteDatas();
    })

    beforeEach(async() => await returnOrderDAO.deleteDatas())

    test("Database start", async () => {
        let res = await returnOrderDAO.listReturnOrders();
        expect(res.length).toStrictEqual(0);
    })
    testlistReturnOrder();
    testFindRetOrder(2);
    testcreateRetOrder(2,'2022-12-12',1,80012345);
    testDeleteOrder();
});

function testlistReturnOrder (){
    test ('Get all ReturnOrder', async()=>{
        let res = await returnOrderDAO.listReturnOrders();
        expect(res.length).toStrictEqual(0);
    
        let neworder = await returnOrderDAO.createRetOrder(
          2,
          '2022-12-12',
          1,
          9999    
        );
    
        res = await returnOrderDAO.listReturnOrders();
        expect(res.length).toStrictEqual(1);
    
        neworder = await returnOrderDAO.createRetOrder(
          3,
          '2022-10-10',
          3,
          80012345
        );
    
        res = await returnOrderDAO.listReturnOrders();
        expect(res.length).toStrictEqual(2);
      });
}

function testFindRetOrder(z){
        test('find ret ord', async()=>{
          let res = await returnOrderDAO.listReturnOrders();
        expect(res.length).toStrictEqual(0);
        
            let neworder = await returnOrderDAO.createRetOrder(
                2,
                '2022-12-12',
                1,
                80012345      
            );
        
            res = await returnOrderDAO.listReturnOrders();
            expect(res.length).toStrictEqual(1);
            let z  = res[0].idReturnOrder;
            let k = await returnOrderDAO.listReturnOrders(z);
            expect(k).toStrictEqual(res);
        })
    }

function testcreateRetOrder(idReturnOrder, returnDate, idRestockOrder, idSKUItem){
    test('create ret ord',async()=>{
        let res = await returnOrderDAO.listReturnOrders();
        expect(res.length).toStrictEqual(0);
        let neworder = await returnOrderDAO.createRetOrder(idReturnOrder, returnDate, idRestockOrder, idSKUItem);
        
    
        res = await returnOrderDAO.listReturnOrders();
        console.log(res[0]);
        let z = 0;
        
        expect(res.length).toStrictEqual(1);
        expect(res[0].idReturnOrder).toStrictEqual(idReturnOrder);
        expect(res[0].returnDate).toStrictEqual(returnDate);
        expect(res[0].idRestockOrder).toStrictEqual(idRestockOrder);
        for (k = 0; k < res[0].products.length;k++){
        if (res[0].products[k].RFID === idSKUItem){
            z =  z + 1;
        }
    }
        expect(z).toStrictEqual(1);
    })
}

function testDeleteOrder(){
    test('delete order',async() =>{
        let res = await returnOrderDAO.listReturnOrders();
        expect(res.length).toStrictEqual(0);
        
            let neworder = await returnOrderDAO.createRetOrder(
                2,
                '2022-12-12',
                1,
                80012345      
            );
        
            res = await returnOrderDAO.listReturnOrders();
            expect(res.length).toStrictEqual(1);
            await returnOrderDAO.deleteRetOrder(neworder);
            let m = await returnOrderDAO.listReturnOrders();
            expect(m.length).toStrictEqual(0);

    });
}



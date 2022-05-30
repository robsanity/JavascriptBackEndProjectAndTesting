
const returnOrderDAO = require('../modules/returnOrdersDAO');
const SKU = require('../modules/SKUsDAO');
const SKUItems = require('../modules/SKUItemsDAO');

describe("Test ReturnOrder", () => {
    beforeAll(async() => {
        await returnOrderDAO.deleteDatas();
        await returnOrderDAO.deleteProducts();
        await SKU.deleteDatas();
        await SKUItems.deleteALLSKUItems();
    })

    beforeEach(async() => await returnOrderDAO.deleteDatas());
    beforeEach(async() => await returnOrderDAO.deleteProducts());
    beforeEach(async() => await SKU.deleteDatas());
    beforeEach(async() => await SKUItems.deleteALLSKUItems());


    test("Database start", async () => {
        let res = await returnOrderDAO.listReturnOrders();
        expect(res.length).toStrictEqual(0);
    })
    testlistReturnOrder();
    testFindRetOrder(2);
    testcreateRetOrder(3,'2022-12-12',1,"9999");
    testDeleteOrder();
});

function testlistReturnOrder (){
    test ('Get all ReturnOrder', async()=>{
        let res = await returnOrderDAO.listReturnOrders();
        expect(res.length).toStrictEqual(0);
        let idsku = await SKU.createSKU("product",10,10,"1",20,10);
        await SKUItems.createSKUItem("9999",idsku,"2020-12-10");
        await returnOrderDAO.addProducts(idsku,"a product",10.99,"9999",3);
        await SKUItems.addRetOrdtoSKUITEM(3);
        await returnOrderDAO.createRetOrder(3, '2022-12-12',1, "9999");
        res = await returnOrderDAO.listReturnOrders();
        expect(res.length).toStrictEqual(1);
    
      });
}

function testFindRetOrder(){
        test('find ret ord', async()=>{
          let res = await returnOrderDAO.listReturnOrders();
        expect(res.length).toStrictEqual(0);
        let idsku = await SKU.createSKU("product",10,10,"1",20,10);
        await SKUItems.createSKUItem("9999",idsku,"2020-12-10");
        await returnOrderDAO.addProducts(idsku,"a product",10.99,"9999",3);
        await SKUItems.addRetOrdtoSKUITEM(3);
        await returnOrderDAO.createRetOrder(3, '2022-12-12',1, "9999");
        
            res = await returnOrderDAO.listReturnOrders();
            expect(res.length).toStrictEqual(1);
            let z  = res[0].idReturnOrder;
            let k = await returnOrderDAO.listReturnOrders(z);
            expect(k).toStrictEqual(res);
        })
    }

function testcreateRetOrder(idReturnOrder, returnDate, idRestockOrder,RFID){
    test('create ret ord',async()=>{
        let res = await returnOrderDAO.listReturnOrders();
        expect(res.length).toStrictEqual(0);
        let idsku = await SKU.createSKU("product",10,10,"1",20,10);
        await SKUItems.createSKUItem("9999",idsku,"2020-12-10");
        await returnOrderDAO.addProducts(idsku,"a product",10.99,"9999",3);
        await SKUItems.addRetOrdtoSKUITEM(idReturnOrder);
        await returnOrderDAO.createRetOrder(idReturnOrder, returnDate, idRestockOrder, RFID);
        res = await returnOrderDAO.listReturnOrders();
        let z = 0;
        expect(res.length).toStrictEqual(1);
        expect(res[0].idReturnOrder).toStrictEqual(idReturnOrder);
        expect(res[0].returnDate).toStrictEqual(returnDate);
        expect(res[0].idRestockOrder).toStrictEqual(idRestockOrder);
        
    })
}

function testDeleteOrder(){
    test('delete order',async() =>{
        let res = await returnOrderDAO.listReturnOrders();
        expect(res.length).toStrictEqual(0);
        let idsku = await SKU.createSKU("product",10,10,"1",20,10);
        await SKUItems.createSKUItem("9999",idsku,"2020-12-10");
        await returnOrderDAO.addProducts(idsku,"a product",10.99,"9999",3);
        await SKUItems.addRetOrdtoSKUITEM(3);
        let neworder = await returnOrderDAO.createRetOrder(3, '2022-12-12',1, "9999");
        
            res = await returnOrderDAO.listReturnOrders();
            expect(res.length).toStrictEqual(1);
            await returnOrderDAO.deleteRetOrder(neworder);
            let m = await returnOrderDAO.listReturnOrders();
            expect(m.length).toStrictEqual(0);

    });
}


'use strict'
//const { expect } = require('chai');
const restockOrdersDAO = require('../modules/restockOrdersDAO');
const itemsDAO = require('../modules/itemsDAO');

describe("Test RestockOrder", () => {
    beforeAll(() => {
        restockOrdersDAO.deleteDatas();
        itemsDAO.deleteALLItems();
    })

    beforeEach(() => {
        restockOrdersDAO.deleteDatas();
        itemsDAO.deleteALLItems();
    })

    test("Database start", async () => {
        let res = await restockOrdersDAO.getRestockList();
        expect(res.length).toStrictEqual(0);
    })

    testgetRestockOrder();
    testPostRestockOrder();


});


function testgetRestockOrder() {
    test("Test Get Orders", async () => {
        let res = await restockOrdersDAO.getRestockList();
        expect(res.length).toStrictEqual(0);

        res = await restockOrdersDAO.insertRO(
            '2021/10/10',
            '1'
        )
        let get = await restockOrdersDAO.getRestockList();
        expect(res).toStrictEqual(get[0].id);


        get = await restockOrdersDAO.getByIdRestockOrders(res);
        expect(get.length).toStrictEqual(1)
        expect(get[0].id).toStrictEqual(res)

    });
}

function testPostRestockOrder() {
    test("Test Post Orders", async () => {
        let res = await restockOrdersDAO.getRestockList();
        expect(res.length).toStrictEqual(0);

        let id = await restockOrdersDAO.insertRO(
            '2021/10/10',
            '1'
        )
        let get = await restockOrdersDAO.getRestockList();
        expect(id).toStrictEqual(get[0].id);

        let products = [
            { "SKUId": 12, "description": "a product", "price": 10.99, "qty": 30 },
            { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 20 }
        ];
        let idItem;
        for (let p of products) {
            idItem = await restockOrdersDAO.insertI(p.SKUId, p.description, p.price, 1);
            await restockOrdersDAO.insertROI(id, idItem, p.qty);
        }
        res = await itemsDAO.listItems();
        expect(res.length).toStrictEqual(2);
        res = await restockOrdersDAO.getProducts();
        expect(res.length).toStrictEqual(2);

    });
} 

function testPutRestockOrder() {
    test("Test Put Orders", async () => {
        let res = await restockOrdersDAO.getRestockList();
        expect(res.length).toStrictEqual(0);

        let id = await restockOrdersDAO.insertRO(
            '2021/10/10',
            '1'
        )
        let get = await restockOrdersDAO.getRestockList();
        expect(id).toStrictEqual(get[0].id);

        let products = [
            { "SKUId": 12, "description": "a product", "price": 10.99, "qty": 30 },
            { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 20 }
        ];
        let idItem;
        for (let p of products) {
            idItem = await restockOrdersDAO.insertI(p.SKUId, p.description, p.price, 1);
            await restockOrdersDAO.insertROI(id, idItem, p.qty);
        }
        res = await itemsDAO.listItems();
        expect(res.length).toStrictEqual(2);
        res = await restockOrdersDAO.getProducts();
        expect(res.length).toStrictEqual(2);

        res = await restockOrdersDAO.putStateRestockOrder(id, 'DELIVERED');
        expect(res).toStrictEqual(true);

        get = await restockOrdersDAO.getByIdRestockOrders(res);
        expect(get.length).toStrictEqual(1)
        expect(get[0].id).toStrictEqual(res)
        expect(get[0].state).toStrictEqual('DELIVERED')
    });
}
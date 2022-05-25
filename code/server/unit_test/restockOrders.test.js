'use strict'
//const { expect } = require('chai');
const restockOrdersDAO = require('../modules/restockOrdersDAO');
const itemsDAO = require('../modules/itemsDAO');
const SKUItemsDAO = require('../modules/SKUItemsDAO');

describe("Test RestockOrder", () => {
    beforeAll(async() => {
        await restockOrdersDAO.deleteDatas();
        await itemsDAO.deleteALLItems();
        await SKUItemsDAO.deleteALLSKUItems();
    })

    beforeEach(async() => {
        await restockOrdersDAO.deleteDatas();
        await itemsDAO.deleteALLItems();
        await SKUItemsDAO.deleteALLSKUItems();
    })

    test("Database start", async () => {
        let res = await restockOrdersDAO.getRestockList();
        expect(res.length).toStrictEqual(0);
        res = await restockOrdersDAO.getProducts();
        expect(res.length).toStrictEqual(0);
        res = await SKUItemsDAO.listSKUItems();
        expect(res.length).toStrictEqual(0);
    })

    testGetRestockOrder();
    testPostRestockOrder();
    testPutRestockOrder();
    testDeleteRestockOrder();


});


function testGetRestockOrder() {
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

        get = await restockOrdersDAO.getByIdRestockOrders(id);
        expect(get.length).toStrictEqual(1)
        expect(get[0].id).toStrictEqual(id)
        expect(get[0].state).toStrictEqual('DELIVERED')

        let skuItems = [
            { "SKUId": 12, "rfid": "12345678901234567890123456789016" },
            { "SKUId": 12, "rfid": "12345678901234567890123456789017" }
        ];

        for (let si of skuItems) {
            await SKUItemsDAO.createSKUItemNoDate(si.rfid, si.SKUId)
            await restockOrdersDAO.putSkuItemsOfRestockOrder(id, si.rfid, si.SKUId);
        }
        res = await restockOrdersDAO.getSkuItems();
        res = res.filter(si => si.id == id);
        expect(res.length).toStrictEqual(2)

        let transportNote="2021/12/29";

        res = await restockOrdersDAO.putTNRestockOrder(id, transportNote);
        expect(res).toStrictEqual(true)

        get = await restockOrdersDAO.getByIdRestockOrders(id);
        expect(get.length).toStrictEqual(1)
        expect(get[0].transportNote).toStrictEqual(transportNote)

    });
}

function testDeleteRestockOrder() {
    test("Test Delete Orders", async () => {
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

        res = await restockOrdersDAO.deleteRestockOrder(id);
        expect(res).toStrictEqual(true);

        get = await restockOrdersDAO.getRestockList();
        expect(get.length).toStrictEqual(0);
        res = await restockOrdersDAO.getProducts();
        expect(res.length).toStrictEqual(0);



    });
}
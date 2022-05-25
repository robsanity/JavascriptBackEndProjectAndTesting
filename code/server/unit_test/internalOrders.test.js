'use strict'

const internalOrdersDAO = require('../modules/internalOrdersDAO');
const SKUItemsDAO = require('../modules/SKUItemsDAO');
const SKUsDAO = require('../modules/SKUsDAO');

describe("Test RestockOrder", () => {
    beforeAll(async () => {
        await internalOrdersDAO.deleteDatas();
        await SKUItemsDAO.deleteALLSKUItems();
        await SKUsDAO.deleteDatas();
    })

    beforeEach(async () => {
        await internalOrdersDAO.deleteDatas();
        await SKUItemsDAO.deleteALLSKUItems();
        await SKUsDAO.deleteDatas();
    })

    test("Database start", async () => {
        let res = await internalOrdersDAO.getIO();
        expect(res.length).toStrictEqual(0);
        res = await internalOrdersDAO.getSKUsIO();
        expect(res.length).toStrictEqual(0);
        res = await SKUItemsDAO.listSKUItems();
        expect(res.length).toStrictEqual(0);
        res = await SKUsDAO.listSKUs();
        expect(res.length).toStrictEqual(0);
    })

    testGetInternalOrder();
    testPostInternalOrder();
    testPutAcceptedInternalOrder();

});

function testGetInternalOrder() {
    test("Test Get Orders", async () => {
        let res = await internalOrdersDAO.getIO();
        expect(res.length).toStrictEqual(0);

        let issueDate = "2021/11/29 09:33";
        let customerId = 1;
        let products = [
            { "SKUId": 12, "description": "a product", "price": 10.99, "qty": 3 },
            { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 3 }
        ]

        let idIntOrder = await internalOrdersDAO.insertIO(
            issueDate,
            customerId
        );
        for (let p of products) {
            await internalOrdersDAO.insertIOS(
                idIntOrder,
                p.SKUId,
                p.qty
            );
            await SKUsDAO.createSKUWithOnlyId(p.SKUId);
        }

        res = await internalOrdersDAO.getIO();
        expect(res.length).toStrictEqual(1);
        res = await internalOrdersDAO.getSKUsIO();
        expect(res.length).toStrictEqual(2);
        res = await SKUsDAO.listSKUs();
        expect(res.length).toStrictEqual(2);

        res = await internalOrdersDAO.getIssued();
        expect(res.length).toStrictEqual(1);

        res = await internalOrdersDAO.getAccepted();
        expect(res.length).toStrictEqual(0);

        res = await internalOrdersDAO.getNotCompleted();
        expect(res.length).toStrictEqual(1);

        res = await internalOrdersDAO.getCompleted();
        expect(res.length).toStrictEqual(0);

        res = await internalOrdersDAO.getProductsNotCompleted();
        expect(res.length).toStrictEqual(2);

        res = await internalOrdersDAO.getProductsCompleted();
        expect(res.length).toStrictEqual(0);

    })
};

function testPostInternalOrder() {
    test("Test Post Orders", async () => {
        let res = await internalOrdersDAO.getIO();
        expect(res.length).toStrictEqual(0);

        let issueDate = "2021/11/29 09:33";
        let customerId = 1;
        let products = [
            { "SKUId": 12, "description": "a product", "price": 10.99, "qty": 3 },
            { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 3 }
        ]

        let idIntOrder = await internalOrdersDAO.insertIO(
            issueDate,
            customerId
        );
        for (let p of products) {
            await internalOrdersDAO.insertIOS(
                idIntOrder,
                p.SKUId,
                p.qty
            );
            await SKUsDAO.createSKUWithOnlyId(p.SKUId);
        }

        res = await internalOrdersDAO.getIO();
        expect(res.length).toStrictEqual(1);

        expect(res[0].idInternalOrder).toStrictEqual(idIntOrder);
        expect(res.length).toStrictEqual(1);
        expect(res.length).toStrictEqual(1);

        res = await internalOrdersDAO.getSKUsIO();
        expect(res.length).toStrictEqual(2);


        res = await SKUsDAO.listSKUs();
        expect(res.length).toStrictEqual(2);



    })
};

function testPutAcceptedInternalOrder() {
    test("Test Get Orders", async () => {
        let res = await internalOrdersDAO.getIO();
        expect(res.length).toStrictEqual(0);

        let issueDate = "2021/11/29 09:33";
        let customerId = 1;
        let products = [
            { "SKUId": 12, "description": "a product", "price": 10.99, "qty": 3 },
            { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 3 }
        ]

        let idIntOrder = await internalOrdersDAO.insertIO(
            issueDate,
            customerId
        );
        for (let p of products) {
            await internalOrdersDAO.insertIOS(
                idIntOrder,
                p.SKUId,
                p.qty
            );
            await SKUsDAO.createSKUWithOnlyId(p.SKUId);
        }

        res = await internalOrdersDAO.getIO();
        expect(res.length).toStrictEqual(1);
        res = await internalOrdersDAO.getSKUsIO();
        expect(res.length).toStrictEqual(2);
        res = await SKUsDAO.listSKUs();
        expect(res.length).toStrictEqual(2);

        res = await internalOrdersDAO.updateIntOrder(idIntOrder, 'ACCEPTED', []);
        expect(res).toStrictEqual(true);

        res = await internalOrdersDAO.getAccepted();
        expect(res.length).toStrictEqual(1);
        expect(res[0].state).toStrictEqual('ACCEPTED');

        res = await internalOrdersDAO.getIssued();
        expect(res.length).toStrictEqual(0);

        products = [
            { "SkuID": 1, "RFID": "12345678901234567890123456789016" },
            { "SkuID": 1, "RFID": "12345678901234567890123456789038" }
        ];

        res = await internalOrdersDAO.updateIntOrder(idIntOrder, 'COMPLETED', products);
        expect(res).toStrictEqual(true);

        res = await internalOrdersDAO.getIO();
        expect(res.length).toStrictEqual(1);
        expect(res[0].state).toStrictEqual('COMPLETED');

        

    })
};
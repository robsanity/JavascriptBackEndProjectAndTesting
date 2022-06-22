'use strict'
/* const { expect } = require('chai'); */
const SKUItemsDAO = require('../modules/SKUItemsDAO');
const SKUsDAO = require('../modules/SKUsDAO');    

describe("Test SKU Items", () => {
    beforeAll( async () => {
        await SKUItemsDAO.deleteALLSKUItems();
    })

    beforeEach(async () => {
        await SKUItemsDAO.deleteALLSKUItems();
    })

    test("Database start", async () => {
        let res = await SKUItemsDAO.listSKUItems();
        expect(res.length).toStrictEqual(0);
    })

    testGetSKUItems();
    testPutAndFindSKUItems();
    testPostSKUItems();
    testDeleteSKUItems();
    
})

function testPostSKUItems() {
    test("post sku items", async () => {
        let res = await SKUItemsDAO.listSKUItems();
        expect(res.length).toStrictEqual(0);

        let id = await SKUItemsDAO.createSKUItem(
            "12345678901234567890123456789015",
            1,
            "2021/11/29 12:30"
        )
        expect(id).toStrictEqual("12345678901234567890123456789015");

        res = await SKUItemsDAO.listSKUItems();
        expect(res.length).toStrictEqual(1);

        expect(res[0].RFID).toStrictEqual("12345678901234567890123456789015");
        expect(res[0].DateOfStock).toStrictEqual("2021/11/29 12:30");
        expect(res[0].Available).toStrictEqual(0);
        expect(res[0].SKUId).toStrictEqual(1);


    })
}

function testGetSKUItems() {
    test("get sku items", async () => {
        let res = await SKUItemsDAO.listSKUItems();
        expect(res.length).toStrictEqual(0);

        let id = await SKUItemsDAO.createSKUItem(
            "12345678901234567890123456789015",
            1,
            "2021/11/29 12:30"
        )
        expect(id).toStrictEqual("12345678901234567890123456789015");

        res = await SKUItemsDAO.listSKUItems();
        expect(res.length).toStrictEqual(1);

    })
}

function testPutAndFindSKUItems() {
    test("modify sku items and find sku items, available = 1", async () => {
        let res = await SKUItemsDAO.listSKUItems();
        expect(res.length).toStrictEqual(0);

        let id = await SKUItemsDAO.createSKUItem(
            "12345678901234567890123456789015",
            1,
            "2021/11/29 12:30"
        )
        expect(id).toStrictEqual("12345678901234567890123456789015");

        res = await SKUItemsDAO.listSKUItems();
        expect(res.length).toStrictEqual(1);

        res = await SKUItemsDAO.modifySKUItem("111111111111111", 1, "2000/10/10", "12345678901234567890123456789015");
        expect(res).toStrictEqual(true);

        res = await SKUItemsDAO.listSKUItems();
        expect(res.length).toStrictEqual(1);
        expect(res[0].RFID).toStrictEqual("111111111111111");
        expect(res[0].DateOfStock).toStrictEqual("2000/10/10");
        expect(res[0].Available).toStrictEqual(1);

        let id2 = await SKUItemsDAO.createSKUItem(
            "12345678901234567890123456789015",
            1,
            "2021/11/29 12:30"
        )
        expect(id).toStrictEqual("12345678901234567890123456789015");
        res = await SKUItemsDAO.modifySKUItem("12345678901234567890123456789015", 1, "2021/11/29 12:30", "12345678901234567890123456789015");
        expect(res).toStrictEqual(true);

        res = await SKUItemsDAO.listSKUItems();
        expect(res.length).toStrictEqual(2);

        res = await SKUItemsDAO.findSKUItems(1);
        expect(res.length).toStrictEqual(2);

        res = await SKUItemsDAO.findSKUItem("111111111111111", 1);
        expect(res.length).toStrictEqual(1);
    })
}

function testDeleteSKUItems() {
    test("delete sku items", async () => {
        let res = await SKUItemsDAO.listSKUItems();
        expect(res.length).toStrictEqual(0);

        let id = await SKUItemsDAO.createSKUItem(
            "12345678901234567890123456789015",
            1,
            "2021/11/29 12:30"
        )
        expect(id).toStrictEqual("12345678901234567890123456789015");

        res = await SKUItemsDAO.listSKUItems();
        expect(res.length).toStrictEqual(1);

        res = await SKUItemsDAO.deleteSKUItem("12345678901234567890123456789015");
        expect(res).toStrictEqual(true);

        res = await SKUItemsDAO.listSKUItems();
        expect(res.length).toStrictEqual(0);
        await SKUsDAO.deleteDatas();
    })
}
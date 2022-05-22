'use strict';
const itemsDAO = require('../modules/itemsDAO');
const db = require ('../db.js');

describe("Test item", () => {
    beforeAll( async () => {
        await itemsDAO.deleteALLItems();
    })

    beforeEach(async () => {
        await itemsDAO.deleteALLItems();
    })

    test("Database start", async () => {
        let res = await itemsDAO.listItems();
        expect(res.length).toStrictEqual(0);
    })

    testGetItems();
    testFindItem(1);
    /*testInsertItems(description, id, SKUId, supplierId, price);
    testUpdateItem(description, id, SKUId, supplierId, price)
    testDeleteItem();*/
})

function testGetItems() {
    test("listItems and createItem", async () => {
        let res = await itemsDAO.listItems();
        expect(res.length).toStrictEqual(0);

        let newItem = await itemsDAO.createItem(
            "a new item",
            1,
            1,
            2,
            10.99
        );
        expect(newItem).toStrictEqual(true);
        res = await itemsDAO.listItems();
        expect(res.length).toStrictEqual(1);

        newItem = await itemsDAO.createItem(
            "another item",
            2,
            2,            
            1,
            12.99
        );
        expect(newItem).toStrictEqual(true);
        res = await itemsDAO.listItems();
        expect(res.length).toStrictEqual(2);

    })
}

function testFindItem(id) {
    test("findItem", async () => {
        let res = await itemsDAO.listItems();
        expect(res.length).toStrictEqual(0);

        let newItem = await itemsDAO.createItem(
            "a new item",
            id,
            1,
            2,
            10.99
        );
        console.log(newItem.description); //stampa undefined
        expect(newItem).toStrictEqual(true);
        res = await itemsDAO.listItems();
        expect(res.length).toStrictEqual(1);

        let findItem = await itemsDAO.findItem(id);
            console.log(findItem.description); //stampa undefined
        expect(findItem[0].description).toStrictEqual("a new item");
        expect(findItem[0].id).toStrictEqual(id);
        expect(findItem[0].SKUId).toStrictEqual(1);
        expect(findItem[0].supplierId).toStrictEqual(2);
        expect(findItem[0].price).toStrictEqual(10.99);
    })
}
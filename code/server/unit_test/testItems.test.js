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
    /*testCheckItem();
    testInsertItems();
    testUpdateItem()
    testDeleteItem();*/
})

function testGetItems() {
    test("getItems", async () => {
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

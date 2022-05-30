'use strict';
const itemsDAO = require('../modules/itemsDAO');

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
    testUpdateItem(1, "new description", 99)
    testDeleteItem(1);
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
        expect(newItem).toStrictEqual(true);
        res = await itemsDAO.listItems();
        expect(res.length).toStrictEqual(1);

        let findItem = await itemsDAO.findItem(id);
        expect(findItem[0].description).toStrictEqual("a new item");
        expect(findItem[0].id).toStrictEqual(id);
        expect(findItem[0].SKUId).toStrictEqual(1);
        expect(findItem[0].suppliersId).toStrictEqual(2);
        expect(findItem[0].price).toStrictEqual(10.99);
    })
}

function testUpdateItem(id, newDescription, newPrice) {
    test("updateUserItem", async () => {
        let res = await itemsDAO.listItems();
        expect(res.length).toStrictEqual(0);

        let newItem = await itemsDAO.createItem(
            "a new item",
            id,
            1,
            2,
            10.99
        );
        expect(newItem).toStrictEqual(true);
        res = await itemsDAO.listItems();
        expect(res.length).toStrictEqual(1);

        res = await itemsDAO.updateItem(id, newDescription, newPrice);
        expect(res).toStrictEqual(true);

        let findItem = await itemsDAO.findItem(id);

        expect(findItem[0].description).toStrictEqual(newDescription);
        expect(findItem[0].id).toStrictEqual(id);
        expect(findItem[0].price).toStrictEqual(newPrice);
    })
}

function testDeleteItem(id) {
    test("deleteItem", async () => {
        let res = await itemsDAO.listItems();
        expect(res.length).toStrictEqual(0);

        let newItem = await itemsDAO.createItem(
            "a new item",
            id,
            1,
            2,
            10.99
        );
        expect(newItem).toStrictEqual(true);
        
        res = await itemsDAO.listItems();
        expect(res.length).toStrictEqual(1);

        res = await itemsDAO.deleteItem(id);
        expect(res).toStrictEqual(true);

        res = await itemsDAO.listItems();
        expect(res.length).toStrictEqual(0);
    })
}
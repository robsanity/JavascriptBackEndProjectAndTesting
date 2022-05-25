const positionsDAO = require('../modules/positionsDAO');


describe("Test positions", () => {
    beforeAll(async () => {
        await positionsDAO.deleteALLPosition();
    })

    beforeEach(async () => await positionsDAO.deleteALLPosition())

    test("Database start", async () => {
        let res = await positionsDAO.listPositions();
        expect(res.length).toStrictEqual(0);
    })

    testGetPositions();
    testCheckPositions(1);
    testCreatePositions(1, 123, 5, 6, 100, 100);
    testUpdatePositions(1, 456, 7, 8, 200, 200, 100, 100);
    testUpdatePositionsId(1, 2);
    testDeletePositions(1);

})

function testGetPositions() {
    test("get all positions", async () => {
        let res = await positionsDAO.listPositions();
        expect(res.length).toStrictEqual(0);

        let newPosition = await positionsDAO.createPositions(
            1,
            123,
            5,
            6,
            100,
            100
        )
        expect(newPosition).toStrictEqual(1);

        res = await positionsDAO.listPositions();
        expect(res.length).toStrictEqual(1);
    })
}

function testCheckPositions(id) {
    test("check positions by id", async () => {
        let res = await positionsDAO.listPositions();
        expect(res.length).toStrictEqual(0);

        let newPosition = await positionsDAO.createPositions(
            id,
            123,
            5,
            6,
            100,
            100
        )
        expect(newPosition).toStrictEqual(1);

        res = await positionsDAO.checkPosition(id);
        expect(res.length).toStrictEqual(1);

        expect(res[0].positionID).toStrictEqual(id);

    })
}

function testCreatePositions(positionID, aisleID, row, col, maxWeight, maxVolume) {
    test("create positions", async () => {
        let res = await positionsDAO.listPositions();
        expect(res.length).toStrictEqual(0);

        let newPosition = await positionsDAO.createPositions(
            positionID,
            aisleID,
            row,
            col,
            maxWeight,
            maxVolume
        )
        expect(newPosition).toStrictEqual(1);

        res = await positionsDAO.listPositions();
        expect(res.length).toStrictEqual(1);

        expect(res[0].positionID).toStrictEqual(positionID);
        expect(res[0].aisleID).toStrictEqual(aisleID);
        expect(res[0].row).toStrictEqual(row);
        expect(res[0].col).toStrictEqual(col);
        expect(res[0].maxWeight).toStrictEqual(maxWeight);
        expect(res[0].maxVolume).toStrictEqual(maxVolume);
        expect(res[0].occupiedWeight).toStrictEqual(0);
        expect(res[0].occupiedVolume).toStrictEqual(0);

    })
}

function testUpdatePositions(positionID, newAisleID, newRow, newCol, newMaxWeight, newMaxVolume, newOccupiedWeight, newOccupiedVolume) {
    test("update positions", async () => {
        let res = await positionsDAO.listPositions();
        expect(res.length).toStrictEqual(0);

        let newPosition = await positionsDAO.createPositions(
            positionID,
            123,
            5,
            6,
            100,
            100
        )
        expect(newPosition).toStrictEqual(1);

        res = await positionsDAO.listPositions();
        expect(res.length).toStrictEqual(1);

        expect(res[0].positionID).toStrictEqual(positionID);
        expect(res[0].aisleID).toStrictEqual(123);
        expect(res[0].row).toStrictEqual(5);
        expect(res[0].col).toStrictEqual(6);
        expect(res[0].maxWeight).toStrictEqual(100);
        expect(res[0].maxVolume).toStrictEqual(100);
        expect(res[0].occupiedWeight).toStrictEqual(0);
        expect(res[0].occupiedVolume).toStrictEqual(0);

        res = await positionsDAO.modifyPosition(positionID, newAisleID, newRow, newCol, newMaxWeight, newMaxVolume, newOccupiedWeight, newOccupiedVolume);
        expect(res).toStrictEqual(true);

        res = await positionsDAO.listPositions();
        expect(res.length).toStrictEqual(1);

        expect(res[0].positionID).toStrictEqual(positionID);
        expect(res[0].aisleID).toStrictEqual(newAisleID);
        expect(res[0].row).toStrictEqual(newRow);
        expect(res[0].col).toStrictEqual(newCol);
        expect(res[0].maxWeight).toStrictEqual(newMaxWeight);
        expect(res[0].maxVolume).toStrictEqual(newMaxVolume);
        expect(res[0].occupiedWeight).toStrictEqual(newOccupiedWeight);
        expect(res[0].occupiedVolume).toStrictEqual(newOccupiedVolume);
    })
} 

function testUpdatePositionsId(positionID, newPositionID) {
    test("update position id", async () => {
        let res = await positionsDAO.listPositions();
        expect(res.length).toStrictEqual(0);

        let newPosition = await positionsDAO.createPositions(
            positionID,
            123,
            5,
            6,
            100,
            100
        )
        expect(newPosition).toStrictEqual(1);

        res = await positionsDAO.listPositions();
        expect(res.length).toStrictEqual(1);

        expect(res[0].positionID).toStrictEqual(positionID);
        expect(res[0].aisleID).toStrictEqual(123);
        expect(res[0].row).toStrictEqual(5);
        expect(res[0].col).toStrictEqual(6);
        expect(res[0].maxWeight).toStrictEqual(100);
        expect(res[0].maxVolume).toStrictEqual(100);
        expect(res[0].occupiedWeight).toStrictEqual(0);
        expect(res[0].occupiedVolume).toStrictEqual(0);

        res = await positionsDAO.modifyPositionID(positionID, newPositionID);
        expect(res).toStrictEqual(true);

        res = await positionsDAO.listPositions();
        expect(res.length).toStrictEqual(1);

        expect(res[0].positionID).toStrictEqual(newPositionID);
        expect(res[0].aisleID).toStrictEqual(123);
        expect(res[0].row).toStrictEqual(5);
        expect(res[0].col).toStrictEqual(6);
        expect(res[0].maxWeight).toStrictEqual(100);
        expect(res[0].maxVolume).toStrictEqual(100);
        expect(res[0].occupiedWeight).toStrictEqual(0);
        expect(res[0].occupiedVolume).toStrictEqual(0);
    })
}

function testDeletePositions(id) {
    test("delete positions by id", async () => {
        let res = await positionsDAO.listPositions();
        expect(res.length).toStrictEqual(0);

        let newPosition = await positionsDAO.createPositions(
            id,
            123,
            5,
            6,
            100,
            100
        )
        expect(newPosition).toStrictEqual(1);

        res = await positionsDAO.listPositions();
        expect(res.length).toStrictEqual(1);

        res = await positionsDAO.deletePosition(id);
        expect(res).toStrictEqual(true);

        res = await positionsDAO.listPositions();
        expect(res.length).toStrictEqual(0);

    })
}
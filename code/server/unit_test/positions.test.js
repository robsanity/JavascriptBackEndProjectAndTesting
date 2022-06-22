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
    testCheckPositions('111122223333');
    testCreatePositions('111122223333', '1111', '2222', '3333', 100, 100);
    testUpdatePositions('111122223333', '222233334444', '2222', '3333', '4444', 200, 200, 100, 100);
    testUpdatePositionsId('111122223333','222233334444', '2222', '3333','4444');
    testDeletePositions('111122223333');

})

function testGetPositions() {
    test("get all positions", async () => {
        let res = await positionsDAO.listPositions();
        expect(res.length).toStrictEqual(0);

        let newPosition = await positionsDAO.createPositions(
            '111122223333',
            '1111',
            '2222',
            '3333',
            100,
            100
        )
        expect(newPosition).toStrictEqual('111122223333');

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
            '1111',
            '2222',
            '3333',
            100,
            100
        )
        expect(newPosition).toStrictEqual(id);

        res = await positionsDAO.checkPosition(id);
        expect(res.length).toStrictEqual(1);

        expect(res[0].positionID).toStrictEqual(111122223333);

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
        expect(newPosition).toStrictEqual(positionID);

        res = await positionsDAO.listPositions();
        expect(res.length).toStrictEqual(1);

        expect(res[0].positionID).toEqual(111122223333);
        expect(res[0].aisleID).toStrictEqual(1111);
        expect(res[0].row).toStrictEqual(2222);
        expect(res[0].col).toStrictEqual(3333);
        expect(res[0].maxWeight).toStrictEqual(maxWeight);
        expect(res[0].maxVolume).toStrictEqual(maxVolume);
        expect(res[0].occupiedWeight).toStrictEqual(0);
        expect(res[0].occupiedVolume).toStrictEqual(0);

    })
}

function testUpdatePositions(positionID, newPositionID, newAisleID, newRow, newCol, newMaxWeight, newMaxVolume, newOccupiedWeight, newOccupiedVolume) {
    test("update positions", async () => {
        let res = await positionsDAO.listPositions();
        expect(res.length).toStrictEqual(0);

        let newPosition = await positionsDAO.createPositions(
            positionID,
            '1111',
            '2222',
            '3333',
            100,
            100
        )
        expect(newPosition).toStrictEqual(positionID);

        res = await positionsDAO.listPositions();
        expect(res.length).toStrictEqual(1);

        expect(res[0].positionID).toStrictEqual(111122223333);
        expect(res[0].aisleID).toStrictEqual(1111);
        expect(res[0].row).toStrictEqual(2222);
        expect(res[0].col).toStrictEqual(3333);
        expect(res[0].maxWeight).toStrictEqual(100);
        expect(res[0].maxVolume).toStrictEqual(100);
        expect(res[0].occupiedWeight).toStrictEqual(0);
        expect(res[0].occupiedVolume).toStrictEqual(0);

        res = await positionsDAO.modifyPosition(positionID, newPositionID, newAisleID, newRow, newCol, newMaxWeight, newMaxVolume, newOccupiedWeight, newOccupiedVolume);
        expect(res).toStrictEqual(true);

        res = await positionsDAO.listPositions();
        expect(res.length).toStrictEqual(1);

        expect(res[0].positionID).toStrictEqual(222233334444);
        expect(res[0].aisleID).toStrictEqual(2222);
        expect(res[0].row).toStrictEqual(3333);
        expect(res[0].col).toStrictEqual(4444);
        expect(res[0].maxWeight).toStrictEqual(newMaxWeight);
        expect(res[0].maxVolume).toStrictEqual(newMaxVolume);
        expect(res[0].occupiedWeight).toStrictEqual(newOccupiedWeight);
        expect(res[0].occupiedVolume).toStrictEqual(newOccupiedVolume);
    })
} 

function testUpdatePositionsId(positionID, newPositionID, newAisleID, newRow, newCol) {
    test("update position id", async () => {
        let res = await positionsDAO.listPositions();
        expect(res.length).toStrictEqual(0);

        let newPosition = await positionsDAO.createPositions(
            positionID,
            '1111',
            '2222',
            '3333',
            100,
            100
        )

        res = await positionsDAO.listPositions();
        expect(res.length).toStrictEqual(1);

        expect(res[0].positionID).toStrictEqual(111122223333);
        expect(res[0].aisleID).toStrictEqual(1111);
        expect(res[0].row).toStrictEqual(2222);
        expect(res[0].col).toStrictEqual(3333);
        expect(res[0].maxWeight).toStrictEqual(100);
        expect(res[0].maxVolume).toStrictEqual(100);
        expect(res[0].occupiedWeight).toStrictEqual(0);
        expect(res[0].occupiedVolume).toStrictEqual(0);

        res = await positionsDAO.modifyPositionID(newPositionID, positionID,  newAisleID, newRow, newCol);
        expect(res).toStrictEqual(true);

        res = await positionsDAO.listPositions();
        expect(res.length).toStrictEqual(1);

        expect(res[0].positionID).toStrictEqual(222233334444);
        expect(res[0].aisleID).toStrictEqual(2222);
        expect(res[0].row).toStrictEqual(3333);
        expect(res[0].col).toStrictEqual(4444);
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
            '1111',
            '2222',
            '3333',
            100,
            100
        )
        expect(newPosition).toStrictEqual(id);

        res = await positionsDAO.listPositions();
        expect(res.length).toStrictEqual(1);

        res = await positionsDAO.deletePosition(id);
        expect(res).toStrictEqual(true);

        res = await positionsDAO.listPositions();
        expect(res.length).toStrictEqual(0);

    })
}
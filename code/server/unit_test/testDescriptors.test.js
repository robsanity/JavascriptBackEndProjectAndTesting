const testDescriptorsDAO = require('../modules/testDescriptorsDAO');


describe("Test testDescriptors", () => {
    beforeAll(async() => {
        await testDescriptorsDAO.deleteALLTestDescriptor();
    })

    beforeEach(async() => await testDescriptorsDAO.deleteALLTestDescriptor())

    test("Database start", async () => {
        let res = await testDescriptorsDAO.getTestDescriptors();
        expect(res.length).toStrictEqual(0);
    })

    testGetTestDescriptors("name", "procedureDescription", 1);
    testGetTestDescriptorsyId();
    testInsertTestDescriptors("name", "procedureDescription", 1);
    testUpdateTestDescriptor("name", "procedureDescription", 2, "newName", "newProcedureDescription", 3);
    testDeleteTestDescriptor();


})
function testGetTestDescriptors(name, procedureDescription, idSKU) {
    test("get all test descriptors", async () => {
        let res = await testDescriptorsDAO.getTestDescriptors();
        expect(res.length).toStrictEqual(0);

        let newTD = await testDescriptorsDAO.insertTestDescriptor(
            name,
            procedureDescription,
            idSKU
        );
        expect(newTD).toStrictEqual(true);

        res = await testDescriptorsDAO.getTestDescriptors();
        expect(res.length).toStrictEqual(1);
    })
}

function testGetTestDescriptorsyId() {
    test("get test descriptors by id", async () => {
        let res = await testDescriptorsDAO.getTestDescriptors();
        expect(res.length).toStrictEqual(0);

        let newTD = await testDescriptorsDAO.insertTestDescriptor(
            "name",
            "procedureDescription",
            1
        );
        expect(newTD).toStrictEqual(true);
        res = await testDescriptorsDAO.getTestDescriptors();
        expect(res.length).toStrictEqual(1);
        let lastId = res[0].id;

        res = await testDescriptorsDAO.getByIdTestDescriptors(lastId);
        expect(res.length).toStrictEqual(1);

        expect(res[0].id).toStrictEqual(lastId);
        expect(res[0].name).toStrictEqual("name");
        expect(res[0].procedureDescription).toStrictEqual("procedureDescription");
        expect(res[0].idSKU).toStrictEqual(1);
    })
}


function testInsertTestDescriptors(name, procedureDescription, idSKU) {
    test("insert test descriptors", async () => {
        let res = await testDescriptorsDAO.getTestDescriptors();
        expect(res.length).toStrictEqual(0);

        let newTD = await testDescriptorsDAO.insertTestDescriptor(
            name, 
            procedureDescription, 
            idSKU
        );
        expect(newTD).toStrictEqual(true);
        res = await testDescriptorsDAO.getTestDescriptors();
        expect(res.length).toStrictEqual(1);

        expect(res[0].name).toStrictEqual(name);
        expect(res[0].procedureDescription).toStrictEqual(procedureDescription);
        expect(res[0].idSKU).toStrictEqual(idSKU);
    })
}

function testUpdateTestDescriptor(name, procedureDescription, idSKU, newName, newProcedureDescription, newIdSKU) {
    test("update test descriptors", async () => {
        let res = await testDescriptorsDAO.getTestDescriptors();
        expect(res.length).toStrictEqual(0);

        let newTD = await testDescriptorsDAO.insertTestDescriptor(
            name, 
            procedureDescription, 
            idSKU
        );
        expect(newTD).toStrictEqual(true);
        res = await testDescriptorsDAO.getTestDescriptors();
        expect(res.length).toStrictEqual(1);
        let lastId = res[0].id;

        res = await testDescriptorsDAO.updateTestDescriptor(lastId, newName, newProcedureDescription, newIdSKU);
        res = await testDescriptorsDAO.getTestDescriptors();
        expect(res.length).toStrictEqual(1);

        expect(res[0].id).toStrictEqual(lastId);
        expect(res[0].name).toStrictEqual(newName);
        expect(res[0].procedureDescription).toStrictEqual(newProcedureDescription);
        expect(res[0].idSKU).toStrictEqual(newIdSKU);
    })
}

function testDeleteTestDescriptor() {
    test("delete test descriptors", async () => {
        let res = await testDescriptorsDAO.getTestDescriptors();
        expect(res.length).toStrictEqual(0);

        let newTD = await testDescriptorsDAO.insertTestDescriptor(
            "name", 
            "procedureDescription", 
            2
        );
        expect(newTD).toStrictEqual(true);
        res = await testDescriptorsDAO.getTestDescriptors();
        expect(res.length).toStrictEqual(1);
        let lastId = res[0].id;
        
        res= await testDescriptorsDAO.deleteTestDescriptor(lastId);
        expect(res).toStrictEqual(true);

        res = await testDescriptorsDAO.getTestDescriptors();
        expect(res.length).toStrictEqual(0);
    })
}
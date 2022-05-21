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
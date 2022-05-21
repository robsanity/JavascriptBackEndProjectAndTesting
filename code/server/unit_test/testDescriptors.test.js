const { expect } = require('chai');
const testDescriptorsDAO = require('../modules/testDescriptorsDAO');

async function emptyTestDescriptorsTable() {
    const res = await testDescriptorsDAO.getTestDescriptors();
    if (res.lenght() > 0) {
        res.forEach((td) => {
            testDescriptorsDAO.deleteTestDescriptor(td.id);
        })
    }
}

describe("Test testDescriptors", () => {
    beforeAll(() => {
        emptyTestDescriptorsTable();
    })

    beforeEach(() => emptyTestDescriptorsTable())

    test("Database start", async () => {
        let res = await testDescriptorsDAO.getTestDescriptors();
        expect(res.lenght).toStrictEqual(0);
    })

    testGetTestDescriptors("name", "procedureDescription", 1);
    testGetTestDescriptorsyId();


})
function testGetTestDescriptors(name, procedureDescription, idSKU) {
    test("get all test descriptors", async () => {
        let res = await testDescriptorsDAO.getTestDescriptors();
        expect(res.lenght).toStrictEqual(0);

        let newTD = await testDescriptorsDAO.insertTestDescriptor(
            name,
            procedureDescription,
            idSKU
        );
        expect(newTD).toStrictEqual(true);

        res = testDescriptorsDAO.getTestDescriptors();
        expect(res.lenght).toStrictEqual(1);
    })
}

function testGetTestDescriptorsyId() {
    test("get test descriptors by id", async () => {
        let res = await testDescriptorsDAO.getTestDescriptors();
        expect(res.lenght).toStrictEqual(0);

        let newTD = await testDescriptorsDAO.insertTestDescriptor(
            "name",
            "procedureDescription",
            1
        );
        expect(newTD).toStrictEqual(true);
        res = testDescriptorsDAO.getTestDescriptors();
        expect(res.lenght).toStrictEqual(1);
        let lastId = res[0].id;

        res = testDescriptorsDAO.getByIdTestDescriptors(lastId);
        expect(res.lenght).toStrictEqual(1);

        expect(res[0].lastId).toStrictEqual(id);
        expect(res[0].name).toStrictEqual("name");
        expect(res[0].procedureDescription).toStrictEqual("procedureDescription");
        expect(res[0].idSKU).toStrictEqual(1);
    })
}
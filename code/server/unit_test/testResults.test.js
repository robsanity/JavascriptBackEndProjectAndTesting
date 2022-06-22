const SKUsDAO = require('../modules/SKUsDAO');
const testDescriptorsDAO = require('../modules/testDescriptorsDAO'); 
const testResultsDAO = require('../modules/testResultsDAO');
const SKUItemsDAO = require('../modules/SKUItemsDAO');

describe("Test testResults", () => {
    beforeAll(async () => {
        await testResultsDAO.deleteALLTestResult();
        await SKUsDAO.deleteDatas();
        await SKUItemsDAO.deleteALLSKUItems();
        await testDescriptorsDAO.deleteALLTestDescriptor();
        
    })

    beforeEach(async () => 
    await testResultsDAO.deleteALLTestResult());
    beforeEach(async () => 
    await await SKUsDAO.deleteDatas())
    beforeEach(async () => 
    await SKUItemsDAO.deleteALLSKUItems(),)
    beforeEach(async () => 
    await testDescriptorsDAO.deleteALLTestDescriptor());
    beforeEach(async () => 
    await SKUsDAO.createSKUWithOnlyId(1))
    beforeEach(async () => 
    await SKUItemsDAO.createSKUItem("11112222333311112222333311112222",1,"2022/02/24"));
    beforeEach(async () => 
    await testDescriptorsDAO.insertTestDescriptor("test1","procedure",1));

    test("Database start", async () => {
        let res = await testResultsDAO.getALLTestResults();
        expect(res.length).toStrictEqual(0);
    })

    testGetTestResults("11112222333311112222333311112222", 1, '2022/02/24', true);
    testGetByIdTestResults("11112222333311112222333311112222", 1, '2022/02/24', true);
    testCheckId();
    testCheckRFID();
    testInsertTestResult("11112222333311112222333311112222", 1, '2022/02/24', true);
    testUpdateTestResult("11112222333311112222333311112222", 1, '2022/02/24', true, 2, '2010/10/28', false);
    testUpdateIDResult(2,"11112222333311112222333311112222");
    testDeleteTestResult("11112222333311112222333311112222");


})

function testGetTestResults(rfid, idTestDescriptor, date, result) {
    test("get test results by rfid and by rfid&id", async () => {
        let res = await testResultsDAO.getALLTestResults();
        expect(res.length).toStrictEqual(0);

        let newTR = await testResultsDAO.insertTestResult(
            rfid,
            idTestDescriptor,
            date,
            result
        )
        expect(newTR).toStrictEqual(true);

        res = await testResultsDAO.getTestResults(rfid);
        expect(res.length).toStrictEqual(1);

    })
}

function testGetByIdTestResults(rfid, idTestDescriptor, date, result) {
    test("get test results by rfid and by rfid&id", async () => {
        let res = await testResultsDAO.getALLTestResults();
        expect(res.length).toStrictEqual(0);

        let newTR = await testResultsDAO.insertTestResult(
            rfid,
            idTestDescriptor,
            date,
            result
        )
        expect(newTR).toStrictEqual(true);

        res = await testResultsDAO.getTestResults(rfid);
        expect(res.length).toStrictEqual(1);
        let idTR = res[0].id;

        res = await testResultsDAO.getByIdTestResults(rfid, idTR);
        expect(res.length).toStrictEqual(1);

        res = await testResultsDAO.getByIdTestResults(rfid, idTR + 1);
        expect(res.length).toStrictEqual(0);

    })
}

function testCheckId() {
    test("check id", async () => {
        let res = await testResultsDAO.getALLTestResults();
        expect(res.length).toStrictEqual(0);

        let newTR = await testResultsDAO.insertTestResult(
            "11112222333311112222333311112222",
            1,
            '2022/02/24',
            true
        )
        expect(newTR).toStrictEqual(true);

        res = await testResultsDAO.getTestResults("11112222333311112222333311112222");
        expect(res.length).toStrictEqual(1);
        let idTR = res[0].id;

        res = await testResultsDAO.checkId(idTR);
        expect(res.length).toStrictEqual(1);

    })
}

function testCheckRFID() {
    test("check rfid", async () => {
        let res = await testResultsDAO.getALLTestResults();
        expect(res.length).toStrictEqual(0);

        let newTR = await testResultsDAO.insertTestResult(
            "11112222333311112222333311112222",
            1,
            '2022/02/24',
            true
        )
        expect(newTR).toStrictEqual(true);

        res = await testResultsDAO.checkRfid("11112222333311112222333311112222");
        expect(res.length).toStrictEqual(1);
    })
}

function testInsertTestResult(rfid, idTestDescriptor, date, result) {
    test("insert test result", async () => {
        let res = await testResultsDAO.getALLTestResults();
        expect(res.length).toStrictEqual(0);

        let newTR = await testResultsDAO.insertTestResult(
            rfid,
            idTestDescriptor,
            date,
            result
        )
        expect(newTR).toStrictEqual(true);

        res = await testResultsDAO.getALLTestResults();
        expect(res.length).toStrictEqual(1);
        let idTR = res[0].id;

        expect(res[0].id).toStrictEqual(idTR);
        expect(res[0].idTestDescriptor).toStrictEqual(idTestDescriptor);
        expect(res[0].date).toStrictEqual(date);
        expect(res[0].result).toStrictEqual(result);
    })
}

function testUpdateTestResult(rfid, idTestDescriptor, date, result, newIdTestDescriptor, newDate, newResult) {
    test("update test result", async () => {
        let res = await testResultsDAO.getALLTestResults();
        expect(res.length).toStrictEqual(0);

        let newTR = await testResultsDAO.insertTestResult(
            rfid,
            idTestDescriptor,
            date,
            result
        )
        expect(newTR).toStrictEqual(true);

        res = await testResultsDAO.getALLTestResults();
        expect(res.length).toStrictEqual(1);
        let idTR = res[0].id;

        res = await testResultsDAO.updateTestResults(idTR, rfid, newIdTestDescriptor, newDate, newResult)
        expect(res).toStrictEqual(true);

        res = await testResultsDAO.getALLTestResults();
        expect(res.length).toStrictEqual(1);
        expect(res[0].id).toStrictEqual(idTR);
        expect(res[0].idTestDescriptor).toStrictEqual(newIdTestDescriptor);
        expect(res[0].date).toStrictEqual(newDate);
        expect(res[0].result).toStrictEqual(newResult);
    })
}

function testUpdateIDResult(idResult,idSKUItem) {
    test("Update test result", async () => {
    let res = await testResultsDAO.getALLTestResults();
    
        expect(res.length).toStrictEqual(0);

        let newTR = await testResultsDAO.insertTestResult(
            "11112222333311112222333311112222",
            1,
            '2022/02/24',
            true
        )
        
        
        expect(newTR).toStrictEqual(true);
       
        
        await testResultsDAO.updateIDResult(idResult,idSKUItem);
        let k = await testResultsDAO.getALLTestResults();
        expect(k[0].id).toStrictEqual(2);
    })
}

function testDeleteTestResult(rfid) {
    test("delete test result", async () => {
        let res = await testResultsDAO.getALLTestResults();
        expect(res.length).toStrictEqual(0);

        let newTR = await testResultsDAO.insertTestResult(
            rfid,
            1,
            '2022/02/24',
            true
        )
        expect(newTR).toStrictEqual(true);

        res = await testResultsDAO.getALLTestResults();
        expect(res.length).toStrictEqual(1);
        let idTR = res[0].id;

        res = await testResultsDAO.deleteTestResult(rfid, idTR);
        expect(res).toStrictEqual(true);

        res = await testResultsDAO.getALLTestResults();
        expect(res.length).toStrictEqual(0);
    })
}
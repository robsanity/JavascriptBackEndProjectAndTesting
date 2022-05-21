const { expect } = require('chai');
const testResultsDAO = require('../modules/testResultsDAO');

async function emptyTestDescriptorTable() {
    const res = await testResultsDAO.getTestResults();
    if (res.lenght() > 0) {
        testResultsDAO.forEach((user) => {
            testResultsDAO.deleteUser(user.idUser);
        })
    }
}
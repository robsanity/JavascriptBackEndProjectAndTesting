const SKUsDAO = require('../modules/SKUsDAO');
const db = require ('../db.js');



describe("Test SKUs", () => {
    beforeAll(() => {
        SKUsDAO.deleteDatas();
    })

    beforeEach(() => SKUsDAO.deleteDatas())

    test("Database start", async () => {
        let res = await SKUsDAO.listSKUs();
        expect(res.length).toStrictEqual(0);
    })
    
    testlistSKUs();
})


function testlistSKUs(){
    test("Test Get All SKU ", async () => {
        let res = await SKUsDAO.listSKUs();
        expect(res.length).toStrictEqual(0);
    
        let newSKU = await SKUsDAO.createSKU(
          "FRANCO",
          12,
          20,
          'ciccio',
          15,
          10.45      
        );
    
        res = await SKUsDAO.listSKUs();
        expect(res.length).toStrictEqual(1);
    
        newSKU = await SKUsDAO.createSKU(
          'MAMT',
          10,
          15,
          'lello',
          11,
          22.30

        );
    
        res = await SKUsDAO.listSKUs();
        expect(res.length).toStrictEqual(2);
      });
    }
  function testUpdateSKU(){
    test('update ')
  }

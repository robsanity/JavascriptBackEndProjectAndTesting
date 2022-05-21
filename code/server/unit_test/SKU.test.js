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
    testUpdateSKU('allora',12,15,'ciaociao',72.5,88);
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
          'ciao',
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
  function testUpdateSKU(description,weight,volume,notes,price,availableQuantity){
    test('update SKU', async()=>{
      let z = await SKUsDAO.createSKU(
        'ciao',
          10,
          15,
          'lello',
          11,
          22.30
      );
      let fre = await SKUsDAO.listSKUs();
      expect(fre.length).toStrictEqual(1);
      await SKUsDAO.updateSKU(description,weight,volume,notes,price,availableQuantity,z);
      
      let es = await SKUsDAO.listSKUs();
      expect(es.length).toStrictEqual(1);
      let res = await SKUsDAO.findSKU(z);
      console.log(res);
      expect(res[0].availableQuantity).toStrictEqual(availableQuantity);
      expect(res[0].description).toStrictEqual(description);
      expect(res[0].weight).toStrictEqual(weight);
      expect(res[0].notes).toStrictEqual(notes);
      expect(res[0].price).toStrictEqual(price);
      expect(res[0].idSKU).toStrictEqual(z);      
    })

  }

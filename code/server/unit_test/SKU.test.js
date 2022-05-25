const SKUsDAO = require('../modules/SKUsDAO');
const db = require ('../db.js');
const positionsDAO = require('../modules/positionsDAO');







describe("Test SKUs", () => {
    beforeAll(async() => {
        await SKUsDAO.deleteDatas();
    })

    beforeEach(async() => await SKUsDAO.deleteDatas())

    test("Database start", async () => {
        let res = await SKUsDAO.listSKUs();
        expect(res.length).toStrictEqual(0);
    })
    
    testlistSKUs();
    testcreatesku("FRANCO",12,20,'ciccio',15,10.45);
    testFindSKU();
    testUpdateSKU('allora',12,15,'ciaociao',72.5,88);
    testupdatePosition(800211);
    testdelete();
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
  

  function testFindSKU(){
    test('find SKU', async()=>{
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
        let z  = res[0].idSKU;
        let k = await SKUsDAO.findSKU(z);
        expect(k).toStrictEqual(res);
    })
  }

  function testcreatesku(description, weight, volume, notes, availableQuantity, price){
    test('create sku test',async()=>{
    let res = await SKUsDAO.listSKUs();
        expect(res.length).toStrictEqual(0);
        let newSKU = await SKUsDAO.createSKU(description, weight, volume, notes, availableQuantity, price);
        
    
        res = await SKUsDAO.listSKUs();
        expect(res.length).toStrictEqual(1);
        expect(res[0].idSKU).toStrictEqual(newSKU);
        expect(res[0].description).toStrictEqual(description);
        expect(res[0].weight).toStrictEqual(weight);
        expect(res[0].volume).toStrictEqual(volume);
        expect(res[0].notes).toStrictEqual(notes);
        expect(res[0].availableQuantity).toStrictEqual(availableQuantity);
        expect(res[0].price).toStrictEqual(price);
    })
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

      expect(res[0].availableQuantity).toStrictEqual(availableQuantity);
      expect(res[0].description).toStrictEqual(description);
      expect(res[0].weight).toStrictEqual(weight);
      expect(res[0].notes).toStrictEqual(notes);
      expect(res[0].price).toStrictEqual(price);
      expect(res[0].idSKU).toStrictEqual(z);      
    })

  }


  function testupdatePosition(idposition){
    test('update position test', async()=>{
      let newsku = await SKUsDAO.createSKU(
        'ciao',
          10,
          15,
          'lello',
          11,
          22.30
      );
      await SKUsDAO.deleteDatasfromPositions();
      let newPosition = await SKUsDAO.createPositionforSKU(800211,12,3,3,50,50);
      let z = await SKUsDAO.listSKUs();
      expect(z.length).toStrictEqual(1);
      let idposition = newPosition;
      let idsku = newsku;
      await SKUsDAO.updatePosition(idposition,idsku,idsku,idsku,idposition,idsku,idsku,idsku,idposition);
      let res = await SKUsDAO.findSKU(idsku);

      let respos = await positionsDAO.checkPosition(idposition)
      
      expect(res[0].idPosition).toStrictEqual(idposition);
      expect(res[0].weight).toStrictEqual(respos[0].occupiedWeight);
      expect(res[0].volume).toStrictEqual(respos[0].occupiedVolume);
      
    })
  }


  function testdelete(){
    test('delete sku', async()=>{
      let z = await SKUsDAO.createSKU(
        'ciao',
          10,
          15,
          'lello',
          11,
          22.30
      );
    
    let gigi = await SKUsDAO.listSKUs();
    expect(gigi.length).toStrictEqual(1);
    await SKUsDAO.deleteSKU(z);
    let fre2 = await SKUsDAO.listSKUs();
    expect(fre2.length).toStrictEqual(0);
  });
}

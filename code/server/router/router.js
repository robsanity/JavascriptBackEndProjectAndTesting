'use strict';
const testDescriptorsDAO = require('../modules/testDescriptorsDAO');
const testResultsDAO = require('../modules/testResultsDAO');
const usersDAO = require('../modules/usersDAO');
const restockOrdersDAO = require('../modules/restockOrdersDAO');
const SKUsDAO = require('../modules/SKUsDAO');
const SKUItemsDAO = require('../modules/SKUItemsDAO');
const itemsDAO = require('../modules/itemsDAO');
const positionsDAO = require('../modules/positionsDAO');
const returnOrdersDAO = require('../modules/returnOrdersDAO');
const internalOrdersDAO = require('../modules/internalOrdersDAO');
const dayjs = require('dayjs');
var express = require('express');
var router = express.Router();


//------------------------------------------------------------------------------------------------
//                                     SKU
//------------------------------------------------------------------------------------------------

//Return an array containing all SKUs.
router.get('/api/skus', async (req, res) => {
  try {
    const listSKUs = await SKUsDAO.listSKUs();
    return res.status(200).json(listSKUs);
  }
  catch (error) {
    return res.status(500).json(error);
  }
});

//Ritorna array di SKU con status 200






//Return a SKU, given its id.
router.get('/api/skus/:id', async (req, res) => {

  if (req.params.id === undefined || req.params.id == '' || isNaN(req.params.id))
    return res.status(422).end();


  try {
    const SKU = await SKUsDAO.findSKU(req.params.id)


    if (SKU.length === 0) {
      return res.status(404).end();
    }

    return res.status(200).json(SKU);

  }
  catch (error) {
    res.status(500).json(error);
  }
});

//Se id è vuoto/non un numero torna 422
//Se SKU === null torna 404 ma bisogna implementare il "return null;" in SKUsDAO
//Altrimenti torna oggetto con status 200






//Creates a new SKU with an empty array of testDescriptors.
router.post('/api/sku', async (req, res) => {
  if (req.body.description === undefined || req.body.weight === undefined || req.body.volume === undefined || req.body.notes === undefined || req.body.price === undefined || req.body.availableQuantity === undefined)
    return res.status(422).end();


  //Ricavo gli attributi necessari a creare una nuova SKU e li passo a createSKU
  let description = req.body.description;
  let weight = req.body.weight;
  let volume = req.body.volume;
  let notes = req.body.notes;
  let price = req.body.price;
  let availableQuantity = req.body.availableQuantity;

  try {
    await SKUsDAO.createSKU(description, weight, volume, notes, availableQuantity, price);
    return res.status(201).end();
  }
  catch (error) {
    return res.status(503).json(error);
  }

});

//Funzionante, ritorna 201 se oggetto creato
//In mancanza dei uno dei campi richiesti torna 422




//Modify an existing SKU. When a newAvailableQuantity is sent, occupiedWeight and occupiedVolume fields of the position 
//(if the SKU is associated to a position) are modified according to the new available quantity.
router.put('/api/sku/:id', async (req, res) => {
  if (req.params.id === undefined || req.params.id == '' || isNaN(req.params.id) || req.body.description === undefined || req.body.weight === undefined || req.body.volume === undefined || req.body.notes === undefined || req.body.price === undefined || req.body.availableQuantity === undefined) {
    return res.status(422).end();
  }
  //Come implementare:
  //if with newAvailableQuantity position is not capable enough in weight or in volume --> Error 422
  let description = req.body.description;
  let weight = req.body.weight;
  let volume = req.body.volume;
  let notes = req.body.notes;
  let price = req.body.price;
  let availableQuantity = req.body.availableQuantity;

  try {
    let found = await SKUsDAO.updateSKU(description, weight, volume, notes, price, availableQuantity, req.params.id/*, req.params.id, req.params.id, req.params.id*/);
    if (found.length === 0) {
      return res.status(404).end();
    }

    return res.status(200).end();

  }
  catch (error) {
    return res.status(503).json(error);
  }
});


//Add or modify position of a SKU. When a SKU is associated to a position, occupiedWeight and occupiedVolume fields of the position
//are modified according to the available quantity.
router.put('/api/sku/:id/position', async (req, res) => {
  if (req.body.position === undefined || req.params.id === undefined || req.params.id == '' || isNaN(req.params.id))
    return res.status(422).end();

  //Come implementare:   422 Unprocessable Entity (position isn't capable to satisfy volume and weight constraints for available quantity of sku or position is already assigned to a sku)
  try {
    await SKUsDAO.updatePosition(req.body.position, req.params.id, req.params.id, req.params.id, req.body.position, req.params.id, req.params.id, req.params.id, req.body.position);
    return res.status(200).end();
  }
  catch (error) {
    return res.status(503).json(error);
  }
});

//Delete a SKU receiving its id.
router.delete('/api/skus/:id', async (req, res) => {

  if (req.params.id === undefined || req.params.id == '' || isNaN(req.params.id))
    return res.status(422).end();

  try {
    await SKUsDAO.deleteSKU(req.params.id);
    return res.status(204).end();
  }
  catch (error) {
    return res.status(503).json(error);
  }
});


//Funzionante, ritorna 204 se SKU è stato eliminato
//ritorna 204 anche se l'id non esiste


//------------------------------------------------------------------------------------------------
//                                     SKU Items
//------------------------------------------------------------------------------------------------


//Return an array containing all SKU items
router.get('/api/skuitems', async (req, res) => {

  try {
    const listSKUItems = await SKUItemsDAO.listSKUItems();
    return res.status(200).json(listSKUItems);
  }
  catch (error) {
    return res.status(500).json(error);
  }

});

//Return an array containing all SKU items for a certain SKUId with Available = 1.
router.get('/api/skuitems/sku/:id', async (req, res) => {

  if (req.params.id === undefined || req.params.id == '' || isNaN(req.params.id))
    return res.status(422).end();

  try {
    const SKUItemsAvailable = await SKUItemsDAO.findSKUItems(req.params.id);
    if (SKUItemsAvailable.length === 0) {
      return res.status(404).end();
    }
    else {
      return res.status(200).json(SKUItemsAvailable);
    }

  }
  catch (error) {
    return res.status(500).json(error);
  }

});
//Funzionante




//Return a SKU item, given its RFID.
router.get('/api/skuitems/:rfid', async (req, res) => {

  if (req.params.rfid === undefined || req.params.rfid == '' || isNaN(req.params.rfid)) {
    return res.status(422).end();
  }
  try {
    const SKUItem = await SKUItemsDAO.findSKUItem(req.params.rfid);
    if (SKUItem.length === 0) {
      return res.status(404).end();
    }
    else {
      return res.status(200).json(SKUItem)
    }

  } catch (error) {
    return res.status(500).json(error);
  }

});

//Funzionante






//Creates a new SKU item with Available =0.
router.post('/api/skuitem', async (req, res) => {
  if (req.body.RFID === null || req.body.SKUId === null)
    return res.status(422).end();


  try {
    await SKUItemsDAO.createSKUItem(req.body.RFID, req.body.SKUId, req.body.DateOfStock);
    return res.status(201).end();
  }
  catch (error) {
    return res.status(500).json(error);
  }
});

//Ora Funzionante, ricordarsi che in input della richiesta la data bisogna scriverla "YYYY-DD-MM"



//Modify RFID, available and date of stock fields of an existing SKU Item.
router.put('/api/skuitems/:rfid', async (req, res) => {
  if (req.params.rfid === undefined || req.params.rfid == '' || isNaN(req.params.rfid))
    return res.status(422).end();

  let checkSKUItems = await SKUItemsDAO.findSKUItem(req.params.rfid);
  if (checkSKUItems.length === 0) {
    return res.status(404).end();
  }
  else {

    try {
      await SKUItemsDAO.modifySKUItem(req.body.newRFID, req.body.newAvailable, req.body.newDateOfStock, req.params.rfid);

      return res.status(200).end();
    }
    catch (error) {
      return res.status(500).json(error);
    }
  }
});

//Ora funzionante, ricordarsi che in input della richiesta la data bisogna scriverla "YYYY-DD-MM"






//Delete a SKU item receiving his rfid.
router.delete('/api/skuitems/:rfid', async (req, res) => {
  if (req.params.rfid === undefined || req.params.rfid == '' || isNaN(req.params.rfid))
    return res.status(422).end();

  try {
    const SKU = await SKUItemsDAO.deleteSKUItem(req.params.rfid);
    return res.status(204).end();
  }
  catch (error) {
    return res.status(503).json(error);
  }
});

//Funzionante

//------------------------------------------------------------------------------------------------
//                                     Positions
//------------------------------------------------------------------------------------------------



//Return an array containing all positions.
router.get('/api/positions', async (req, res) => {

  try {
    const listPositions = await positionsDAO.listPositions();
    return res.status(200).json(listPositions);
  } catch (error) {
    return res.status(500).json(error);
  }

});

//FUNZIONANTE





//Creates a new Position.
router.post('/api/position', async (req, res) => {

  if (req.body.positionID === null || req.body.aisleID === null || req.body.row === null || req.body.col === null || req.body.maxWeight === null || req.body.maxVolume === null)
    return res.status(422).end();

  try {
    let z = await positionsDAO.createPositions(req.body.positionID, req.body.aisleID, req.body.row, req.body.col, req.body.maxWeight, req.body.maxVolume);
    return res.status(201).end();
  }
  catch (error) {
    return res.status(503).json(error);
  }

});

//FUNZIONANTE





//Modify a position identified by positionID.
router.put('/api/position/:positionID', async (req, res) => {

  if (req.body.newAisleID === null
    || req.body.newRow === null || req.body.newCol === null
    || req.body.newMaxWeight === null || req.body.newMaxVolume === null
    || req.body.newOccupiedWeight === null || req.body.newOccupiedVolume === null
    || req.params.positionID === undefined || req.params.positionID == ''
    || isNaN(req.params.positionID))
    return res.status(422).end();

  let checkPosition = await positionsDAO.checkPosition(req.params.positionID);
  if (checkPosition.length === 0) {
    res.status(404).end();
    return;
  }
  try {
    await positionsDAO.modifyPosition(req.params.positionID, req.body.newAisleID, req.body.newRow, req.body.newCol, req.body.newMaxWeight, req.body.newMaxVolume, req.body.newOccupiedWeight, req.body.newOccupiedVolume);
    return res.status(200).end();
  }
  catch (error) {
    return res.status(503).json(error);
  }
});

//FUNZIONANTE




//Modify the positionID of a position, given its old positionID.
router.put('/api/position/:positionID/changeID', async (req, res) => {

  if (req.body.newPositionID === null
    || req.params.positionID === undefined || req.params.positionID == ''
    || isNaN(req.params.positionID))
    return res.status(422).end();

  let checkOldPosition = await positionsDAO.checkPosition(req.params.positionID);
  if (checkOldPosition.length === 0) {
    return res.status(404).end();
  }

  let checkNewPosition = await positionsDAO.checkPosition(req.body.newPositionID);
  if (checkNewPosition.length !== 0) {
    return res.status(422).end();
  }

  try {
    await positionsDAO.modifyPositionID(req.params.positionID, req.body.newPositionID);
    return res.status(200).end();
  }
  catch (error) {
    return res.status(503).json(error);
  }
});

//FUNZIONANTE MA DA RICONTROLLARE



//Delete a SKU item receiving his positionID.
router.delete('/api/position/:positionID', async (req, res) => {

  if (req.params.positionID === undefined || req.params.positionID == '' || isNaN(req.params.positionID))
    return res.status(422).end();

  let checkPosition = await positionsDAO.checkPosition(req.params.positionID);

  if (checkPosition.length === 0) {
    return res.status(422).end();
  }
  else {
    try {
      await positionsDAO.deletePosition(req.params.positionID);
      return res.status(204).end();
    }
    catch (error) {
      return res.status(503).json(error);
    }
  }

});
//FUNZIONANTE





//------------------------------------------------------------------------------------------------
//                                      TEST DESCRIPTOR
//------------------------------------------------------------------------------------------------

//--------------------------------------|   GET   |------------------------------------------------
router.get('/api/testDescriptors', async (req, res) => {
  try {
    let listTestDescriptors = await testDescriptorsDAO.getTestDescriptors();
    return res.status(200).json(listTestDescriptors)
  } catch (error) {
    return res.status(500).json();
  }
});
//FUNZIONANTE





router.get('/api/testDescriptors/:id', async (req, res) => {

  try {
    let id = req.params.id;
    if (id === undefined || id == '' || isNaN(id))
      return res.status(422).end();

    let testDescriptor = await testDescriptorsDAO.getByIdTestDescriptors(id);

    if (testDescriptor.length === 0) {
      return res.status(404).end();
    }

    return res.status(200).json(testDescriptor)


  }
  catch (error) {
    res.status(500).json();
  }
});
//FUNZIONANTE






//--------------------------------------|   POST   |------------------------------------------------
router.post('/api/testDescriptor', async (req, res) => {
  try {
    let name = req.body.name;
    let procedureDescription = req.body.procedureDescription;
    let idSKU = req.body.idSKU;

    if (name === undefined || name == '' ||
      procedureDescription === undefined || procedureDescription == '' ||
      idSKU === undefined || idSKU == '' || isNaN(idSKU)) {
      return res.status(422).end();
    }

    let sku = await SKUsDAO.findSKU(idSKU);

    if (sku.length === 0) {
      return res.status(404).end();
    }

    await testDescriptorsDAO.insertTestDescriptor(name, procedureDescription, idSKU);
    return res.status(201).end();

  }
  catch (error) {
    return res.status(503).end();
  }
});
//FUNZIONANTE









//--------------------------------------|   PUT   |------------------------------------------------
router.put('/api/testDescriptor/:id', async (req, res) => {

  try {
    let id = req.params.id;
    if (id === undefined || id == '' || isNaN(id)) {
      return res.status(422).end();
    }

    let newName = req.body.newName;
    let newProcedureDescription = req.body.newProcedureDescription;
    let newIdSKU = req.body.newIdSKU;

    if (newName === undefined || newName == '' ||
      newProcedureDescription === undefined || newProcedureDescription == '' ||
      newIdSKU === undefined || newIdSKU == '' || isNaN(newIdSKU))
      return res.status(422).end();

    let td = await testDescriptorsDAO.getByIdTestDescriptors(id);
    let sku = await SKUsDAO.findSKU(newIdSKU)

    if (td.length == 0 || sku.length == 0) {
      return res.status(404).end();
    }

    await testDescriptorsDAO.updateTestDescriptor(id, newName, newProcedureDescription, newIdSKU);
    return res.status(200).end();

  }
  catch (error) {
    return res.status(503).end()
  }
});

//FUNZIONANTE



//--------------------------------------|   DELETE   |------------------------------------------------
router.delete('/api/testDescriptor/:id', async (req, res) => {

  try {
    let id = req.params.id;
    if (id === undefined || id == '' || isNaN(id))
      return res.status(422).end();

    let td = await testDescriptorsDAO.getByIdTestDescriptors(id);

    if (td.length === 0) {
      return res.status(422).end();
    }

    await testDescriptorsDAO.deleteTestDescriptor(id);
    return res.status(204).end();

  }
  catch (error) {
    res.status(503).end();
  }

});
//FUNZIONANTE





//------------------------------------------------------------------------------------------------
//                                      TEST RESULT
//------------------------------------------------------------------------------------------------

//--------------------------------------|   GET   |-----------------------------------------------
router.get('/api/skuitems/:rfid/testResults', async (req, res) => {

  try {
    let rfid = req.params.rfid;
    if (rfid === undefined || rfid === '' || isNaN(rfid)) {

      return res.status(422).end();
    }

    let checkRfid = await testResultsDAO.checkRfid(rfid);
    if (checkRfid.length === 0) {
      return res.status(404).end()
    }
    else {
      const listTestResults = await testResultsDAO.getTestResults(rfid);
      return res.status(200).json(listTestResults).end();
    }
  }
  catch (error) {
    return res.status(500).json({ error: error }).end();

  }
})
//FUNZIONANTE



router.get('/api/skuitems/:rfid/testResults/:id', async (req, res) => {
  try {
 
    let rfid = req.params.rfid;
    let id = req.params.id;
    if (rfid === undefined || rfid === '' || isNaN(rfid) ||
      id === undefined || id === '' || isNaN(id)) {
      return res.status(422).end();
    }

    let checkRfid = await testResultsDAO.checkRfid(rfid);
    if (checkRfid.length === 0) {
      return res.status(404).end()
    }

    let checkId = await testResultsDAO.checkId(id);
    if (checkId.length === 0) {
      return res.status(404).end()
    }

    const listTestResults = await testResultsDAO.getByIdTestResults(rfid, id);
    return res.status(200).json(listTestResults)
  }
  catch (error) {
    return res.status(500).json();
  }
})
//FUNZIONANTE 




//--------------------------------------|   POST   |------------------------------------------------
router.post('/api/skuitems/testResult', async (req, res) => {
  try {

    let rfid = req.body.rfid;
    let idTestDescriptor = req.body.idTestDescriptor;
    let date = req.body.Date;
    let result = req.body.Result;

    if (rfid === undefined || rfid == '' ||
      idTestDescriptor === undefined || idTestDescriptor == '' || isNaN(idTestDescriptor) ||
      date === undefined || date == '' ||
      !(result == true || result == false)) {

      return res.status(422).end();
    }

    //controllo in skuitems perchè inserisco un sku item che dovrebbe essere già in mio possesso
    let checkRfid = await SKUItemsDAO.findSKUItem(rfid);
    if (checkRfid.length === 0) {
      return res.status(404).end()
    }

    let checkTD = await testDescriptorsDAO.getByIdTestDescriptors(idTestDescriptor);
    if (checkTD.length === 0) {
      return res.status(404).end()
    }

    let checkTR = await testResultsDAO.getByIdTestResults(rfid, idTestDescriptor);
    if (checkTR.length !== 0) {
      return res.status(422).end()
    }

    await testResultsDAO.insertTestResult(rfid, idTestDescriptor, date, result);
    return res.status(201).end();
  }
  catch (error) {
    return res.status(503).end();
  }
});
//FUNZIONANTE





//--------------------------------------|   PUT   |------------------------------------------------
router.put('/api/skuitems/:rfid/testResult/:id', async (req, res) => {
  try {

    let rfid = req.params.rfid;
    let id = req.params.id;
    console.log(id);
    if (rfid === undefined || rfid === '' || isNaN(rfid) ||
      id === undefined || id === '' || isNaN(id)) {
      return res.status(422).end();
    }

    let newIdTestDescriptor = req.body.newIdTestDescriptor;
    let newDate = req.body.newDate;
    let newResult = req.body.newResult;

    if (newIdTestDescriptor === undefined || newIdTestDescriptor === '' || isNaN(newIdTestDescriptor) ||
      newDate === undefined || newDate === '' ||
      !(newResult == true || newResult == false)) {
      return res.status(422).end();
    }

    let td = await testResultsDAO.getByIdTestResults(id,rfid);
    let ntd = await testDescriptorsDAO.getByIdTestDescriptors(newIdTestDescriptor);
    //per inserire un test result devo avere in possesso sku item
    let sku = await SKUItemsDAO.findSKUItem(rfid);
    if (td.length == 0 || sku.length === 0 || ntd.length === 0) {
      return res.status(404).end();
    }
  
    await testResultsDAO.updateTestResults(id, rfid, newIdTestDescriptor, newDate, newResult);
    return res.status(200).end();
  }
  catch (error) {
    return res.status(503).end()
  }
});






//--------------------------------------|   DELETE   |------------------------------------------------
router.delete('/api/skuitems/:rfid/testResult/:id', async (req, res) => {
  try {
    let rfid = req.params.rfid;
    let id = req.params.id;
    if (rfid === undefined || rfid === '' || isNaN(rfid) ||
      id === undefined || id === '' || isNaN(id)) {
      return res.status(422).end();
    }

    let tr = await testResultsDAO.getByIdTestResults(rfid, id);

    if (tr.length === 0) {
      return res.status(422).end();
    }

    await testResultsDAO.deleteTestResult(rfid, id);
    return res.status(204).end();
  }
  catch (error) {
    return res.status(503).end();
  }

});

//FUNZIONA

//------------------------------------------------------------------------------------------------
//                                       USER
//------------------------------------------------------------------------------------------------

//--------------------------------------|   GET   |------------------------------------------------
router.get('/api/suppliers', async (req, res) => {
  try {
    const suppliers = await usersDAO.getSuppliers();
    return res.status(200).json(suppliers)
  } catch (error) {
    return res.status(500).json();
  }
});
//FUNZIONANTE

router.get('/api/users', async (req, res) => {
  try {
    const users = await usersDAO.getUsers();
    return res.status(200).json(users)
  } catch (error) {
    console.log(error)
    return res.status(500).json();
  }
});
//FUNZIONANTE




//--------------------------------------|   POST   |------------------------------------------------
router.post('/api/newUser', async (req, res) => {
  try {

    let username = req.body.username
    let name = req.body.name;
    let surname = req.body.surname;
    let type = req.body.type;
    let pass = req.body.password;

    if (username === undefined || username == '' ||
      name === undefined || name == '' ||
      surname === undefined || surname == '' ||
      type === undefined || type == '' || !(type === "customer" || type === "qualityEmployee" || type === "clerk" || type === "deliveryEmployee" || type === "supplier") ||
      pass === undefined || pass == '' || pass.length < 8) {
      return res.status(422).end();
    }

    let user = await usersDAO.checkUser(username, type);
    if (user.length !== 0) {
      return res.status(409).end();
    }

    await usersDAO.insertUser(username, name, surname, type, pass);
    return res.status(201).end();

  }
  catch (error) {
    return res.status(503).end();
  }
});
//FUNZIONANTE

router.post('/api/managerSessions', async (req, res) => {
  try {

    let username = req.body.username
    let password = req.body.password;

    let manager = await usersDAO.login(username, password, 'manager');
    if (manager.length != 0)
      return res.status(200).json(manager);
    else
      return res.status(401).end();
  }
  catch (error) {
    return res.status(500).end();
  }
});


router.post('/api/customerSessions', async (req, res) => {
  try {

    let username = req.body.username
    let password = req.body.password;

    let customer = await usersDAO.login(username, password, 'customer');
    if (customer.length != 0)
      return res.status(200).json(customer);
    else
      return res.status(401).end();
  }
  catch (error) {
    return res.status(500).end();
  }
});

router.post('/api/supplierSessions', async (req, res) => {
  try {

    let username = req.body.username
    let password = req.body.password;

    let supplier = await usersDAO.login(username, password, 'supplier');
    if (supplier.length != 0)
      return res.status(200).json(supplier);
    else
      return res.status(401).end();
  }
  catch (error) {
    return res.status(500).end();
  }
});

router.post('/api/clerkSessions', async (req, res) => {
  try {

    let username = req.body.username
    let password = req.body.password;

    let clerk = await usersDAO.login(username, password, 'clerk');
    if (clerk.length != 0)
      return res.status(200).json(clerk);
    else
      return res.status(401).end();
  }
  catch (error) {
    return res.status(500).end();
  }
});

router.post('/api/qualityEmployeeSessions', async (req, res) => {
  try {

    let username = req.body.username
    let password = req.body.password;

    let qualityE = await usersDAO.login(username, password, 'qualityEmployee');
    if (qualityE.length != 0)
      return res.status(200).json(qualityE);
    else
      return res.status(401).end();
  }
  catch (error) {
    return res.status(500).end();
  }
});

router.post('/api/deliveryEmployeeSessions', async (req, res) => {
  try {

    let username = req.body.username
    let password = req.body.password;

    let deliveryE = await usersDAO.login(username, password, 'deliveryEmployee');
    if (deliveryE.length != 0)
      return res.status(200).json(deliveryE);
    else
      return res.status(401).end();
  }
  catch (error) {
    return res.status(500).end();
  }
});


//--------------------------------------|   PUT   |-------------------------------------------------
router.put('/api/users/:username', async (req, res) => {
  try {

    let username = req.params.username;
    if (username === undefined || username === '') {
      return res.status(422).end();
    }

    let oldType = req.body.oldType;
    let newType = req.body.newType;

    if (!(oldType === "customer" || oldType === "qualityEmployee" || oldType === "clerk" || oldType === "deliveryEmployee" || oldType === "supplier") ||
      !(newType === "customer" || newType === "qualityEmployee" || newType === "clerk" || newType === "deliveryEmployee" || newType === "supplier")) {
        return res.status(422).end();
    }

    let userWithOldType = await usersDAO.checkUser(username, oldType);

    if (userWithOldType.length === 0 ) {
      return res.status(404).end();
    }


    await usersDAO.updateUser(username, oldType, newType);
    return res.status(200).end();

  }
  catch (error) {

    return res.status(503).end()
  }
});
//FUNZIONANTE

//--------------------------------------|   DELETE   |----------------------------------------------
router.delete('/api/users/:username/:type', async (req, res) => {
  try {
    let username = req.params.username;
    let oldType = req.params.type;
    if (username === undefined || username === '' ||
      oldType === undefined || oldType == '' || !(oldType === "customer" || oldType === "qualityEmployee" || oldType === "clerk" || oldType === "deliveryEmployee" || oldType === "supplier")) {
        return res.status(422).end();
    }


    await usersDAO.deleteUser(username, oldType);
    return res.status(204).end();

  }
  catch (error) {
    return res.status(503).end();
  }

});


// FUNZIONANTE




//------------------------------------------------------------------------------------------------
//                                      RESTOCK ORDERS
//------------------------------------------------------------------------------------------------
//--------------------------------------|   GET   |------------------------------------------------
router.get('/api/restockOrders', async (req, res) => {
  try {
    let restockList = await restockOrdersDAO.getRestockList();
    let listProducts = await restockOrdersDAO.getProducts();
    let listSkuItems = await restockOrdersDAO.getSkuItems();

    let restockOrders =
      restockList.map(
        (ro) => ({
          id: ro.id,
          issueDate: ro.issueDate,
          state: ro.state,
          products:
            listProducts
              .filter((p) => p.id == ro.id)
              .map(element => ({
                SKUId: element.SKUId,
                description: element.description,
                price: element.price,
                qty: element.qty
              })),
          supplierId: ro.supplierId,
          transportNote: (ro.state == 'ISSUED' ? {} : { deliveryDate: ro.transportNote }),
          skuItems: ((ro.state == 'ISSUED') ? {} :
            listSkuItems
              .filter((si) => si.id == ro.id)
              .map(element => ({
                SKUId: element.SKUId,
                rfid: element.rfid
              }))
          )
        })
      )



    return res.status(200).json(restockOrders)
  } catch (error) {
    return res.status(500).json();
  }
});

router.get('/api/restockOrdersIssued', async (req, res) => {
  try {
    let restockList = await restockOrdersDAO.getRestockList();
    let listProducts = await restockOrdersDAO.getProducts();
    let listSkuItems = await restockOrdersDAO.getSkuItems();

    let restockOrders =
      restockList.map(
        (ro) => ({
          id: ro.id,
          issueDate: ro.issueDate,
          state: ro.state,
          products:
            listProducts
              .filter((p) => p.id == ro.id)
              .map(element => ({
                SKUId: element.SKUId,
                description: element.description,
                price: element.price,
                qty: element.qty
              })),
          supplierId: ro.supplierId,
          transportNote: (ro.state == 'ISSUED' ? {} : { deliveryDate: ro.transportNote }),
          skuItems: ((ro.state == 'ISSUED') ? {} :
            listSkuItems
              .filter((si) => si.id == ro.id)
              .map(element => ({
                SKUId: element.SKUId,
                rfid: element.rfid
              }))
          )
        })
      )
    let restockOrdersListIssued = restockOrders.filter((e) => e.state == 'ISSUED');

    return res.status(200).json(restockOrdersListIssued);
  } catch (error) {
    return res.status(500).json();
  }
});

router.get('/api/restockOrders/:id', async (req, res) => {
  try {


    let id = req.params.id;
    if (id === undefined || id === '' || isNaN(id)) {
      return res.status(422).end();
    }

    let rO = await restockOrdersDAO.getByIdRestockOrders(id);
    if (rO.length === 0) {
      return res.status(404).end();
    }

    let restockList = await restockOrdersDAO.getRestockList();
    let listProducts = await restockOrdersDAO.getProducts();
    let listSkuItems = await restockOrdersDAO.getSkuItems();

    let restockOrders =
      restockList.map(
        (ro) => ({
          id: ro.id,
          issueDate: ro.issueDate,
          state: ro.state,
          products:
            listProducts
              .filter((p) => p.id == ro.id)
              .map(element => ({
                SKUId: element.SKUId,
                description: element.description,
                price: element.price,
                qty: element.qty
              })),
          supplierId: ro.supplierId,
          transportNote: (ro.state == 'ISSUED' ? {} : { deliveryDate: ro.transportNote }),
          skuItems: ((ro.state == 'ISSUED') ? {} :
            listSkuItems
              .filter((si) => si.id == ro.id)
              .map(element => ({
                SKUId: element.SKUId,
                rfid: element.rfid
              }))
          )
        })
      )
    let restockOrdersById = restockOrders.filter((e) => e.id == id);
    return res.status(200).json(restockOrdersById)

  } catch (error) {
    return res.status(500).json();
  }
});

router.get('/api/restockOrders/:id/returnItems', async (req, res) => {
  try {

    let id = req.params.id;
    if (id === undefined || id === '' || isNaN(id)) {
      return res.status(422).end();
    }

    let rO = await restockOrdersDAO.getByIdRestockOrders(id);
    if (rO.length === 0) {
      return res.status(404).end();
    }
    if (rO.state != 'COMPLETEDRETURN') {
      return res.status(422).end();
    }

    let restockOrdersListIssued = await restockOrdersDAO.getToBeReturnRestockOrders(id);
    return res.status(200).json(restockOrdersListIssued)

  } catch (error) {
    return res.status(500).json();
  }
})
//--------------------------------------|   POST   |------------------------------------------------
router.post('/api/restockOrder', async (req, res) => {
  try {
    if (req.body.issueDate === undefined
      || req.body.products === undefined
      || req.body.supplierId === undefined){
      return res.status(422).end();
    }

    let issueDate = req.body.issueDate;
    let products = req.body.products;
    let supplierId = req.body.supplierId;


    if (await usersDAO.findUser(supplierId) != true) {
      return res.status(422).end();
    }

    let idRestockOrder = await restockOrdersDAO.insertRO(issueDate, supplierId);
    let idItem = 0;
    for (let p of products) {
      idItem = await restockOrdersDAO.insertI(p.SKUId, p.description, p.price, supplierId);
      await restockOrdersDAO.insertROI(idRestockOrder, idItem, p.qty);
    }
    return res.status(201).end();

  }
  catch (error) {
console.log(error)
    return res.status(500).end();
  }
})

//--------------------------------------|   PUT   |-------------------------------------------------
router.put('/api/restockOrder/:id', async (req, res) => {
  try {

    let id = req.params.id;
    if (id === undefined || id == '' || isNaN(id)) {
      return res.status(422).end();
    }

    let newState = req.body.newState;
    if (newState === undefined || newState == '') {
      return res.status(422).end();
    }

    let rO = await restockOrdersDAO.getByIdRestockOrders(id);
    if (rO.length == 0) {
      return res.status(404).end();
    }

    await restockOrdersDAO.putStateRestockOrder(id, newState);
    return res.status(200).end();
  }
  catch (error) {
    res.status(503).end();
  }
});

router.put('/api/restockOrder/:id/skuItems', async (req, res) => {
  try {

    let id = req.params.id;
    if (id === undefined || id == '' || isNaN(id)) {
      return res.status(422).end();
    }

    let skuItems = req.body.skuItems;
    console.log(skuItems);
    if (skuItems === undefined || skuItems === '' || skuItems.length === 0) {
      return res.status(422).end();
    }

    let rO = await restockOrdersDAO.getByIdRestockOrders(id);
    if (rO.length == 0) {
      return res.status(404).end();
    }
    if (rO[0].state != 'DELIVERED') {

      return res.status(422).end();
    }


    let checkSKUs;
    let checkSKUItems;
    //controlli per crezione / inseirmento skus e skuitems
    for (let si of skuItems) {
      /*checkSKUs = await SKUsDAO.findSKU(si.SKUId);
      if (checkSKUs.length == 0) {
        await SKUsDAO.createSKUWithOnlyId(si.SKUId);
      }*/
      checkSKUItems = await SKUItemsDAO.findSKUItem(si.rfid)
      if (checkSKUItems != 0) {
        return res.status(422).end();   //se presente RFID non univoco
      }
      else {
        console.log(si.rfid, si.SKUId);
        await SKUItemsDAO.createSKUItemNoDate(si.rfid, si.SKUId)
      }
    }

    for (let si of skuItems) {
      await restockOrdersDAO.putSkuItemsOfRestockOrder(id, si.rfid, si.SKUId);
    }


    return res.status(200).end();
  }
  catch (error) {
    console.log(error);
    return res.status(503).end();
  }
});


router.put('/api/restockOrder/:id/transportNote', async (req, res) => {
  try {

    let id = req.params.id;
    if (id === undefined || id == '' || isNaN(id)) {
      return res.status(422).end();
    }

    let transportNote = req.body.transportNote;
    if (transportNote === undefined || transportNote == '') {
      return res.status(422).end();
    }

    let rO = await restockOrdersDAO.getByIdRestockOrders(id);
    if (rO.length == 0) {
      return res.status(404).end();
    }
    if (rO[0].state != 'DELIVERED' || dayjs(transportNote.deliveryDate).isBefore(dayjs(rO[0].issueDate))) {
      return res.status(422).end();
    }

    //check deliverydate after issuedate
    
    await restockOrdersDAO.putTNRestockOrder(id, transportNote);
    return res.status(200).end();
  }
  catch (error) {
    return res.status(503).end();
  }
});

//--------------------------------------|   DELETE   |----------------------------------------------
router.delete('/api/restockOrder/:id', async (req, res) => {
  if (req.params.id === undefined || req.params.id == '' || isNaN(req.params.id))
    return res.status(422).end();

  try {
    await restockOrdersDAO.deleteRestockOrder(req.params.id);
    res.status(204).end();
  }
  catch (error) {
    res.status(503).json(error);
  }
})

//------------------------------------------------------------------------------------------------
//                                      RETURN ORDERS
//------------------------------------------------------------------------------------------------


//Return an array containing all return orders.
router.get('/api/returnOrders', async (req, res) => {
  try {
    const listReturnOrders = await returnOrdersDAO.listReturnOrders();
    res.status(200).json(listReturnOrders)
  }
  catch (error) {
    res.status(500).json(error);
  }
});

//Return a return order, given its id.
router.get('/api/returnOrders/:id', async (req, res) => {

  if (req.params.id === undefined || req.params.id == '' || isNaN(req.params.id)) {
    return res.status(422).end();
  }
  const id = await returnOrdersDAO.getRetID();
  let k = 0
  let s = 0
  while (k < id.length) {
    if (req.params.id == id[k].idReturnOrder) {
      s++;
    }
    k++;
  }
  if (s === 0) {
    res.status(404).end();
  }
  else {
    try {
      const returnOrders = await returnOrdersDAO.findRetOrder(req.params.id);
      res.status(200).json(returnOrders);
    }
    catch (error) {
      res.status(500).json(error);
    }
  }
}
);

//Creates a new return order.
router.post('/api/returnOrder', async (req, res) => {
  if (req.body.returnDate === undefined
    || req.body.products === undefined
    || req.body.restockOrderId === undefined)
    return res.status(422).end();

  //404 Not Found (no restock order associated to restockOrderId) DA IMPLEMENTARE

  let returnDate = req.body.returnDate;
  const products = req.body.products;
  let restockOrderId = req.body.restockOrderId;
  let id = await returnOrdersDAO.getIDMax();

  var idfinale = id[0].idReturnOrder;

  idfinale = idfinale + 1;
  let s = 0;

  for (s = 0; s < products.length; s++) {
    var RFID = products[s].RFID
    try {
      await returnOrdersDAO.createRetOrder(idfinale, returnDate, restockOrderId, RFID);
      res.status(201).end();

    }
    catch (error) {
      res.status(503).json(error);
    }
  }
  /*try{
  await returnOrdersDAO.updateProducts();
  res.status(201).end();
  }
  catch (error) {
    res.status(503).json(error);
  }
  */
});








//Qui PUT ma nel documento delle API non è definita

//Delete a return order, given its id.
router.delete('/api/returnOrder/:id', async (req, res) => {

  if (req.params.id === undefined || req.params.id == '' || isNaN(req.params.id))
    return res.status(422).end();

  try {
    await returnOrdersDAO.deleteRetOrder(req.params.id);
    res.status(204).end();
  }
  catch (error) {
    res.status(503).json(error);
  }
});

//------------------------------------------------------------------------------------------------
//                                      INTERNAL ORDERS
//------------------------------------------------------------------------------------------------

//Possible states: ISSUED, ACCEPTED, REFUSED, CANCELED, COMPLETED

//Return an array containing all SKUs.
router.get('/api/internalOrders', async (req, res) => {
  try {

    let completed = await internalOrdersDAO.getCompleted();
    let notCompleted = await internalOrdersDAO.getNotCompleted();
    let listProductsNotCompleted = await internalOrdersDAO.getProductsNotCompleted();
    let listProductsCompleted = await internalOrdersDAO.getProductsCompleted();


    let listNotCompleted = notCompleted.map((nt) => ({
      id: nt.id,
      issueDate: nt.issueDate,
      state: nt.state,
      products:
        (nt.state != "COMPLETED" ?
          listProductsNotCompleted
            .filter((p) => p.id == nt.id)
            .map(element => ({
              SKUId: element.SKUId,
              description: element.description,
              price: element.price,
              qty: element.qty
            }))
          :
          listProductsCompleted
            .filter((p) => p.id == nt.id)
            .map(element => ({
              SKUId: element.SKUId,
              description: element.description,
              price: element.price,
              rfid: element.rfid
            }))),
      customerId: nt.customerId
    }
    ))
      .concat(completed.map((nt) => ({
        id: nt.id,
        issueDate: nt.issueDate,
        state: nt.state,
        products:
          (nt.state != "COMPLETED" ?
            listProductsNotCompleted
              .filter((p) => p.id == nt.id)
              .map(element => ({
                SKUId: element.SKUId,
                description: element.description,
                price: element.price,
                qty: element.qty
              }))
            :
            listProductsCompleted
              .filter((p) => p.id == nt.id)
              .map(element => ({
                SKUId: element.SKUId,
                description: element.description,
                price: element.price,
                rfid: element.rfid
              }))),
        customerId: nt.customerId
      }
      )))

    res.status(200).json(listNotCompleted);
  }
  catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//Return an array containing all internal orders in state = ISSUED.
router.get('/api/internalOrdersIssued', async (req, res) => {

  try {

    let productsIssued = await internalOrdersDAO.getProductsNotCompleted();
    let IOIssued = await internalOrdersDAO.getIssued();

    let issuedInternalOrder = IOIssued.map((o) => ({
      id: o.id,
      issueDate: o.issueDate,
      state: o.state,
      products:
        productsIssued
          .filter((p) => p.id = o.id)
          .map(element => ({
            SKUId: element.SKUId,
            description: element.description,
            price: element.price,
            qty: element.qty
          })),
      customerId: o.customerId
    }
    ));
    res.status(200).json(issuedInternalOrder);
  }
  catch (error) {
    res.status(500).json(error);
  }
});

//Return an array containing all internal orders in state = ACCEPTED.
router.get('/api/internalOrdersAccepted', async (req, res) => {

  try {
    let productsAccepted = await internalOrdersDAO.getProductsNotCompleted();
    let IOAccepted = await internalOrdersDAO.getAccepted();

    let acceptedInternalOrder = IOAccepted.map((o) => ({
      id: o.id,
      issueDate: o.issueDate,
      state: o.state,
      products:
        productsAccepted
          .filter((p) => p.id = o.id)
          .map(element => ({
            SKUId: element.SKUId,
            description: element.description,
            price: element.price,
            qty: element.qty
          })),
      customerId: o.customerId
    }
    ));



    res.status(200).json(acceptedInternalOrder);
  }
  catch (error) {
    res.status(500).json(error);
  }
});

//Return an internal order, given its id.
router.get('/api/internalOrders/:id', async (req, res) => {

  if (req.params.id === undefined || req.params.id == '' || isNaN(req.params.id)) {
    return res.status(422).end();
  }
  try {

    let completed = await internalOrdersDAO.getCompleted();
    let notCompleted = await internalOrdersDAO.getNotCompleted();
    let listProductsNotCompleted = await internalOrdersDAO.getProductsNotCompleted();
    let listProductsCompleted = await internalOrdersDAO.getProductsCompleted();


    let listNotCompleted = notCompleted.map((nt) => ({
      id: nt.id,
      issueDate: nt.issueDate,
      state: nt.state,
      products:
        (nt.state != "COMPLETED" ?
          listProductsNotCompleted
            .filter((p) => p.id == nt.id)
            .map(element => ({
              SKUId: element.SKUId,
              description: element.description,
              price: element.price,
              qty: element.qty
            }))
          :
          listProductsCompleted
            .filter((p) => p.id == nt.id)
            .map(element => ({
              SKUId: element.SKUId,
              description: element.description,
              price: element.price,
              rfid: element.rfid
            }))),
      customerId: nt.customerId
    }
    ))
      .concat(completed.map((nt) => ({
        id: nt.id,
        issueDate: nt.issueDate,
        state: nt.state,
        products:
          (nt.state != "COMPLETED" ?
            listProductsNotCompleted
              .filter((p) => p.id == nt.id)
              .map(element => ({
                SKUId: element.SKUId,
                description: element.description,
                price: element.price,
                qty: element.qty
              }))
            :
            listProductsCompleted
              .filter((p) => p.id == nt.id)
              .map(element => ({
                SKUId: element.SKUId,
                description: element.description,
                price: element.price,
                rfid: element.rfid
              }))),
        customerId: nt.customerId
      }
      )))



    let internalOrderById = listNotCompleted.filter(e => e.id = req.params.id);
    if (internalOrderById.length === 0)
      res.status(404).end();
    res.status(200).json(internalOrderById);
  }
  catch (error) {
    res.status(500).json(error);
  }
});

//Creates a new internal order in state = ISSUED.
router.post('/api/internalOrders', async (req, res) => {
  if (req.body.issueDate === undefined
    || req.body.products === undefined
    || req.body.customerId === undefined){
            console.log("Qui1");
    return res.status(422).end();

    }

  let issueDate = req.body.issueDate;
  let products = req.body.products;
  let customerId = req.body.customerId;
  if (await usersDAO.findUser(customerId) != true) {
    return res.status(422).end();
  }

  try {
    let idIntOrder = await internalOrdersDAO.insertIO(issueDate, customerId);
    for (let p of products) {
      await internalOrdersDAO.insertIOS(idIntOrder, p.SKUId, p.qty);
    }
    res.status(201).end();
  }
  catch (error) {
    console.log(error);
    res.status(503).json(error);
  }

});

//Modify the state of an internal order, given its id. If newState is = COMPLETED an array of RFIDs is sent
router.put('/api/internalOrders/:id', async (req, res) => {
  if (req.params.id === undefined || req.params.id == '' || isNaN(req.params.id))
    return res.status(422).end();


  let newState = req.body.newState;
  let products = req.body.products;

  //aggiungere controlli su body

  /*     if (newState !== 'ACCEPTED' || newState !== 'COMPLETED') {
        res.status(422).end();
        return;
      } */

  try {

    let completed = await internalOrdersDAO.getCompleted();
    let notCompleted = await internalOrdersDAO.getNotCompleted();

    let found = completed.map(e => ({
      id: e.id
    }))
      .concat(notCompleted.map(e => ({
        id: e.id
      })))
      .filter(e => e.id == req.params.id);

    if (found.length === 0) {
      res.status(404).end();
      return;
    }
    await internalOrdersDAO.updateIntOrder(req.params.id, newState, products);
    res.status(200).end();
    return;
  }
  catch (error) {
    console.log(error);
    res.status(503).json(error);
  }
});


//Delete an internal order, given its id.
router.delete('/api/internalOrders/:id', async (req, res) => {

  if (req.params.id === undefined || req.params.id == '' || isNaN(req.params.id))
    return res.status(422).end();

  try {
    await internalOrdersDAO.deleteIntOrder(req.params.id);
    res.status(204).end();
  }
  catch (error) {
    res.status(503).json(error);
  }
});


//------------------------------------------------------------------------------------------------
//                                      ITEM
//------------------------------------------------------------------------------------------------

//Return an array containing all SKUs.
router.get('/api/items', async (req, res) => {
  try {
    const listItems = await itemsDAO.listItems();
    return res.status(200).json(listItems)
  }
  catch (error) {
    return res.status(500).json(error);
  }
});

//Return an item, given its id..
router.get('/api/items/:id', async (req, res) => {

  if (req.params.id === undefined || req.params.id == '' || isNaN(req.params.id)) {
    return res.status(422).end();
  }
  try {
    const item = await itemsDAO.findItem(req.params.id);
    if (item.length === 0)
      return res.status(404).end();
    return res.status(200).json(item);
  }
  catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

//Creates a new Item.
router.post('/api/item', async (req, res) => {
  if (req.body.description === undefined
    || req.body.id === undefined
    || req.body.SKUId === undefined
    || req.body.supplierId === undefined
    || req.body.price === undefined)
    return res.status(422).end();

  let id = req.body.id;
  let SKUId = req.body.SKUId;
  let supplierId = req.body.supplierId;
  let price = req.body.price;
  let description = req.body.description;

  try {
    await itemsDAO.createItem(description, id, SKUId, supplierId, price);
    return res.status(201).end();
  }
  catch (error) {
    return res.status(503).json(error);
  }

});

//Modify an existing item.
router.put('/api/item/:id', async (req, res) => {
  if (req.params.id === undefined
    || req.params.id == ''
    || isNaN(req.params.id)
    || req.body.newDescription === undefined
    || req.body.newPrice === undefined)
    return res.status(422).end();

  let description = req.body.newDescription;
  let price = req.body.newPrice;

  try {
    let found = await itemsDAO.updateItem(req.params.id, description, price);
    if (found.length === 0) {
      return res.status(404).end();
    }
    else {
      return res.status(200).end();
    }
  }
  catch (error) {
    return res.status(503).json(error);
  }
});

//Delete an item receiving its id.
router.delete('/api/items/:id', async (req, res) => {

  if (req.params.id === undefined || req.params.id == '' || isNaN(req.params.id))
    return res.status(422).end();

  try {
    await itemsDAO.deleteItem(req.params.id);
    return res.status(204).end();
  }
  catch (error) {
    return res.status(503).json(error);
  }
});

module.exports = router;
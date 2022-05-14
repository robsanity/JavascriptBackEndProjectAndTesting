'use strict';
const express = require('express');
const testDescriptorsDAO = require('./modules/testDescriptorsDAO');
const testResultsDAO = require('./modules/testResultsDAO');
const usersDAO = require('./modules/usersDAO');
const restockOrdersDAO = require('./modules/restockOrdersDAO');
const SKUsDAO = require('./modules/SKUsDAO');
const SKUItemsDAO = require('./modules/SKUItemsDAO');
const positionsDAO = require('./modules/positionsDAO');

// init express
const app = new express();
const port = 3001;

app.use(express.json());


//------------------------------------------------------------------------------------------------
//                                     SKU
//------------------------------------------------------------------------------------------------

//Return an array containing all SKUs.
app.get('/api/skus', async (req, res) => {
  try {
    const listSKUs = await SKUsDAO.listSKUs();
    res.status(200).json(listSKUs)
  }
  catch (error) {
    res.status(500).json(error);
  }
});

//Return a SKU, given its id.
app.get('/api/skus/:id', async (req, res) => {

  if (req.params.id === undefined || req.params.id == '' || isNaN(req.params.id)) {
    return res.status(422).end();
  }
  try {
    const SKU = await SKUsDAO.findSKU(req.params.id);
    if (SKU === null)
      res.status(404).end();
    res.status(200).json(SKU);
  }
  catch (error) {
    res.status(500).json(error);
  }
});

//Creates a new SKU with an empty array of testDescriptors.
app.post('/api/sku', async (req, res) => {
  if (/*Object.keys(req.header).length === 0|| */ req.body.description === undefined || req.body.weight === undefined || req.body.volume === undefined || req.body.notes === undefined || req.body.price === undefined || req.body.availableQuantity === undefined) {
    return res.status(422).end();
  }

  //Ricavo gli attributi necessari a creare una nuova SKU e li passo a createSKU
  let description = req.body.description;
  let weight = req.body.weight;
  let volume = req.body.volume;
  let notes = req.body.notes;
  let price = req.body.price;
  let availableQuantity = req.body.availableQuantity;

  try {
    await SKUsDAO.createSKU(description, weight, volume, notes, availableQuantity, price);
    res.status(201).end();
  }
  catch (error) {
    res.status(503).json(error);
  }

});

//Modify an existing SKU. When a newAvailableQuantity is sent, occupiedWeight and occupiedVolume fields of the position 
//(if the SKU is associated to a position) are modified according to the new available quantity.
app.put('/api/sku/:id', async (req, res) => {
  if (Object.keys(req.header).length === 0 || req.params.id === undefined || req.params.id == '' || isNaN(req.params.id) || req.body.description === undefined || req.body.weight === undefined || req.body.volume === undefined || req.body.notes === undefined || req.body.price === undefined || req.body.availableQuantity === undefined) {
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
    let found = await SKUsDAO.updateSKU(description,weight,volume,notes,price,availableQuantity,req.params.id, req.params.id,req.params.id,req.params.id);
    if(found === null)
      res.status(404).end();
    res.status(200).end();
  }
  catch (error) {
    res.status(503).json(error);
  }
});


//Add or modify position of a SKU. When a SKU is associated to a position, occupiedWeight and occupiedVolume fields of the position
//are modified according to the available quantity.
app.put('/api/sku/:id/position', async (req, res) => {
  if (/*Object.keys(req.header).length === 0 ||*/ req.body.position === undefined || req.params.id === undefined || req.params.id == '' || isNaN(req.params.id))
    return res.status(422).end();
    
  //Come implementare:   422 Unprocessable Entity (position isn't capable to satisfy volume and weight constraints for available quantity of sku or position is already assigned to a sku)
  try {
    await SKUsDAO.updatePosition(req.params.id,req.params.id,req.params.id,req.body.position,req.params.id,req.params.id,req.params.id,req.body.position);
    res.status(200).end();
  }
  catch (error) {
    res.status(503).json(error);
  }
});

//Delete a SKU receiving its id.
app.delete('/api/skus/:id', async (req, res) => {

  if (req.params.id === undefined || req.params.id == '' || isNaN(req.params.id))
    return res.status(422).end();

  try {
    await SKUsDAO.deleteSKU(req.params.id);
    res.status(204).end();
  }
  catch (error) {
    res.status(503).json(error);
  }
});


//------------------------------------------------------------------------------------------------
//                                     SKU Items
//------------------------------------------------------------------------------------------------


//Return an array containing all SKU items
app.get('/api/skuitems', async (req, res) => {

  try {
    const listSKUItems = await SKUItemsDAO.listSKUItems();
    res.status(200).json(listSKUItems);
  }
  catch (error) {
    res.status(500).json(error);
  }

});

//Return an array containing all SKU items for a certain SKUId with Available = 1.
app.get('/api/skuitems/sku/:id', async (req, res) => {

  if (req.params.id === undefined || req.params.id == '' || isNaN(req.params.id))
    return res.status(422).end();

  try {
    const SKUItemsAvailable = await SKUItemsDAO.findSKUItems(req.params.id);
    if (SKUItemsAvailable === null)
      res.status(404).end();
    res.status(200).json(SKUItemsAvailable);
  }
  catch (error) {
    res.status(500).json(error);
  }

});

//Return a SKU item, given its RFID.
app.get('/api/skuitems/:rfid', async (req, res) => {

  if (req.params.rfid === undefined || req.params.rfid == '' || isNaN(req.params.rfid)) {
    return res.status(422).end();
  }
  try {
    const SKUItem = await SKUItemsDAO.findSKUItem(req.params.rfid);
    if (SKUItem === null)
      res.status(404).end();
    res.status(200).json(SKUItem)
  } catch (error) {
    res.status(500).json(error);
  }

});


//Creates a new SKU item with Available =0.
app.post('/api/skuitem', async (req, res) => {
  if (Object.keys(req.header).length === 0 || req.body.RFID === null || req.body.SKUID === null)
    return res.status(422).end();

  try {
    await SKUItemsDAO.createSKUItem(req.body.RFID, req.body.SKUID, dayjs('{req.body.DateOfStock}').format('YYYY/MM/DDTHH:mm'));
    res.status(201).end();
  }
  catch (error) {
    res.status(503).json(error);
  }
});


//Modify RFID, available and date of stock fields of an existing SKU Item.
app.put('/api/skuitems/:rfid', async (req, res) => {
  if (Object.keys(req.header).length === 0 || req.params.rfid === undefined || req.params.rfid == '' || isNaN(req.params.rfid))
    return res.status(422).end();

  let checkSKUItems = await SKUItemsDAO.findSKUItem(rfid);
  if (checkSKUItems.length === 0) {
    res.status(404).end();
  }
  try {
    await SKUItemsDAO.modifySKUItem(req.params.rfid, req.body.newRFID, req.body.newAvailable, dayjs('{req.body.newDateOfStock}').format('YYYY/MM/DDTHH:mm'));

    res.status(200).end();
  }
  catch (error) {
    res.status(500).json(error);
  }
});


//Delete a SKU item receiving his rfid.
app.delete('/api/skuitems/:rfid', async (req, res) => {
  if (req.params.rfid === undefined || req.params.rfid == '' || isNaN(req.params.rfid))
    return res.status(422).end();

  try {
    const SKU = await SKUItemsDAO.deleteSKUItem(req.params.rfid);
    res.status(204).end();
  }
  catch (error) {
    res.status(503).json(error);
  }
});

//------------------------------------------------------------------------------------------------
//                                     Positions
//------------------------------------------------------------------------------------------------



//Return an array containing all positions.
app.get('/api/positions', async (req, res) => {

  try {
    const listPositions = await positionsDAO.listPositions();
    res.status(200).json(listPositions);
  } catch (error) {
    res.status(500).json(error);
  }

});


//Creates a new Position.
app.post('/api/position', async (req, res) => {

  if (Object.keys(req.header).length === 0 || req.body.positionID === null || req.body.aisleID === null || req.body.row === null || req.body.col === null || req.body.maxWeight === null || req.body.maxVolume === null)
    return res.status(422).end();

  try {
    await positionsDAO.createPositions(req.body.positionID, req.body.aisleID, req.body.row, req.body.col, req.body.maxWeight, req.body.maxVolume);
    res.status(201).end();
  }
  catch (error) {
    res.status(503).json(error);
  }

});


//Modify a position identified by positionID.
app.put('/api/position/:positionID', async (req, res) => {

  if (Object.keys(req.header).length === 0 || Object.keys(req.body).length === 0
    || req.body.newAisleID === null
    || req.body.newRow === null || req.body.newCol === null
    || req.body.newMaxWeight === null || req.body.newMaxVolume === null
    || req.body.newOccupiedWeight === null || req.body.newOccupiedVolume === null
    || req.params.positionID === undefined || req.params.positionID == ''
    || isNaN(req.params.positionID))
    return res.status(422).end();

  let checkPosition = await positionsDAO.checkPosition(req.params.positionID);
  if (checkPosition.length === 0) {
    res.status(404).end();
  }
  try {
    await positionsDAO.modifyPosition(req.params.positionID, req.body.newAisleID, req.body.newRow, req.body.newCol, req.body.newMaxWeight, req.body.newMaxVolume, req.body.newOccupiedWeight, req.body.newOccupiedVolume);
    res.status(200).end();
  }
  catch (error) {
    res.status(503).json(error);
  }
});

//Modify the positionID of a position, given its old positionID.
app.put('/api/position/:positionID/changeID', async (req, res) => {

  if (Object.keys(req.header).length === 0 || Object.keys(req.body).length === 0
    || req.body.newPositionID === null
    || req.params.positionID === undefined || req.params.positionID == ''
    || isNaN(req.params.positionID))
    return res.status(422).end();

  let checkOldPosition = await positionsDAO.checkPosition(req.params.positionID);
  if (checkOldPosition.length === 0) {
    res.status(404).end();
  }
  let checkNewPosition = await positionsDAO.checkPosition(req.body.newPositionID);
  if (checkNewPosition.length !== 0) {
    res.status(422).end();
  }
  try {
    await positionsDAO.modifyPositionID(req.params.positionID, req.body.newPositionID);
    res.status(200).end();
  }
  catch (error) {
    res.status(503).json(error);
  }
});

//Delete a SKU item receiving his positionID.
app.delete('/api/position/:positionID', async (req, res) => {

  if (Object.keys(req.header).length === 0
    || req.params.positionID === undefined || req.params.positionID == ''
    || isNaN(req.params.positionID))
    return res.status(422).end();
  let checkPosition = await positionsDAO.checkPosition(req.params.positionID);
  if (checkPosition.length === 0) {
    res.status(422).end();
  }
  try {
    await positionsDAO.deletePosition(req.params.positionID);
    res.status(204).end();
  }
  catch (error) {
    res.status(503).json(error);
  }

});

//------------------------------------------------------------------------------------------------
//                                      TEST DESCRIPTOR
//------------------------------------------------------------------------------------------------

//--------------------------------------|   GET   |------------------------------------------------
app.get('/api/testDescriptors', async (req, res) => {
  try {
    let listTestDescriptors = await testDescriptorsDAO.getTestDescriptors();
    res.status(200).json(listTestDescriptors)
  } catch (error) {
    res.status(500).json();
  }
});

app.get('/api/testDescriptors/:id', async (req, res) => {
  try {
    if (Object.keys(req.header).length === 0) {
      res.status(422).end();
    }

    let id = req.params.id;
    if (id === undefined || id == '' || isNaN(id)) {
      res.status(422).end();
    }
    let testDescriptor = await testDescriptorsDAO.getByIdTestDescriptors(testDescriptorId);
    res.status(200).json(testDescriptor).end()
  } catch (error) {
    res.status(404).json();
  }
});

//--------------------------------------|   POST   |------------------------------------------------
app.post('/api/testDescriptor', async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      res.status(422).end();
    }
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
      res.status(404).end();
    }

    await testDescriptorsDAO.insertTestDescriptor(name, procedureDescription, idSKU);
    res.status(201).end();
  }
  catch (error) {
    res.status(503).end();
  }
});

//--------------------------------------|   PUT   |------------------------------------------------
app.put('/api/testDescriptor/:id', async (req, res) => {
  try {
    if (Object.keys(req.header).length === 0) {
      res.status(422).end();
    }

    let id = req.params.id;
    if (id === undefined || id == '' || isNaN(id)) {
      res.status(422).end();
    }

    if (Object.keys(req.body).length === 0) {
      res.status(422).end();
    }

    let newName = req.body.newName;
    let newProcedureDescription = req.body.newProcedureDescription;
    let newIdSKU = req.body.newIdSKU;

    if (newName === undefined || newName == '' ||
      newProcedureDescription === undefined || newProcedureDescription == '' ||
      newIdSKU === undefined || newIdSKU == '' || isNaN(newIdSKU)) {
      return res.status(422).end();
    }

    let td = await testDescriptorsDAO.getByIdTestDescriptors(id);
    let sku = await SKUsDAO.findSKU(newIdSKU)

    if (td.length === 0 || sku.length === 0) {
      res.status(404).end();
    }

    await testDescriptorsDAO.updateTestDescriptor(id, newName, newProcedureDescription, newIdSKU);
    res.status(200).end();
  }
  catch (error) {
    res.status(503).end()
  }
});

//--------------------------------------|   DELETE   |------------------------------------------------
app.delete('/api/testDescriptor/:id', async (req, res) => {
  try {
    if (Object.keys(req.header).length === 0) {
      res.status(422).end();
    }

    let id = req.params.id;
    if (id === undefined || id == '' || isNaN(id)) {
      res.status(422).end();
    }

    let td = await testDescriptorsDAO.getByIdTestDescriptors(id);

    if (td.length === 0) {
      res.status(422).end();
    }

    await testDescriptorsDAO.deleteTestDescriptor(id);
    res.status(204).end();
  }
  catch (error) {
    res.status(503).end();
  }

});


//------------------------------------------------------------------------------------------------
//                                      TEST RESULT
//------------------------------------------------------------------------------------------------

//--------------------------------------|   GET   |------------------------------------------------
app.get('/api/skuitems/:rfid/testResults', async (req, res) => {
  try {
    if (Object.keys(req.header).length === 0) {
      res.status(422).end();
    }
    let rfid = req.params.rfid;
    if (rfid === undefined || rfid === '' || isNaN(rfid)) {
      res.status(422).end();
    }

    let checkRfid = await SKUItemsDAO.findSKUItem(rfid);
    if (checkRfid.length === 0) {
      res.status(404).end()
    }

    const listTestResults = await testResultsDAO.getTestResults(rfid);
    res.status(200).json(listTestResults).end();

  } catch (error) {
    res.status(500).json({ error: error }).end();
  }
})

app.get('/api/skuitems/:rfid/testResults/:id', async (req, res) => {
  try {
    if (Object.keys(req.header).length === 0) {
      res.status(422).end();
    }

    let rfid = req.params.rfid;
    let id = req.params.id;
    if (rfid === undefined || rfid === '' || isNaN(rfid) ||
      id === undefined || id === '' || isNaN(id)) {
      res.status(422).end();
    }

    let checkRfid = await SKUItemsDAO.findSKUItem(rfid);
    if (checkRfid.length === 0) {
      res.status(404).end()
    }

    let checkId = await testResultsDAO.checkId(id);
    if (checkId.length === 0) {
      res.status(404).end()
    }

    const listTestResults = await testResultsDAO.getByIdTestResults(rfid, id);
    res.status(200).json(listTestResults)
  } catch (error) {
    res.status(500).json();
  }
})

//--------------------------------------|   POST   |------------------------------------------------
app.post('/api/skuitems/testResult', async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      res.status(422).end();
    }
    let rfid = req.body.name;
    let idTestDescriptor = req.body.procedureDescription;
    let date = req.body.idSKU;
    let result = req.body.result;

    if (rfid === undefined || rfid == '' || isNaN(rfid) ||
      idTestDescriptor === undefined || idTestDescriptor == '' || isNaN(idTestDescriptor) ||
      date === undefined || date == '' ||
      result === undefined || result == '' || !(result === "true" || result === "false")) {
      return res.status(422).end();
    }

    let checkRfid = await SKUItemsDAO.findSKUItem(rfid);
    if (checkRfid.length === 0) {
      res.status(404).end()
    }

    let checkTD = await testDescriptorsDAO.getByIdTestDescriptors(idTestDescriptor);
    if (checkTD.length === 0) {
      res.status(404).end()
    }

    let checkTR = await testResultsDAO.getByIdTestResults(rfid, idTestDescriptor);
    if (checkTR.length !== 0) {
      res.status(422).end()
    }

    await testResultsDAO.insertTestResult(rfid, idTestDescriptor, date, result);
    res.status(201).end();
  }
  catch (error) {
    res.status(503).end();
  }
});
//--------------------------------------|   PUT   |------------------------------------------------
app.put('/api/skuitems/:rfid/testResults/:id', async (req, res) => {
  try {
    if (Object.keys(req.header).length === 0) {
      res.status(422).end();
    }

    let rfid = req.params.rfid;
    let id = req.params.id;
    if (rfid === undefined || rfid === '' || isNaN(rfid) ||
      id === undefined || id === '' || isNaN(id)) {
      res.status(422).end();
    }

    if (Object.keys(req.body).length === 0) {
      res.status(422).end();
    }

    let newIdTestDescriptor = req.body.newIdTestDescriptor;
    let newDate = req.body.newDate;
    let newResult = req.body.newResult;

    if (newIdTestDescriptor === undefined || newIdTestDescriptor === '' || isNaN(newIdTestDescriptor) ||
      newDate === undefined || newDate === '' ||
      newResult === undefined || newResult == '' || !(newResult === "true" || newResult === "false")) {
      res.status(422).end();
    }

    let td = await testDescriptorsDAO.getByIdTestDescriptors(id);
    let ntd = await testDescriptorsDAO.getByIdTestDescriptors(newIdTestDescriptor);
    let sku = await SKUItemsDAO.findSKUItem(rfid);
    if (td.length === 0 || sku.length === 0 || ntd.length === 0) {
      res.status(404).end();
    }

    await testResultsDAO.updateTestResults(id, rfid, newIdTestDescriptor, newDate, newResult);
    res.status(200).end();
  }
  catch (error) {
    res.status(503).end()
  }
});
//--------------------------------------|   DELETE   |------------------------------------------------
app.delete('/api/skuitems/:rfid/testResults/:id', async (req, res) => {
  try {
    if (Object.keys(req.header).length === 0) {
      res.status(422).end();
    }

    let rfid = req.params.rfid;
    let id = req.params.id;
    if (rfid === undefined || rfid === '' || isNaN(rfid) ||
      id === undefined || id === '' || isNaN(id)) {
      res.status(422).end();
    }

    let tr = await testResultsDAO.getByIdTestResults(rfid, id);

    if (tr.length === 0) {
      res.status(422).end();
    }

    await testResultsDAO.deleteTestResult(rfid, id);
    res.status(204).end();
  }
  catch (error) {
    res.status(503).end();
  }

});



//------------------------------------------------------------------------------------------------
//                                       USER
//------------------------------------------------------------------------------------------------

//--------------------------------------|   GET   |------------------------------------------------
app.get('/api/suppliers', async (req, res) => {
  try {
    const suppliers = await usersDAO.getSuppliers();
    res.status(200).json(suppliers)
  } catch (error) {
    res.status(500).json();
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await usersDAO.getUsers();
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json();
  }
});

//--------------------------------------|   POST   |------------------------------------------------
app.post('/api/newUser', async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      res.status(422).end();
    }
    let username = req.body.username
    let name = req.body.name;
    let surname = req.body.surname;
    let type = req.body.type;

    if (username === undefined || username == '' ||
      name === undefined || name == '' ||
      surname === undefined || surname == '' ||
      type === undefined || type == '' || !(type === "customer" || type === "qualityEmployee" || type === "clerk" || type === "deliveryEmployee" || type === "supplier")) {
      return res.status(422).end();
    }

    let user = await usersDAO.checkUser(username, type);

    if (user.length !== 0) {
      res.status(409).end();
    }

    await usersDAO.insertUser(username, name, surname, type);
    res.status(201).end();
  }
  catch (error) {
    res.status(503).end();
  }
});
//--------------------------------------|   PUT   |-------------------------------------------------
app.put('/api/users/:username', async (req, res) => {
  try {
    if (Object.keys(req.header).length === 0) {
      res.status(422).end();
    }

    let username = req.params.username;
    if (username === undefined || username === '') {
      res.status(422).end();
    }

    if (Object.keys(req.body).length === 0) {
      res.status(422).end();
    }

    let oldType = req.body.oldType;
    let newType = req.body.newType;

    if (oldType === undefined || oldType == '' || !(oldType === "customer" || oldType === "qualityEmployee" || oldType === "clerk" || oldType === "deliveryEmployee" || oldType === "supplier") ||
      newType === undefined || newType == '' || !(newType === "customer" || newType === "qualityEmployee" || newType === "clerk" || newType === "deliveryEmployee" || newType === "supplier")) {
      res.status(422).end();
    }

    let userWithOldType = await usersDAO.checkUser(username, oldType);
    let userWithNewType = await usersDAO.checkUser(username, newType);
    if (userWithOldType.length === 0 || userWithNewType.length !== 0) {
      res.status(409).end();
    }

    await usersDAO.updateUser(username, userWithType.name, userWithType.surname, oldType, newType);
    res.status(200).end();
  }
  catch (error) {
    res.status(503).end()
  }
});
//--------------------------------------|   DELETE   |----------------------------------------------
app.delete('/api/users/:username/:type', async (req, res) => {
  try {
    if (Object.keys(req.header).length === 0) {
      res.status(422).end();
    }

    let username = req.params.username;
    let type = req.params.type;
    if (username === undefined || username === '' ||
      type === undefined || type == '' || !(type === "customer" || type === "qualityEmployee" || type === "clerk" || type === "deliveryEmployee" || type === "supplier")) {
      res.status(422).end();
    }

    let user = await usersDAO.checkUser(username, oldType);

    if (user.length === 0) {
      res.status(422).end();
    }

    await usersDAO.deleteUser(username, type);
    res.status(204).end();
  }
  catch (error) {
    res.status(503).end();
  }

});
//------------------------------------------------------------------------------------------------
//                                      RESTOCK ORDERS
//------------------------------------------------------------------------------------------------
//--------------------------------------|   GET   |------------------------------------------------
app.get('/api/restockOrders', async (req, res) => {
  try {
    // state!=ISSUED
    let restockOrdersList = await restockOrdersDAO.getRestockOrders();

    // idItems(RestockOrderItem) JOIN idItems(Items) - idSKU(Items) JOIN idSKU(SKU) - idSKU(SKUs) JOIN idSKU(SKUItems)
    // SELECT idRestockOrder, idSKU, description, price, quantity, rfid
    let productsQuery = getProductsRestockOrders();

    let restockOrders = restockOrdersList.map((r) => ({
      id: r.idRestockOrder,
      issueDate: r.issueDate,
      state: r.state,
      products: productsQuery
        .filter((p) => p.idRestockOrder == r.idRestockOrder)
        .map(element => (
          {
            idSKU: element.idSKU,
            description: element.description,
            price: element.price,
            qty: element.availableQuantity
          }
        )),
      supplierId: r.supplierId,
      transportNote: r.transportNote,
      skuItems: productsQuery
        .filter((p) => p.idRestockOrder == r.idRestockOrder)
        .map(element => (
          {
            SKUId: element.idSKU,
            rfid: element.rfid
          }
        ))
    }));

    res.status(200).json(restockOrders)
  } catch (error) {
    res.status(500).json();
  }
});

app.get('/api/restockOrdersIssued', async (req, res) => {
  try {
    let restockOrdersIssuedList = await restockOrdersDAO.getISSUEDRestockOrders();

    // idItems(RestockOrderItem) JOIN idItems(Items) - idSKU(Items) JOIN idSKU(SKU)
    // SELECT idRestockOrder, idSKU, description, price, quantity
    let productsQuery = getProductsRestockOrders();

    let restockOrders = restockOrdersIssuedList.map((r) => ({
      id: r.idRestockOrder,
      issueDate: r.issueDate,
      state: r.state,
      products: productsQuery
        .filter((p) => p.idRestockOrder == r.idRestockOrder)
        .map(element => (
          {
            idSKU: element.idSKU,
            description: element.description,
            price: element.price,
            qty: element.availableQuantity
          }
        )),
      transportNote: r.transportNote,
      skuItems: []
    }));

    res.status(200).json(restockOrders)
  } catch (error) {
    res.status(500).json();
  }
});

app.get('/api/restockOrders/:id', async (req, res) => {
  try {
    if (Object.keys(req.header).length === 0) {
      res.status(422).end();
    }

    let id = req.params.id;
    if (id === undefined || id === '' || isNaN(id)) {
      res.status(422).end();
    }

    let rO = await restockOrdersDAO.getByIdRestockOrders(id);
    if (rO.length === 0) {
      res.status(404).end();
    }

    let restockOrdersList = await restockOrdersDAO.getByIdRestockOrders(id);

    // idItems(RestockOrderItem) JOIN idItems(Items) - idSKU(Items) JOIN idSKU(SKU) - idSKU(SKUs) JOIN idSKU(SKUItems)
    // SELECT idRestockOrder, idSKU, description, price, quantity, rfid
    let productsQuery = getProductsRestockOrders();

    let restockOrders = restockOrdersList.map((r) => ({
      issueDate: r.issueDate,
      state: r.state,
      products: productsQuery
        .filter((p) => p.idRestockOrder == r.idRestockOrder)
        .map(element => (
          {
            idSKU: element.idSKU,
            description: element.description,
            price: element.price,
            qty: element.availableQuantity
          }
        )),
      skuItems: productsQuery
        .filter((p) => p.idRestockOrder == r.idRestockOrder)
        .map(element => (
          {
            SKUId: element.idSKU,
            rfid: element.rfid
          }
        ))
    }));

    res.status(200).json(restockOrders)
  } catch (error) {
    res.status(500).json();
  }
});

app.get('/api/restockOrders/:id/returnItems', async (req, res) => {
  try {
    if (Object.keys(req.header).length === 0) {
      res.status(422).end();
    }

    let id = req.params.id;
    if (id === undefined || id === '' || isNaN(id)) {
      res.status(422).end();
    }

    let rO = await restockOrdersDAO.getByIdRestockOrders(id);
    if (rO.length === 0) {
      res.status(404).end();
    }

    await restockOrdersDAO.getToBeReturnRestockOrders(id);




  } catch (error) {
    res.status(500).json();
  }
})
//--------------------------------------|   POST   |------------------------------------------------

//--------------------------------------|   PUT   |-------------------------------------------------
app.put('/api/restockOrder/:id', async (req, res) => {
  try {
    if (Object.keys(req.header).length === 0 || Object.keys(req.body).length === 0) {
      res.status(422).end();
    }

    let id = req.params.id;
    if (id === undefined || id == '' || isNaN(id)) {
      return res.status(422).end();
    }

    let newState = req.body.newState;
    if (newState === undefined || newState == '') {
      return res.status(422).end();
    }

    let rO = await restockOrdersDAO.getByIdRestockOrders(id);

    if (rO.length !== 0) {
      res.status(404).end();
    }

    await restockOrdersDAO.putStateRestockOrder(id, newState);
    res.status(200).end();
  }
  catch (error) {
    res.status(503).end();
  }
});

app.put('/api/restockOrder/:id/skuItems', async (req, res) => {
  try {
    if (Object.keys(req.header).length === 0 || Object.keys(req.body).length === 0) {
      res.status(422).end();
    }

    let id = req.params.id;
    if (id === undefined || id == '' || isNaN(id)) {
      return res.status(422).end();
    }

    let skuItems = req.body.skuItems;
    if (skuItems === undefined || skuItems === '' || skuItems.length === 0) {
      return res.status(422).end();
    }

    let rO = await restockOrdersDAO.getByIdRestockOrders(id);
    if (rO.length !== 0) {
      res.status(404).end();
    }

    //check state delivered
    let skuItemsOnRO = rO.skuItems;
    if (skuItemsOnRO.length === 0) {
      skuItems = skuItemsOnRO
        .map(e => ({ SKUId: e.idSKU, rfid: e.rfid }))
        .concat(skuItems.map(e => ({ SKUId: e.idSKU, rfid: e.rfid })));
    }

    //put in RestockOrderItems but QUANTITY????
    res.status(200).end();
  }
  catch (error) {
    res.status(503).end();
  }
});


app.put('/api/restockOrder/:id/transportNote', async (req, res) => {
  try {
    if (Object.keys(req.header).length === 0 || Object.keys(req.body).length === 0) {
      res.status(422).end();
    }

    let id = req.params.id;
    if (id === undefined || id == '' || isNaN(id)) {
      return res.status(422).end();
    }

    let transportNote = req.body.transportNote;
    if (newState === undefined || newState == '') {
      return res.status(422).end();
    }

    let rO = await restockOrdersDAO.getByIdRestockOrders(id);
    if (rO.length !== 0) {
      res.status(404).end();
    }

    //check deliverydate after issuedate
    //check state delivered

    await restockOrdersDAO.putTNRestockOrder(id, newState);
    res.status(200).end();
  }
  catch (error) {
    res.status(503).end();
  }
});

//--------------------------------------|   DELETE   |----------------------------------------------


//------------------------------------------------------------------------------------------------
//                                      RETURN ORDERS
//------------------------------------------------------------------------------------------------


//Return an array containing all return orders.
app.get('/api/returnOrders', async (req, res) => {
  try {
    const listReturnOrders = await returnOrdersDAO.listRetOrders();
    res.status(200).json(listReturnOrders)
  }
  catch (error) {
    res.status(500).json(error);
  }
});

//Return a return order, given its id.
app.get('/api/returnOrders/:id', async (req, res) => {

  if (req.params.id === undefined || req.params.id == '' || isNaN(req.params.id)) {
    return res.status(422).end();
  }
  try {
    const returnOrder = await returnOrdersDAO.findRetOrder(req.params.id);
    if (returnOrders === null)
      res.status(404).end();
    res.status(200).json(returnOrders);
  }
  catch (error) {
    res.status(500).json(error);
  }
});

//Creates a new return order.
app.post('/api/returnOrder', async (req, res) => {
  if (Object.keys(req.header).length === 0
    || req.body.returnDate === undefined
    || req.body.products === undefined
    || req.body.restockOrderId === undefined)
    return res.status(422).end();

  //404 Not Found (no restock order associated to restockOrderId) DA IMPLEMENTARE
  let returnDate = req.body.returnDate;
  let products = req.body.products;
  let restockOrderId = req.body.restockOrderId;

  try {
    await returnOrdersDAO.createRetOrder(returnDate, products, restockOrderId);
    res.status(201).end();
  }
  catch (error) {
    res.status(503).json(error);
  }

});


//Qui PUT ma nel documento delle API non è definita

//Delete a return order, given its id.
app.delete('/api/returnOrder/:id', async (req, res) => {

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
app.get('/api/internalOrders', async (req, res) => {
  try {
    const listInternalOrders = await internalOrdersDAO.listIntOrders();
    res.status(200).json(listInternalOrders)
  }
  catch (error) {
    res.status(500).json(error);
  }
});

//Return an array containing all internal orders in state = ISSUED.
app.get('/api/internalOrdersIssued', async (req, res) => {

  try {
    const internalOrdersIssued = await internalOrdersDAO.findIntOrderIssued();
    res.status(200).json(internalOrdersIssued);
  }
  catch (error) {
    res.status(500).json(error);
  }
});

//Return an array containing all internal orders in state = ACCEPTED.
app.get('/api/internalOrdersAccepted', async (req, res) => {

  try {
    const internalOrdersAccepted = await internalOrdersDAO.findIntOrderAccepted();
    res.status(200).json(internalOrdersAccepted);
  }
  catch (error) {
    res.status(500).json(error);
  }
});

//Return an internal order, given its id.
app.get('/api/internalOrders/:id', async (req, res) => {

  if (req.params.id === undefined || req.params.id == '' || isNaN(req.params.id)) {
    return res.status(422).end();
  }
  try {
    const internalOrder = await internalOrdersDAO.findIntOrder(req.params.id);
    if (internalOrder === null)
      res.status(404).end();
    res.status(200).json(internalOrder);
  }
  catch (error) {
    res.status(500).json(error);
  }
});

//Creates a new internal order in state = ISSUED.
app.post('/api/internalOrders', async (req, res) => {
  if (Object.keys(req.header).length === 0
    || req.body.issueDate === undefined
    || req.body.products === undefined
    || req.body.customerId === undefined)
    return res.status(422).end();

  let issueDate = req.body.issueDate;
  let products = req.body.products;
  let customerId = req.body.customerId;


  try {
    await internalOrdersDAO.createIntOrder(issueDate, products, customerId);
    res.status(201).end();
  }
  catch (error) {
    res.status(503).json(error);
  }

});

//Modify the state of an internal order, given its id. If newState is = COMPLETED an array of RFIDs is sent
app.put('/api/internalOrders/:id', async (req, res) => {
  if (Object.keys(req.header).length === 0 || req.params.id === undefined || req.params.id == '' || isNaN(req.params.id))
    return res.status(422).end();


  let newState = req.body.newState;
  let products = req.body.products;


  try {
    let found = await internalOrdersDAO.updateIntOrder(newState, products);
    if (found === null)
      res.status(404).end();
    res.status(200).end();
  }
  catch (error) {
    res.status(503).json(error);
  }
});


//Delete an internal order, given its id.
app.delete('/api/internalOrders/:id', async (req, res) => {

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
app.get('/api/items', async (req, res) => {
  try {
    const listItems = await itemsDAO.listItems();
    res.status(200).json(listItems)
  }
  catch (error) {
    res.status(500).json(error);
  }
});

//Return an item, given its id..
app.get('/api/items/:id', async (req, res) => {

  if (req.params.id === undefined || req.params.id == '' || isNaN(req.params.id)) {
    return res.status(422).end();
  }
  try {
    const item = await itemsDAO.findItem(req.params.id);
    if (item === null)
      res.status(404).end();
    res.status(200).json(item);
  }
  catch (error) {
    res.status(500).json(error);
  }
});

//Creates a new Item.
app.post('/api/item', async (req, res) => {
  if (Object.keys(req.header).length === 0
    || req.body.description === undefined
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
    await itemsDAO.createItem(description, id, SKUId, notes, supplierId, price);
    res.status(201).end();
  }
  catch (error) {
    res.status(503).json(error);
  }

});

//Modify an existing item.
app.put('/api/item/:id', async (req, res) => {
  if (Object.keys(req.header).length === 0
    || req.params.id === undefined
    || req.params.id == ''
    || isNaN(req.params.id)
    || req.body.newDescription === undefined
    || req.body.newPrice === undefined)
    return res.status(422).end();

  let description = req.body.newDescription;
  let price = req.body.newPrice;

  try {
    let found = await itemsDAO.updateItem(req.params.id, description, price);
    if (found === null)
      res.status(404).end();
    res.status(200).end();
  }
  catch (error) {
    res.status(503).json(error);
  }
});

//Delete an item receiving its id.
app.delete('/api/items/:id', async (req, res) => {

  if (req.params.id === undefined || req.params.id == '' || isNaN(req.params.id))
    return res.status(422).end();

  try {
    await itemsDAO.deleteItem(req.params.id);
    res.status(204).end();
  }
  catch (error) {
    res.status(503).json(error);
  }
});















// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;

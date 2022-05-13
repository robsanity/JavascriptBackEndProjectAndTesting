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
  if (Object.keys(req.header).length === 0 || req.body.description === undefined || req.body.weight === undefined || req.body.volume === undefined || req.body.notes === undefined || req.body.price === undefined || req.body.availableQuantity === undefined) {
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
  if (Object.keys(req.header).length === 0 || req.body.description === undefined || req.body.weight === undefined || req.body.volume === undefined || req.body.notes === undefined || req.body.price === undefined || req.body.availableQuantity === undefined) {
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
    let found = await SKUsDAO.updateSKU(req.params.id, description,  weight, volume, notes, price, availableQuantity);
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
  if (Object.keys(req.header).length === 0 || req.body.position === null)
    return res.status(422).end();
 //Come implementare:   422 Unprocessable Entity (position isn't capable to satisfy volume and weight constraints for available quantity of sku or position is already assigned to a sku)
  try {
    await SKUsDAO.updatePosition(req.params.id, req.body.position);
    res.status(200).end();
  }
  catch (error) {
    res.status(503).json(error);
  }
});

//Delete a SKU receiving its id.
app.delete('/api/skus/:id', async (req, res) => {

  if (req.params.id === null)
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
  } catch (error) {
    res.status(500).json(error);
  }

});

//Return an array containing all SKU items for a certain SKUId with Available = 1.
app.get('/api/skuitems/sku/:id', async (req, res) => {

  if (req.params.id === null) {
    return res.status(422).json({ error: `Empty params request` });
  }
  try {
    const SKUItemsAvailable = await SKUItemsDAO.findSKUItems(req.params.id);
    res.status(200).json(SKUItemsAvailable);
  } catch (error) {
    res.status(500).json(error);
  }

});

//Return a SKU item, given its RFID.
app.get('/api/skuitems/:rfid', async (req, res) => {

  if (req.params.rfid === null) {
    return res.status(422).json({ error: `Empty params request` });
  }
  try {
    const SKUItem = await SKUItemsDAO.findSKUItem(req.params.rfid);
    res.status(200).json(SKUItem)
  } catch (error) {
    res.status(500).json(error);
  }

});


//Creates a new SKU item with Available =0.
app.post('/api/skuitem', async (req, res) => {
  if (Object.keys(req.header).length === 0 || req.body === null)
    return res.status(422).json({ error: `Empty params request` });

  try {
    await SKUItemsDAO.reateSKUItem(req.body);
    res.status(201).end();
  } catch (error) {
    res.status(503).json(error);
  }
});


//Modify RFID, available and date of stock fields of an existing SKU Item.
app.put('/api/skuitems/:rfid', async (req, res) => {
  if (Object.keys(req.header).length === 0 || req.params.rfid === null || req.body === null)
    return res.status(422).json({ error: `Empty params request` });

  try {
    await SKUItemsDAO.modifySKUItem(req.params.rfid);
    res.status(200).end();
  } catch (error) {
    res.status(500).json(error);
  }
});


//Delete a SKU item receiving his rfid.
app.delete('/api/skuitems/:rfid', async (req, res) => {
  if (req.params.rfid === null)
    return res.status(422).json({ error: `Empty params request` });

  try {
    const SKU = await SKUItemsDAO.deleteSKUItem(req.params.rfid);
    res.status(204).end();
  } catch (error) {
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

  if (Object.keys(req.header).length === 0 || req.body === null)
    return res.status(422).json({ error: `Empty params request` });

  try {
    await positionsDAO.createPositions(req.body);
    res.status(201).end();
  } catch (error) {
    res.status(503).json(error);
  }

});


//Modify a position identified by positionID.
app.put('/api/position/:positionID', async (req, res) => {

  if (Object.keys(req.header).length === 0 || req.params.positionID === null)
    return res.status(422).json({ error: `Empty params request` });

  try {
    await positionsDAO.modifyPosition(req.params.positionID);
    res.status(200).end();
  } catch (error) {
    res.status(503).json(error);
  }
});

//Modify the positionID of a position, given its old positionID.
app.put('/api/position/:positionID/changeID', async (req, res) => {

  if (Object.keys(req.header).length === 0 || req.params.positionID === null)
    return res.status(422).json({ error: `Empty params request` });

  try {
    await positionsDAO.modifyPositionID(req.params.positionID);
    res.status(200).end();
  } catch (error) {
    res.status(503).json(error);
  }
});

//Delete a SKU item receiving his positionID.
app.delete('/api/position/:positionID', async (req, res) => {

  if (Object.keys(req.header).length === 0 || req.body === null)
    return res.status(422).json({ error: `Empty params request` });

  try {
    await positionsDAO.deletePosition(req.params.positionID);
    res.status(204).end();
  } catch (error) {
    res.status(503).json(error);
  }

});


/* ---------------------------------------------------------------------------- */
/* LORENZO */

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
    res.status(500).json( {error: error }).end();
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

    await testResultsDAO.updateTestResults(id, rfid,  newIdTestDescriptor, newDate, newResult);
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

    let userWithType = await usersDAO.checkUserWithType(username, oldType);
    if (userWithType.length === 0) {
      res.status(404).end();
    }

    await usersDAO.updateUser(username, oldType, newType);
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

    let user = await usersDAO.checkUserWithType(username, oldType);

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
      .filter((p) => p.idRestockOrder==r.idRestockOrder)
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
      .filter((p) => p.idRestockOrder==r.idRestockOrder)
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
      .filter((p) => p.idRestockOrder==r.idRestockOrder)
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
    if (rO.length===0) {
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
      .filter((p) => p.idRestockOrder==r.idRestockOrder)
      .map(element => (
        {
          idSKU: element.idSKU,
          description: element.description,
          price: element.price,
          qty: element.availableQuantity
        }
      )),
      skuItems: productsQuery
      .filter((p) => p.idRestockOrder==r.idRestockOrder)
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
    if (rO.length===0) {
      res.status(404).end();
    }

    await restockOrdersDAO.getToBeReturnRestockOrders(id);
    



  } catch(error) {
    res.status(500).json();
  }
})
//--------------------------------------|   POST   |------------------------------------------------

//--------------------------------------|   PUT   |-------------------------------------------------

//--------------------------------------|   DELETE   |----------------------------------------------



//------------------------------------------------------------------------------------------------
//                                      ITEM
//------------------------------------------------------------------------------------------------



//--------------------------------------|   GET   |------------------------------------------------
app.get('/api/items', async (req, res) => {

  try {
    const item = await ITEMDAO.listItem();
    res.status(200).json(item)
  } catch (error) {

    if (Unathorized)
      return res.status(401) //Unathorized (not logged in or wrong permissions)

    if (Internal_Server_Error)
      return res.status(500) //Internal_Server_Error

  }
});

//--------------------------------------|   POST   |------------------------------------------------

//--------------------------------------|   PUT   |-------------------------------------------------

//--------------------------------------|   DELETE   |----------------------------------------------



















// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;

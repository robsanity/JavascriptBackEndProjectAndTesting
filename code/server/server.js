'use strict';
const express = require('express');
const testDescriptorsDAO = require('./modules/testDescriptorsDAO');
const testResultsDAO = require('./modules/testResultsDAO');
const usersDAO = require('./modules/usersDAO');
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
    if(SKU === null)
      res.status(404).end();
    res.status(200).json(SKU);
  }
  catch (error) {
    res.status(500).json(error);
  }
});

//Creates a new SKU with an empty array of testDescriptors.
app.post('/api/sku', async (req, res) => {
  if (Object.keys(req.header).length === 0 || req.body.description === null || req.body.weight === null || req.body.volume === null || req.body.notes === null || req.body.price === null || req.body.availableQuantity === null || req.body.testDescriptors === null ) {
    return res.status(422).end();
  }

  //Ricavo gli attributi necessari a creare una nuova SKU e li passo a createSKU
  let description = req.body.description;
  let weight = req.body.weight;
  let volume = req.body.volume;
  let notes = req.body.notes;
  let price = req.body.price;
  let availableQuantity = req.body.availableQuantity;
  let testDescriptors = [];

  try {
    await SKUsDAO.createSKU(description, weight, volume, notes, price, availableQuantity, testDescriptors);
    res.status(201).end();
  } catch (error) {
    res.status(503).json(error);
  }

});

//Modify an existing SKU. When a newAvailableQuantity is sent, occupiedWeight and occupiedVolume fields of the position 
//(if the SKU is associated to a position) are modified according to the new available quantity.
app.put('/api/sku/:id', async (req, res) => {
  if (Object.keys(req.header).length === 0 || req.body === null) {
    return res.status(422).json({ error: `Empty params request` });
  }

  let description = req.body.description;
  let weight = req.body.weight;
  let volume = req.body.volume;
  let notes = req.body.notes;
  let price = req.body.price;
  let availableQuantity = req.body.availableQuantity;
  let testDescriptors = req.body.testDescriptors;

  try {
    await SKUsDAO.updateSKU(req.params.id, {
      description: description, weight: weight, volume: volume,
      notes: notes, price: price, availableQuantity: availableQuantity, testDescriptors: testDescriptors
    });
    res.status(200).end();
  } catch (error) {
    res.status(503).json(error);
  }
});


//Add or modify position of a SKU. When a SKU is associated to a position, occupiedWeight and occupiedVolume fields of the position
//are modified according to the available quantity.
app.put('/api/sku/:id/position', async (req, res) => {
  if (Object.keys(req.header).length === 0 || req.body === null)
    return res.status(422).json({ error: `Empty params request` });

  try {
    await SKUsDAO.updatePosition(req.params.id, req.body.position);
    res.status(200).end();
  } catch (error) {
    res.status(503).json(error);
  }
});

//Delete a SKU receiving its id.
app.delete('/api/skus/:id', async (req, res) => {

  if (req.params.id === null)
    return res.status(422).json({ error: `Empty params request` });

  try {
    await SKUsDAO.deleteSKU(req.params.id);
    res.status(204).end();
  } catch (error) {
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
    const testDescriptor = await testDescriptorsDAO.getByIdTestDescriptors(testDescriptorId);
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

    //  INSERIRE GET SKU BY ID
    let sku = await SKUsDAO.findSKU();

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

    let td = await testDescriptorsDAO.getByIdTestDescriptors(id);

    if (td.length === 0) {
      res.status(404).end();
    }

    await testDescriptorsDAO.updateTestDescriptor(id);
    res.status(200).end();
  }
  catch (error) {
    res.status(503).end()
  }
});

//--------------------------------------|   PUT   |------------------------------------------------
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
app.get('api/skuitems/:rfid/testResults', async (req, res) => {
  try {
    if (Object.keys(req.header).length === 0) {
      res.status(422).end();
    }
    let rfid = req.params.rfid;
    if (rfid === undefined || rfid === '' || isNaN(rfid)) {
      res.status(422).end();
    }

    let checkRfid = await testResultsDAO.checkRfid(rfid);
    if (checkRfid.length === 0) {
      res.status(404).end()
    }

    const listTestResults = await testResultsDAO.getTestResults(rfid);
    res.status(200).end()
  } catch (error) {
    res.status(500).end();
  }
})

app.get('api/skuitems/:rfid/testResults/:id', async (req, res) => {
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

    const listTestResults = await testResultsDAO.getByIdTestResultsById(rfid, id);
    res.status(200).json(listTestResults)
  } catch (error) {
    res.status(500).json();
  }
})

//--------------------------------------|   POST   |------------------------------------------------

//--------------------------------------|   PUT   |------------------------------------------------

//--------------------------------------|   DELETE   |------------------------------------------------




//------------------------------------------------------------------------------------------------
//                                       USER
//------------------------------------------------------------------------------------------------

//--------------------------------------|   GET   |------------------------------------------------
app.get('/api/suppliers', async (req, res) => {
  try {
    const suppliers = await usersDAO.listSuppliers();
    res.status(200).json(suppliers)
  } catch (error) {
    res.status(500).json();
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await usersDAO.listUsers();
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json();
  }
});

//--------------------------------------|   POST   |------------------------------------------------

//--------------------------------------|   PUT   |-------------------------------------------------

//--------------------------------------|   DELETE   |----------------------------------------------

//------------------------------------------------------------------------------------------------
//                                      RESTOCK ORDERS
//------------------------------------------------------------------------------------------------



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
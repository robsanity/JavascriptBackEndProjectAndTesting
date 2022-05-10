'use strict';
const express = require('express');
const { validationResult } = require('express-validator');
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
app.get('/api/skus', (req, res) => {
  DAO.listSKUs()
      .then((SKUs) => { res.status(200).json(SKUs); })
      .catch((error) => { res.status(500).json(error) });
});

//Return a SKU, given its id.
app.get('/api/skus/:id', (req, res) => {
  const errors = validationResult(req); //Disponibile via require('express-validator'), estrae i validation errors da una request e li rende disponibili in un oggetto Result.
  if (!errors.isEmpty()) {  //Controllo di errori generici
      return res.status(422).json({ errors: errors.array() }); //(422)validation of id failed
  }

  DAO.findSKU(req.params.id)    //dentro req.params.id c'è l'id del SKU e lo passiamo a findSKU (definita in DAO.js)
      .then((SKU) => { res.status(200).json(SKU); })  //Se trovato ritorna l'oggetto...
      .catch((error) => { res.status(500).json(error) }); //...errore altrimenti
});

//Creates a new SKU with an empty array of testDescriptors.
app.post('/api/sku', (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
  }

  //Ricavo gli attributi necessari a creare una nuova SKU e li passo a createSKU
  let description = req.body.description;
  let weight = req.body.weight;
  let volume = req.body.volume;
  let notes = req.body.notes;
  let price = req.body.price;
  let availableQuantity = req.body.availableQuantity;
  let testDescriptors = [];

  DAO.createSKU({
      description: description, weight: weight, volume: volume,
      notes: notes, price: price, availableQuantity: availableQuantity, testDescriptors: testDescriptors
  })
      .then(() => { res.status(201).end(); })
      .catch((error) => { res.status(500).json(error); });
});

//Modify an existing SKU. When a newAvailableQuantity is sent, occupiedWeight and occupiedVolume fields of the position 
//(if the SKU is associated to a position) are modified according to the new available quantity.
app.put('/api/sku/:id',  (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
  }

  let description = req.body.description;
  let weight = req.body.weight;
  let volume = req.body.volume;
  let notes = req.body.notes;
  let price = req.body.price;
  let availableQuantity = req.body.availableQuantity;
  let testDescriptors = req.body.testDescriptors;

  DAO.updateSKU(req.params.id, {
      description: description, weight: weight, volume: volume,
      notes: notes, price: price, availableQuantity: availableQuantity, testDescriptors: testDescriptors
  })
      .then((result) => {
          if (!result.error)
              res.status(200).end();
          else
              res.status(404).json(result);
      })
      .catch((error) => { res.status(503).json(error); });
});


//Add or modify position of a SKU. When a SKU is associated to a position, occupiedWeight and occupiedVolume fields of the position
//are modified according to the available quantity.
app.put('/api/sku/:id/position', (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
  }

  DAO.updatePosition(req.params.id, req.body.position)
      .then((result) => {
          if (!result.error)
              res.status(200).end();
          else
              res.status(404).json(result);
      })
      .catch((error) => { res.status(503).json(error); });
});

//Delete a SKU receiving its id.
app.delete('/api/skus/:id', (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
  }

  DAO.deleteSKU(req.params.id)
      .then((result) => {
          if (!result.error)
              res.status(204).end();
      })
      .catch((error) => { res.status(503).json(error); });
});


//------------------------------------------------------------------------------------------------
//                                     SKU Items
//------------------------------------------------------------------------------------------------


//Return an array containing all SKU items
app.get('/api/skuitems', (req,res)=>{

  if(ok){
    return res.status(200).json(SKU_array);
  }

  if(Unathorized)
    return res.status(401) //Unathorized (not logged in or wrong permissions)

  if(Internal_Server_Error)
    return res.status(500) //generic error

});

//Return an array containing all SKU items for a certain SKUId with Available = 1.
app.get('/api/skuitems/sku/:id', (req,res)=>{

  if(ok){
    return res.status(200).json(SKU_array);
  }

  if(Unathorized)
    return res.status(401) //Unathorized (not logged in or wrong permissions)

  if(Internal_Server_Error)
    return res.status(500) //generic error

  if(Unprocessable_Entity)
    return res.status(422) //validation of id failed
    
  if(Not_Found)
  return res.status(404) // no SKU associated to id

});

//Return a SKU item, given its RFID.
app.get('/api/skuitems/:rfid', (req,res)=>{

  if(ok){
    return res.status(200).json(SKU_item);
  }

  if(Unathorized)
    return res.status(401) //Unathorized (not logged in or wrong permissions)

  if(Internal_Server_Error)
    return res.status(500) //generic error

  if(Unprocessable_Entity)
    return res.status(422) //validation of rfid failed
    
  if(Not_Found)
  return res.status(404) // no SKU item associated to rfid

});


//Creates a new SKU item with Available =0.
app.post('/api/skuitem', (req,res)=>{

  if(ok){
    return res.status(201);
  }

  if(Unathorized)
    return res.status(401) //Unathorized (not logged in or wrong permissions)

  if(Internal_Server_Error)
    return res.status(500) //generic error

  if(Unprocessable_Entity)
    return res.status(422) //validation of request body failed
    
  if(Not_Found)
  return res.status(404) // no SKU associated to SKUid

});


//Modify RFID, available and date of stock fields of an existing SKU Item.
app.put('/api/skuitems/:rfid', (req,res)=>{

  if(ok){
    //Dentro req c'è la nuova position da aggiungere o modificare
    return res.status(200);
  }

  if(Unathorized)
    return res.status(401) //Unathorized (not logged in or wrong permissions)

  if(Service_Unavailable)
    return res.status(503) //generic error

  if(Unprocessable_Entity)
    return res.status(422) //validation of request body or of rfid failed

  if(Not_Found)
    return res.status(404) // no SKU Item associated to rfid
});


//Delete a SKU item receiving his rfid.
app.delete('/api/skuitems/:rfid', (req,res)=>{

  if(ok){
    //Dentro req.header c'è l'rfid
    return res.status(204);
  }

  if(Unathorized)
    return res.status(401) //Unathorized (not logged in or wrong permissions)

  if(Service_Unavailable)
    return res.status(503) //generic error

  if(Unprocessable_Entity)
    return res.status(422) //validation of rfid failed

});

//------------------------------------------------------------------------------------------------
//                                     Positions
//------------------------------------------------------------------------------------------------



//Return an array containing all positions.
app.get('/api/positions', (req,res)=>{

  if(ok){
    return res.status(200).json(Positions_array);
  }

  if(Unathorized)
    return res.status(401) //Unathorized (not logged in or wrong permissions)

  if(Internal_Server_Error)
    return res.status(500) //generic error

});


//Creates a new Position.
app.post('/api/position', (req,res)=>{

  if(ok){
    return res.status(201);
  }

  if(Unathorized)
    return res.status(401) //Unathorized (not logged in or wrong permissions)

  if(Unprocessable_Entity)
    return res.status(422) //validation of request body failed
    
  if(Service_Unavailable)
  return res.status(503) // generic error

});


//Modify a position identified by positionID.
app.put('/api/position/:positionID', (req,res)=>{

  if(ok){
    return res.status(200);
  }

  if(Unathorized)
    return res.status(401) //Unathorized (not logged in or wrong permissions)

  if(Service_Unavailable)
    return res.status(503) //generic error

  if(Unprocessable_Entity)
    return res.status(422) //validation of request body or of positionID failed

  if(Not_Found)
    return res.status(404) // no position associated to positionID
});



//Modify the positionID of a position position, given its old positionID.
app.put('/api/position/:positionID/changeID', (req,res)=>{

  if(ok){
    return res.status(200);
  }

  if(Unathorized)
    return res.status(401) //Unathorized (not logged in or wrong permissions)

  if(Service_Unavailable)
    return res.status(503) //generic error

  if(Unprocessable_Entity)
    return res.status(422) //validation of request body or of positionID failed

  if(Not_Found)
    return res.status(404) //no position associated to positionID
});


//Delete a SKU item receiving his positionID.
app.delete('/api/position/:positionID', (req,res)=>{

  if(ok){
    return res.status(204);
  }

  if(Unathorized)
    return res.status(401) //Unathorized (not logged in or wrong permissions)

  if(Service_Unavailable)
    return res.status(503) //generic error

  if(Unprocessable_Entity)
    return res.status(422) //validation of positionID failed

});


/* ---------------------------------------------------------------------------- */
/* LORENZO */

//------------------------------------------------------------------------------------------------
//                                      TEST DESCRIPTOR
//------------------------------------------------------------------------------------------------
app.get('/api/testDescriptors', async (req, res) => {
  try {
      const listTestDescriptors = await testDescriptorsDAO.listTestDescriptors();
      res.status(200).json(listTestDescriptors)
  } catch (error) {
      res.status(500).json();
  }
});

app.get('/api/testDescriptors/:id', async (req, res) => {
  if (Object.keys(req.header).length === 0) {
      return res.status(422).json({ error: `Empty params request` });
  }
  let testDescriptorId = req.params.id;
  if (testDescriptorId === undefined || testDescriptorId.id === undefined || testDescriptorId.id == '') {
      return res.status(422).json({ error: `Invalid id data` });
  }

  try {
      const testDescriptor = await testDescriptorsDAO.testDescriptorsById(testDescriptorId);
      res.status(200).json(testDescriptor)
  } catch (error) {
      res.status(404).json();
  }
});

//------------------------------------------------------------------------------------------------
//                                      TEST RESULT
//------------------------------------------------------------------------------------------------
app.get('api/skuitems/:rfid/testResults', async (req, res) => {
  if (Object.keys(req.header).length === 0) {
      return res.status(422).json({ error: `Empty params request` });
  }
  let rfid = req.params.rfid;
  if (rfid === undefined || rfid.rfid === undefined || rfid.rfid === '') {
      return res.status(422).json({ error: `Invalid rfid data` });
  }

  try {
      const listTestResults = await testResultsDAO.listTestResults(rfid);
      res.status(200).json(listTestResults)
  } catch (error) {
      res.status(500).json();
  }
})

app.get('api/skuitems/:rfid/testResults/:id', async (req, res) => {
  if (Object.keys(req.header).length === 0) {
      return res.status(422).json({ error: `Empty params request` });
  }
  let rfid = req.params.rfid;
  let id = req.params.id;
  if (rfid === undefined || rfid.rfid === undefined || rfid.rfid === '' ||
      id === undefined || id.id === undefined || id === '') {
      return res.status(422).json({ error: `Invalid rfid or id data` });
  }

  try {
      const listTestResults = await testResultsDAO.listTestResultsById(rfid, id);
      res.status(200).json(listTestResults)
  } catch (error) {
      res.status(500).json();
  }
})

//------------------------------------------------------------------------------------------------
//                                       USER
//------------------------------------------------------------------------------------------------
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

    if(Unathorized)
      return res.status(401) //Unathorized (not logged in or wrong permissions)
  
    if(Internal_Server_Error)
      return res.status(500) //Internal_Server_Error
  
  }
});

//--------------------------------------|   POST  |------------------------------------------------

//----------------------|   PUT  |

//----------------------|   DELETE  |



















// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;
'use strict';
const express = require('express');
// init express
const app = new express();
const port = 3001;

app.use(express.json());

//GET /api/test
app.get('/api/hello', (req,res)=>{
  let message = {
    message: 'Hello World!'
  }
  return res.status(200).json(message);
});

//SKU APIs
//Return an array containing all SKUs.
app.get('/api/skus', (req,res)=>{

  if(ok){
    //SKU_array = chiamata funzione da SKU o DBInterface
    return res.status(200).json(SKU_array);
  }

  if(Unathorized)
    return res.status(401) //Unathorized (not logged in or wrong permissions)

  if(Internal_Server_Error)
    return res.status(500) //generic error
});


//Return a SKU, given its id.
app.get('/api/skus/:id', (req,res)=>{

  if(ok){
    //SKU_item = chiamata funzione da SKU o DBInterface
    return res.status(200).json(SKU_item);
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

//Creates a new SKU with an empty array of testDescriptors.
app.post('/api/sku', (req,res)=>{

  if(ok){
    //Dentro req c'è un item SKU da registrare
    return res.status(201);
  }

  if(Unathorized)
    return res.status(401) //Unathorized (not logged in or wrong permissions)

  if(Service_Unavailable)
    return res.status(503) //generic error

  if(Unprocessable_Entity)
    return res.status(422) //validation of request body failed
});


//Modify an existing SKU. When a newAvailableQuantity is sent, occupiedWeight and occupiedVolume fields of the position 
//(if the SKU is associated to a position) are modified according to the new available quantity.
app.put('/api/sku/:id', (req,res)=>{

  if(ok){
    //Dentro req c'è il new item SKU da sovrascrivere a quello esistente
    return res.status(201);
  }

  if(Unathorized)
    return res.status(401) //Unathorized (not logged in or wrong permissions)

  if(Service_Unavailable)
    return res.status(503) //generic error

  if(Unprocessable_Entity)
    return res.status(422) //validation of request body failed
    
  if(Not_Found)
    return res.status(404) // SKU not existing
});


//Add or modify position of a SKU. When a SKU is associated to a position, occupiedWeight and occupiedVolume fields of the position
//are modified according to the available quantity.
app.put('/api/sku/:id/position', (req,res)=>{

  if(ok){
    //Dentro req c'è la nuova position da aggiungere o modificare
    return res.status(200);
  }

  if(Unathorized)
    return res.status(401) //Unathorized (not logged in or wrong permissions)

  if(Service_Unavailable)
    return res.status(503) //generic error

  if(Unprocessable_Entity)
    return res.status(422) //validation of position through the algorithm failed or position isn't capable to satisfy volume 
                          //and weight constraints for available quantity of sku or position is already assigned to a sku

  if(Not_Found)
    return res.status(404) // Position or SKU not existing
});


//Delete a SKU receiving its id.
app.delete('/api/skus/:id', (req,res)=>{

  if(ok){
    //Dentro req.header c'è l'id
    return res.status(204);
  }

  if(Unathorized)
    return res.status(401) //Unathorized (not logged in or wrong permissions)

  if(Service_Unavailable)
    return res.status(503) //generic error

  if(Unprocessable_Entity)
    return res.status(422) //validation of id failed

});

//-----------------------------------------------------

//SKU_Items APIs

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


//---------------------------------------
//Positions APIs


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




































// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;
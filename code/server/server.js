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
//...









// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;
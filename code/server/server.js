'use strict';
const express = require('express');
const router = require('./router/router');

const sqlite = require('sqlite3');
// init express
const app = new express();
const port = 3001;


app.use(express.json());
app.use('/', router);


const db = new sqlite.Database('database.db', (err) => {
  if (err) throw err;
});

handleDB();

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

function createTable() {
  return new Promise((resolve, reject) => {
    let sql = 'CREATE TABLE IF NOT EXISTS "Users" ("idUser"	INTEGER NOT NULL UNIQUE, "name"	TEXT NOT NULL, "surname"	TEXT NOT NULL, "email"	TEXT NOT NULL, "type"	TEXT NOT NULL, "password"	TEXT, PRIMARY KEY("idUser" AUTOINCREMENT) );'

    db.run(sql, [], function (err) {
      if (err) {
        reject({  error: "no create db" });
      }
    });

    sql = ' CREATE TABLE IF NOT EXISTS "InternalOrders" ( 	"idInternalOrder"	INTEGER NOT NULL, 	"date"	TEXT NOT NULL, 	"state"	TEXT NOT NULL DEFAULT \'ISSUED\', 	"idCustomer"	INTEGER NOT NULL, 	FOREIGN KEY("idCustomer") REFERENCES "Users"("idUser"), 	PRIMARY KEY("idInternalOrder" AUTOINCREMENT) ) ; '

    db.run(sql, [], function (err) {
      if (err) {
        reject({ error: "no create db" });
      }
    });

    sql = ' CREATE TABLE IF NOT EXISTS "InternalOrdersSKUs" ( 	"idInternalOrder"	INTEGER NOT NULL, 	"idSKU"	INTEGER NOT NULL, 	"quantity"	INTEGER NOT NULL, 	FOREIGN KEY("idInternalOrder") REFERENCES "InternalOrders"("idInternalOrder"), 	FOREIGN KEY("idSKU") REFERENCES "SKUs"("idSKU"), 	PRIMARY KEY("idInternalOrder","idSKU") ) ; '

    db.run(sql, [], function (err) {
      if (err) {
        reject({ error: "no create db" });
      }
    });

    sql = ' CREATE TABLE IF NOT EXISTS "Items" ( 	"idItems"	INTEGER NOT NULL DEFAULT 0 UNIQUE, 	"idSKU"	INTEGER NOT NULL, 	"description"	TEXT NOT NULL, 	"price"	INTEGER NOT NULL, 	"idSupplier"	INTEGER NOT NULL, 	PRIMARY KEY("idItems" AUTOINCREMENT), 	FOREIGN KEY("idSupplier") REFERENCES "Users"("idUser"), 	FOREIGN KEY("idSKU") REFERENCES "SKUs"("idSKU") ) ; '

    db.run(sql, [], function (err) {
      if (err) {
        reject({ error: "no create db" });
      }
    });

    sql = ' CREATE TABLE IF NOT EXISTS "Positions" ( 	"idPosition"	INTEGER NOT NULL UNIQUE, 	"aisleId"	INTEGER NOT NULL, 	"row"	INTEGER NOT NULL, 	"col"	INTEGER NOT NULL, 	"maxWeight"	INTEGER NOT NULL, 	"occupiedWeight"	INTEGER DEFAULT 0, 	"maxVolume"	INTEGER NOT NULL, 	"occupiedVolume"	INTEGER DEFAULT 0, 	PRIMARY KEY("idPosition") ) ; '

    db.run(sql, [], function (err) {
      if (err) {
        reject({ error: "no create db" });
      }
    });

    sql = ' CREATE TABLE IF NOT EXISTS "Products" ( 	"idSKU"	INTEGER NOT NULL, 	"description"	VARCHAR, 	"price"	INTEGER, 	"RFID"	TEXT NOT NULL, 	"idReturnOrder"	INTEGER, 	FOREIGN KEY("idSKU") REFERENCES "SKUs"("idSKU"), 	FOREIGN KEY("RFID") REFERENCES "SKUItems"("RFID"), 	PRIMARY KEY("idSKU","RFID"), 	FOREIGN KEY("idReturnOrder") REFERENCES "ReturnOrders"("idReturnOrder") ) ; '

    db.run(sql, [], function (err) {
      if (err) {
        reject({ error: "no create db" });
      }
    });

    sql = ' CREATE TABLE IF NOT EXISTS "RestockOrderItems" ( 	"idRestockOrder"	INTEGER NOT NULL, 	"idItem"	INTEGER NOT NULL, 	"quantity"	INTEGER NOT NULL, 	FOREIGN KEY("idRestockOrder") REFERENCES "RestockOrders"("idRestockOrder"), 	PRIMARY KEY("idRestockOrder","idItem") ) ; '

    db.run(sql, [], function (err) {
      if (err) {
        reject({ error: "no create db" });
      }
    });

    sql = ' CREATE TABLE IF NOT EXISTS "RestockOrders" ( 	"idRestockOrder"	INTEGER NOT NULL, 	"issueDate"	DATE NOT NULL, 	"state"	VARCHAR NOT NULL DEFAULT \'ISSUED\', 	"idSupplier"	INTEGER NOT NULL, 	"transportNote"	VARCHAR, 	FOREIGN KEY("idSupplier") REFERENCES "Users"("idUser"), 	PRIMARY KEY("idRestockOrder" AUTOINCREMENT) ) ; '

    db.run(sql, [], function (err) {
      if (err) {
        reject({ error: "no create db" });
      }
    });

    sql = ' CREATE TABLE IF NOT EXISTS "ReturnOrders" ( 	"idReturnOrder"	INTEGER NOT NULL, 	"returnDate"	DATE NOT NULL, 	"idRestockOrder"	INTEGER NOT NULL, 	"idSKUItem"	TEXT NOT NULL, 	FOREIGN KEY("idSKUItem") REFERENCES "SKUItems"("RFID"), 	PRIMARY KEY("idReturnOrder","idSKUItem") ) ; '

    db.run(sql, [], function (err) {
      if (err) {
        reject({ error: "no create db" });
      }
    });

    sql = ' CREATE TABLE IF NOT EXISTS "SKUItems" ( 	"RFID"	TEXT NOT NULL, 	"idSKU"	INTEGER NOT NULL, 	"available"	INTEGER DEFAULT 0, 	"dateOfStock"	DATE, 	"internalOrderId"	INTEGER, 	"restockOrderId"	INTEGER, 	"returnOrderId"	INTEGER, 	PRIMARY KEY("RFID"), 	FOREIGN KEY("idSKU") REFERENCES "SKUs"("idSKU"), 	FOREIGN KEY("returnOrderId") REFERENCES "ReturnOrders"("idReturnOrder") ) ; '

    db.run(sql, [], function (err) {
      if (err) {
        reject({ error: "no create db" });
      }
    });

    sql = ' CREATE TABLE IF NOT EXISTS "SKUs" ( 	"idSKU"	INTEGER NOT NULL, 	"description"	VARCHAR, 	"weight"	INTEGER, 	"volume"	INTEGER, 	"notes"	VARCHAR, 	"idPosition"	INTEGER, 	"availableQuantity"	INTEGER, 	"price"	INTEGER, 	"testDescriptor"	VARCHAR, 	FOREIGN KEY("idPosition") REFERENCES "Positions"("idPosition") ON DELETE SET NULL, 	PRIMARY KEY("idSKU" AUTOINCREMENT) ) ; '

    db.run(sql, [], function (err) {
      if (err) {
        reject({ error: "no create db" });
      }
    });

    sql = ' CREATE TABLE IF NOT EXISTS "TestDescriptors" ( 	"idDescriptor"	INTEGER NOT NULL, 	"name"	TEXT NOT NULL, 	"procedureDescription"	TEXT NOT NULL, 	"idSKU"	INTEGER NOT NULL, 	PRIMARY KEY("idDescriptor" AUTOINCREMENT), 	FOREIGN KEY("idSKU") REFERENCES "SKUs"("idSKU") ) ; '

    db.run(sql, [], function (err) {
      if (err) {
        reject({ error: "no create db" });
      }
    });

    sql = ' CREATE TABLE IF NOT EXISTS "TestResults" ( 	"idResults"	INTEGER NOT NULL, 	"idTestDescriptor"	INTEGER NOT NULL, 	"date"	TEXT NOT NULL, 	"result"	TEXT NOT NULL, 	"idSKUItem"	TEXT NOT NULL, 	PRIMARY KEY("idResults" AUTOINCREMENT), 	FOREIGN KEY("idTestDescriptor") REFERENCES "TestDescriptors"("idDescriptor"), 	FOREIGN KEY("idSKUItem") REFERENCES "SKUItems"("RFID") ) ; '

    db.run(sql, [], function (err) {
      if (err) {
        reject({ error: "no create db" });
      }
    });
    resolve(true);
    console.log("Database created");
  });
}

function prepareDatabase() {
  return new Promise((resolve, reject) => {
    let sql = 'INSERT INTO "Users" ("idUser", "name", "surname", "email", "type", "password") VALUES (1, "Test", "surname", "user1@ezwh.com", "customer", "testpassword");';
    db.run( sql, [], function ( err) {
      if ( err) {
        reject( err);
      }
    });

    sql = 'INSERT INTO "Users" ("idUser", "name", "surname", "email", "type", "password") VALUES (2, "Test", "surname", "qualityEmployee1@ezwh.com", "quality employee", "testpassword");';
    db.run( sql, [], function ( err) {
      if ( err) {
        reject( err);
      }
    });

    sql = 'INSERT INTO "Users" ("idUser", "name", "surname", "email", "type", "password") VALUES (3, "Test", "surname", "clerk1@ezwh.com", "clerk", "testpassword");';
    db.run( sql, [], function ( err) {
      if ( err) {
        reject( err);
      }
    });

    sql = 'INSERT INTO "Users" ("idUser", "name", "surname", "email", "type", "password") VALUES (4, "Test", "surname", "deliveryEmployee1@ezwh.com", "delivery employee", "testpassword");';
    db.run( sql, [], function ( err) {
      if ( err) {
        reject( err);
      }
    });

    sql = 'INSERT INTO "Users" ("idUser", "name", "surname", "email", "type", "password") VALUES (5, "Test", "surname", "supplier1@ezwh.com", "supplier", "testpassword");';
    db.run( sql, [], function ( err) {
      if ( err) {
        reject( err);
      }
    });

    sql = 'INSERT INTO "Users" ("idUser", "name", "surname", "email", "type", "password") VALUES (6, "Test", "surname", "manager1@ezwh.com", "manager", "testpassword");';
    db.run( sql, [], function ( err) {
      if ( err) {
        reject( err);
      }
    });
    console.log("Users created")
    resolve();
  });
}

async function handleDB() {
  await createTable();
  await prepareDatabase();
}

module.exports = app;

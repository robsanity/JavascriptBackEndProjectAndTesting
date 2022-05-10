BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "JunkTableSkuDescriptors" (
	"idSKU"	INTEGER,
	"idDescriptor"	INTEGER,
	FOREIGN KEY("idDescriptor") REFERENCES "TestDescriptors"("idDescriptors"),
	PRIMARY KEY("idDescriptor")
);
CREATE TABLE IF NOT EXISTS "Positions" (
	"idPosition"	INTEGER,
	"aisleId"	INTEGER,
	"Row"	INTEGER,
	"Col"	INTEGER,
	"maxWeight"	INTEGER,
	"occupiedWeight"	INTEGER,
	"maxVolume"	INTEGER,
	"occupiedVolume"	INTEGER,
	PRIMARY KEY("idPosition")
);
CREATE TABLE IF NOT EXISTS "Users" (
	"idUser"	INTEGER,
	"name"	TEXT,
	"surname"	TEXT,
	"email"	TEXT,
	"type"	TEXT,
	"password"	TEXT,
	PRIMARY KEY("idUser")
);
CREATE TABLE IF NOT EXISTS "Items" (
	"idItems"	INTEGER,
	"idSKU"	INTEGER,
	"description"	TEXT,
	"price"	INTEGER,
	FOREIGN KEY("idSKU") REFERENCES "SKUs"("idSKU"),
	PRIMARY KEY("idItems")
);
CREATE TABLE IF NOT EXISTS "SKUItems" (
	"RFID"	NUMERIC,
	"idSKU"	INTEGER,
	"Avaible"	INTEGER,
	"dateOfStock"	TEXT,
	FOREIGN KEY("idSKU") REFERENCES "SKUs"("idSKU"),
	PRIMARY KEY("RFID")
);
CREATE TABLE IF NOT EXISTS "SKUs" (
	"idSKU"	INTEGER,
	"Description"	TEXT,
	"Weight"	INTEGER,
	"Volume "	INTEGER,
	"Notes"	TEXT,
	"idPosition"	NUMERIC,
	"AvaibleQuantity"	INTEGER,
	"Price"	INTEGER,
	FOREIGN KEY("idPosition") REFERENCES "Positions"("idPosition"),
	PRIMARY KEY("idSKU")
);
CREATE TABLE IF NOT EXISTS "TestDescriptors" (
	"idDescriptors"	INTEGER,
	"name"	TEXT,
	"procedureDescription"	TEXT,
	"idTestResult"	INTEGER,
	FOREIGN KEY("idTestResult") REFERENCES "testResults"("idResults"),
	PRIMARY KEY("idDescriptors")
);
CREATE TABLE IF NOT EXISTS "testResults" (
	"idResults"	INTEGER,
	"idTestDescriptor"	INTEGER,
	"date"	TEXT,
	"Result"	TEXT,
	"idSKU"	INTEGER,
	FOREIGN KEY("idSKU") REFERENCES "SKUs"("idSKU"),
	FOREIGN KEY("idTestDescriptor") REFERENCES "TestDescriptors"("idDescriptors"),
	PRIMARY KEY("idResults")
);
CREATE TABLE IF NOT EXISTS "RestockOrders" (
	"idRestockOrder"	INTEGER,
	"issueDate"	TEXT,
	"state"	TEXT,
	"idUser"	INTEGER,
	FOREIGN KEY("idUser") REFERENCES "Users"("idUser"),
	PRIMARY KEY("idRestockOrder")
);
CREATE TABLE IF NOT EXISTS "SuppliersellItems" (
	"idSupplier"	INTEGER,
	"idItem"	INTEGER,
	FOREIGN KEY("idSupplier") REFERENCES "Users"("idUser"),
	FOREIGN KEY("idItem") REFERENCES "Items"("idItems"),
	PRIMARY KEY("idSupplier","idItem")
);
CREATE TABLE IF NOT EXISTS "JunkItemsOfRestockOrders" (
	"idRestockOrder"	INTEGER,
	"idItem"	INTEGER,
	"Quantity"	INTEGER,
	FOREIGN KEY("idItem") REFERENCES "Items"("idItems"),
	FOREIGN KEY("idRestockOrder") REFERENCES "JunkItemsOfRestockOrders"("idRestockOrder"),
	PRIMARY KEY("idRestockOrder","idItem")
);
CREATE TABLE IF NOT EXISTS "transportNotes" (
	"idTransportNote"	INTEGER,
	"shipmentDate"	TEXT,
	"idRestockOrder"	INTEGER,
	PRIMARY KEY("idTransportNote")
);
CREATE TABLE IF NOT EXISTS "InternalOrders" (
	"idInternalOrder"	INTEGER,
	"date"	TEXT,
	"from"	TEXT,
	"state"	TEXT,
	"idUser"	INTEGER,
	FOREIGN KEY("idUser") REFERENCES "Users"("idUser"),
	PRIMARY KEY("idInternalOrder")
);
CREATE TABLE IF NOT EXISTS "ReturnOrders" (
	"idReturnOrder"	INTEGER,
	"returnDate"	TEXT,
	"idRestockOrder"	INTEGER,
	"idSKUItem"	INTEGER UNIQUE,
	FOREIGN KEY("idRestockOrder") REFERENCES "RestockOrders",
	FOREIGN KEY("idSKUItem") REFERENCES "SKUItems"("RFID"),
	PRIMARY KEY("idReturnOrder","idSKUItem")
);
CREATE TABLE IF NOT EXISTS "InternalOrdersItems" (
	"idInternalOrders"	INTEGER,
	"idSKUItems"	INTEGER UNIQUE,
	FOREIGN KEY("idSKUItems") REFERENCES "SKUItems"("RFID"),
	FOREIGN KEY("idInternalOrders") REFERENCES "InternalOrders"("idInternalOrder"),
	PRIMARY KEY("idInternalOrders","idSKUItems")
);
COMMIT;

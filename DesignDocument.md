# Design Document 


Authors: Lorenzo Buompane, Simone Romantini, Jonathan Damone, Roberto Di Ciaula

Date: 21/06/2022 

Version: 3.0


# Contents

- [Design Document](#design-document)
- [Contents](#contents)
- [High level design](#high-level-design)
- [Low level design](#low-level-design)
- [Verification traceability matrix](#verification-traceability-matrix)
- [Verification sequence diagrams](#verification-sequence-diagrams)
  - [scenario 1-1](#scenario-1-1)
  - [scenario 3-1](#scenario-3-1)
  - [scenario 5-1-1](#scenario-5-1-1)
  - [Scenario 9-1](#scenario-9-1)


# High level design 
![High Level](docs/PackageDiagram.PNG)

EZWH is a layered application that consists of one executable generating one process and thread for each user.
The application is composed of the following packages:
- Data : for data processing and managing
- GUI : to implement the Graphical User Interface
- Exceptions : to handle exceptions triggered by users' actions

We use a MVC pattern because the users of EZWH application can modify data and the views must change. Additionally,
EZWH follows the 3-tier pattern because it manages data stored on the file system("data" tier) via use of application functions
("application tier") and a GUI("presentation" tier).


# Low level design
```plantuml
@startuml

top to bottom direction

class Users {
    - integer:id  
    - text: name
    - text:surname
    - text:email 
    - text:password 
    - text:type 
    --
    + GET users
    + GET suppliers
    + POST newUser
    + POST sessions
    + PUT username
    + DELETE user
}

class Items {
    - integer: idItems
    - text:description 
    - integer:price 
    --
    + GET items
    + GET itemById
    + POST item
    + PUT item
    + DELETE item
}

class RestockOrders { 
    - integer: idRestockOrder
    - date: issueDate
    - text: state
    - text: transportNote
    --
    + GET restockOrders
    + GET restockOrdersIssued
    + GET restockOrderById
    + GET returnItemsOfRestockOrder
    + POST restockOrder
    + PUT restockOrder
    + PUT skuItemsOfRestockOrder
    + PUT transportNoteOfRestockOrder
    + DELETE restockOrder
}

class RestockOrderItems { 
    - integer: quantity
}

class InternalOrders {
    - integer: idInternalOrder
    - date: date
    - text: state
    --
    + GET internalOrders
    + GET internalOrdersIssued
    + GET internalOrdersAccepted
    + GET internalOrderById
    + POST internalOrder
    + PUT internalOrder
    + DELETE internalOrder
}

class InternalOrderSKUs {
    - integer: quantity
}

class ReturnOrders {
    - integer: idReturnOrder
    - date: returnDate
    --
    + GET returnOrders
    + GET returnOrderById
    + POST returnOrder
    + DELETE returnOrder
}

class SKUs {
    - integer: idSKU
    - text: description
    - integer: weight
    - integer: volume
    - text: notes
    - integer: availableQuantity
    - integer: price
    --
    + GET SKUs
    + GET SKUById
    + POST SKU
    + PUT SKU
    + PUT positionOfSKU
    + DELETE SKU
}

class SKUItems {
    - text: RFID
    - integer: available
    - date: dateOfStock
    --
    + GET skuItems
    + GET skuItemOfSKUId
    + GET skuItemByRFID
    + POST skuItem
    + PUT skuItem
    + DELETE skuItem
}

class TestDescriptors {
    - integer: idDescriptor
    - text: name
    - text: procedureDescription
    --
    + GET testDescriptors
    + GET testDescriptorById
    + POST testDescriptor
    + PUT testDescriptor
    + DELETE testDescriptor
}

class TestResults {
    - integer: idResults
    - date: date
    - text: result
    --
    + GET TestResults
    + GET TestResultById
    + POST TestResult
    + PUT TestResult
    + DELETE TestResult
}

class Positions {
    - integer: idPosition
    - integer: aisleId
    - integer: row
    - integer: col
    - integer: maxWeight
    - integer: occupiedWeight
    - integer: maxVolume
    - integer: occupiedVolume
    --
    + GET positions
    + POST position
    + PUT attributesPosition
    + PUT idPosition
    + DELETE position
}

InternalOrders -- Users
InternalOrderSKUs -- InternalOrders
InternalOrderSKUs -- SKUs

Items -- SKUs
Items -- Users

RestockOrderItems -- RestockOrders
RestockOrderItems -- Items

RestockOrders -- Users

ReturnOrders -- SKUItems

SKUItems -- SKUs
SKUItems -- InternalOrders
SKUItems -- RestockOrders
SKUItems -- ReturnOrders

SKUs -- Positions
SKUs -- TestDescriptors

TestDescriptors -- SKUs

TestResults -- TestDescriptors
TestResults -- SKUItems




@enduml
```

# Verification traceability matrix

|          | Users(Customers,Manager,Suppliers) | TestResults | TestDescriptor | SKU | SKUItem | ReturnOrders | RestockOrders | Positions | Items | InternalOrders | Data Layer |
|----------|-------|-------------|----------------|-----|---------|--------------|---------------|-----------|-------|----------------|------------|
|  FR1     |   x   |             |                |     |         |              |               |           |       |                |      x     |
|  FR2     |   x   |             |                |     |         |              |               |           |       |                |      x     |
|  FR3     |       |      x      |        x       |  x  |         |              |               |     x     |       |                |      x     |
|  FR4     |   x   |             |                |     |         |              |       x       |           |       |                |      x     |
|  FR5     |   x   |             |                |  x  |    x    |      x       |       x       |           |   x   |                |      x     |
|  FR6     |   x   |             |                |  x  |    x    |              |               |           |       |        x       |      x     |
|  FR7     |   x   |             |                |  x  |         |              |               |           |   x   |                |      x     |






# Verification sequence diagrams 



## scenario 1-1 
```plantuml
Manager -> SKU: createSKU(description, weight, volume, notes, availableQuantity, price)
SKU->Manager: responsestatus(201 created)
SKU->Data Layer: recorded in the system 

```

## scenario 3-2 
```plantuml
Manager -> Users: getSuppliers
Users -> Manager: response(Suppliers array), response.status(200 ok)
Manager -> R0: insertROI(idRestockOrder, idItem, qty)
Manager -> R0: insertRO(issueDate, supplierId)
R0 -> Manager: response.status(201 created)
Manager -> R0: putSkuItemsOfRestockOrder(id, rfid, SKUId)
Manager -> R0: putTNRestockOrder(id, TransportNote)
Manager -> R0: putStateRestockOrder(id, newState = ISSUED)
R0 -> Manager: response.status(200 ok)
R0 -> DataLayer: recorded in the DB

```

## scenario 5-1-1
```plantuml
R0 -> Clerk: arrives to the shop 
Clerk -> SKU: findSKU(idSKU)
SKU -> Clerk: response(SKU), response.status(200 ok)
Clerk -> SKUItems: createSKUItem(rfid, SKUId, date)
SKUItems -> Clerk: response.status(201 created)
Clerk -> Items: creataeItem(description, id, SKUId, supplierId, price)
Items -> Clerk:  response.status(201 created)
SKUItems -> DataLayer : recorded in the DB
Items -> DataLayer  : recorded in the DB
```
## Scenario 9-1 
```plantuml

Clerk -> InternalOrders: insertIO(issueDate, customerId)
InternalOrders -> Clerk: response.status(201 created)
Clerk -> SKU: findSKU(idSKU)
SKU -> Clerk: response(SKU), response.status(200 ok)
Clerk -> InternalOrders: insertIOS(id,SKUId, qty)
InternalOrders ->Clerk: response.status(200 ok)
InternalOrders -> DataLayer: recorded in the DB
DataLayer -> InternalOrders: updateIntOrder(id, ISSUED)
DataLayer -> SKU: updateSKU(position,quantity)
Manager -> DataLayer: Check & Accepted
DataLayer -> InternalOrders: updateIntOrder(id, ACCEPTED)


```

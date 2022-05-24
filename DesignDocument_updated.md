# Design Document 


Authors: Lorenzo Buompane, Simone Romantini, Jonathan Damone, Roberto Di Ciaula

Date: 22/05/2022 

Version: 2.0


# Contents

- [High level design](#package-diagram)
- [Low level design](#class-diagram)
- [Verification traceability matrix](#verification-traceability-matrix)
- [Verification sequence diagrams](#verification-sequence-diagrams)


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



class User {
- int:id  
- String: name
- String:surname
- String:email 
- String:password 
- String:type 
--
- User getUserinfo()
- logout()
+ Array<User> getUsers()
+ post(String username, String name, String surname, String password, String type)
+ put(String username, String oldType, String newType)
+ delete(String username, String type)
}



class Item {
- int: id
- String:description 
- float:price 
- int: SKUId 
- int:supplireId 
--
+ Array<Item> get()
+ Item gerById(int id)
+ post(String description, float price, int SKUId, int supplierId)
+ put(int id, String newDescription, float newPrice)
+ delete(int id)
}
class RestockOrder
{ 
-int:id
-string:issueDate
-string:state
-product: array[SKUId:int,description:string,price:float,qty:int]   
-int:supplierId
-string:transportNote
-int:skuItems
--
+restockOrders()
+restockOrdersIssued( int: id,int issueDate, string: state, string: products,int: supplierId, array:restock order[])
+get_id (int:id)
+restockOrder(string: new_issueDate, array:new_products,int: new_supplierid)
+change_id (int:id,int:new_id)
+skuItems (int:id)
+add_transportNote(string:add_transport_node)
+delete_RestockOrder (int:id)
}

class InternalOrder
{
-int:id
-string:issueDate
-string:state
-products: array [int: SKUId,string: description,float:price,int:qty},
-int:customerId
--
+get_internalOrders ()
+get_internalOrdersIssued()
+get_internalOrdersAccepted()
+get_internalOrders(int: id)
+post_internalOrders(string:issueDate, array:products,int:customerId)
+internalOrder_modify (int:id , string:newState)
+delete_internalOrder (int:id)

}
class ReturnOrder
{
-int:id
-string:returnDate
-product: array[SKUId:int,description:string,price:float,qty:int]   
-int:restockOrderId
--
+returnOrders( int: new_id, string: new_returndate, array: ptoduct[], int: new_restockOrderId)
+returnOrder_id (string: returnDate  ,array: ptoduct[] ,int: restockOrderId )
+new_returnOrder:(string: new_returnDate  ,array: new_product[] ,int: restockOrderId )
+delte_ReturnOrder(int:id)
}


class SKU {
- int:id 
- string:description : String
- int:weight 
- int:volume 
- string:notes 
- string:position 
- int:availableQuantity 
- float:price 
- testDescriptors : Array<int>
--
+ Array<SKU> get()
+ SKU getById(int id)
+ post(String description, int weight, int volume, String notes, float price, int availableQuantity)
+ putById(int: id, String: newDescription, int: newWeight, int: newVolume, String: newNotes, float: newPrice, int :newAvailableQuantity)
+ putPosition(int: id, String: position)
+ delete(id)

}
class SKUItem {
- string: RFID 
- int: SKUId 
- boolean:Available
- string: DateOfStock 
--
+ Array<SKUItem> get()
+ Array<SKUItem> getAvailable()
+ SKUItem getbyRFID(String RFID)
+ post(String RFID, int SKUId, Date DateOfStock)
+ put(String RFID, String newRFID, boolean newAvailable, Date newDateOfStock)
+ delete(String RFID)
}
class TestDescriptor
{
- int: id 
- int:idSKU 
- string: string:name
- string:procedureDescription
--
+get_test_descriptor_array (int id)
+get_test_descriptor_id (string procedureDescription)
+post_new_test (  int idSKU , string  name , stimg procedureDescription)
+put_test_description(int id )
+delete_test_description (int id)
}

class TestResult
{
- int:Rfid : int
- int:id 
- int:IdTestDescriptor 
- string: Date  
- string:procedureDescription
- boolean:Result:

--

+get_TestResult_array (int Rfid)
+get_TestResult (id)
+post_TestResult (int new_Rfid,int new_IdTestDescriptor,string: new_Date,string: new_Result )
+put_TestResult (int new_Rfid )
+delete_TestResult (Rfid )
}

class Position
{
- int: positionID
- int:aisleID
- int:row
- int: col
- int:MaxVolume
- int: MaxWeight
- int:newOccupiedVolume
- int: newOccupiedWeight
--
+ get_position( )
+post_position ( int new_positionID,int new_aisleID,int new_row,int new_col,int new_MaxVolume,int new_MaxWeight,int new_OccupiedVolume, int new_OccupiedWeight )
+put_position    (positionID, new_positionID,new_aisleID,new_row,new_col,new_MaxVolume,new_MaxWeight,new_newOccupiedVolume, newOccupiedWeight)
+delete_position (positionID)
+changeID ( positionID,intS new_id)
}

SKUItem -- TestResult
User -- InternalOrder
User --  Item
User --  RestockOrder
SKUItem  -- Position
InternalOrder -- SKU
InternalOrder -- SKUItem
RestockOrder -- Item
RestockOrder -- ReturnOrder
RestockOrder -- SKUItem
SKUItem -- ReturnOrder
SKU -- SKUItem
SKU -- Item
SKU -- TestDescriptor
TestDescriptor -- TestResult
SKU -- Position



User -- SKU
User -- Position

User -- TestDescriptor
User -- TestResult
User -- SKUItem
@enduml
```

# Verification traceability matrix

| User                                                  | Item    | RestockOrder | SKU | SKUItem | TestDescriptor | Position | InternalOrder |
|-------------------------------------------------------|---------|--------------|-----|---------|----------------|----------|---------------|
| Manage users and rights                               | FR1     | x            |     |         |                |          |               |
| Define a new user, or modify an existing user         | FR1.1   | x            |     |         |                |          |               |
| Delete a user                                         | FR1.2   | x            |     |         |                |          |               |
| List all users                                        | FR1.3   | x            |     |         |                |          |               |
| Search a user                                         | FR1.4   | x            |     |         |                |          |               |
| Manage rights.                                        | FR1.5   | x            |     |         |                |          |               |
| Manage SKU                                            | FR2     |              |     |         | x              |          |               |
| Define a new SKU, or modify an existing SKU           | FR2.1   |              |     |         | x              |          |               |
| Delete a SKU                                          | FR2.2   |              |     |         | x              |          |               |
| List all SKUs                                         | FR2.3   |              |     |         | x              |          |               |
| Search a SKU (by ID, by description)                  | FR2.4   |              |     |         | x              |          |               |
| Manage Warehouse                                      | FR3     |              |     |         |                |          |               |
| Manage positions                                      | FR3.1   |              |     |         |                |          |               |
| Define a new position, or modify an existing position | FR3.1.1 |              |     |         |                |          |               |
| Delete a position                                     | FR3.1.2 |              |     |         |                |          |               |
| List all positions                                    | FR3.1.3 |              |     |         |                |          |               |
| Modify attributes of a position                       | FR3.1.4 |              |     |         |                |          |               |
| Manage quality tests                                  | FR3.2   |              |     |         |                |          | x             |
| Add a quality test                                    | FR3.2.1 |              |     |         |                |          | x             |
| Modify a quality test                                 | FR3.2.2 |              |     |         |                |          | x             |
| Delete a quality test                                 | FR3.2.3 |              |     |         |                |          | x             |
| Manage internal customers                             | FR 4    | x            |     |         |                |          |               |
| Register or modify a customer                         | FR4.1   | x            |     |         |                |          |               |
| Delete a customer                                     | FR4.2   | x            |     |         |                |          |               |
| Search a customer                                     | FR4.3   | x            |     |         |                |          |               |
| List  all customers                                   | FR4.4   | x            |     |         |                |          |               |
| Manage a restock order                                | FR5     |              |     | x       |                |          |               |
| Start a restock order                                 | FR5.1   |              |     | x       |                |          |               |
| Add a SKU to a restock order                          | FR5.2   |              |     | x       |                |          |               |
| Define quantity of SKU to be ordered                  | FR5.3   |              |     | x       |                |          |               |
| Delete a SKU from a restock order                     | FR5.4   |              |     | x       |                |          |               |
| Select a Supplier for the restock order               | FR5.5   |              |     | x       |                |          |               |
| Issue  a restock order                                | FR5.6   |              |     | x       |                |          |               |
| Change state of a restock order                       | FR5.7   |              |     | x       |                |          |               |
| Manage reception of a restock order                   | FR5.8   |              |     | x       |                |          |               |
| Create and tag a SKU item with an RFID                | FR5.8.1 |              |     |         |                | x        |               |
| Store result of a quality test on a SKU Item          | FR5.8.2 |              |     |         |                | x        |               |
| Store a SKU Item                                      | FR5.8.3 |              |     |         |                | x        |               |
| Start  a return order                                 | FR5.9   |              |     |         |                | x        |               |
| Return a SKU item listed in a restock order           | FR5.10  |              |     |         |                | x        |               |
| Commit a return order                                 | FR5.11  |              |     |         |                | x        |               |
| Change state of a return order                        | FR5.12  |              |     |         |                | x        |               |
| Manage internal orders                                | FR6     |              |     |         |                |          |               |
| Start an internal order                               | FR6.1   |              |     |         |                |          |               |
| Add a SKU to an internal order                        | FR6.2   |              |     |         | x              |          |               |
| Define quantity of SKU to be ordered                  | FR6.3   |              |     |         | x              |          |               |
| Delete a SKU from an internal order                   | FR6.4   |              |     |         | x              |          |               |
| Issue an internal order                               | FR6.5   |              |     |         |                |          |               |
| Accept, reject or cancel an internal order            | FR6.6   |              |     |         |                |          |               |
| Change state of an internal order                     | FR6.7   |              |     |         |                |          |               |
| Manage delivery of an internal order                  | FR6.8   |              |     |         |                |          |               |
| Select SKU Item with a FIFO criterion                 | FR6.9   |              |     |         | x              |          |               |
| Remove SKU Item from warehouse                        | FR6.10  |              |     |         | x              |          |               |
| Manage Items                                          | FR7     |              | x   |         |                |          |               |






# Verification sequence diagrams 

## scenario 1-1 
```plantuml
Manager -> SKU: SKU:post(id,weight,volume,SKU notes,
SKU ->Manager  : response(ok)
```


## scenario 3-1 
```plantuml
Manager ->R0: new SKU description 
Manager -> R0: fills quantity of item to be ordered
Manager -> R0: select supplier SP that can sastisfy order
Manager -> R0: confirms inserted data  
Manager -> R0: new SKU notes
R0 -> database: recorded in the system in ISSUED state

```

## scenario 5-1-1
```plantuml
R0 -> Clerk: arrives to the shop 
Clerk -> Database : records e the system with a new RFID
Database -> SKU_ITEM  : stores RFID and changed the state
```
## Scenario 9-1 
```plantuml
User(custumer) -> internal_order: new Internal Order 
User(custumer) -> SKU: adds every SKU he wants
internal_order ->User(custumer): ask confermation
User(custumer) -> internal_order: confermation
internal_order ->User(custumer):  System issue IO with status
internal_order ->manager:  checks IO and accepts it
manager -> User(custumer): confermation
```

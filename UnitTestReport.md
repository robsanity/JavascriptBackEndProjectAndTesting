# Unit Testing Report

Date:

Version:

# Contents

- [Black Box Unit Tests](#black-box-unit-tests)




- [White Box Unit Tests](#white-box-unit-tests)


# Black Box Unit Tests

    <Define here criteria, predicates and the combination of predicates for each function of each class.
    Define test cases to cover all equivalence classes and boundary conditions.
    In the table, report the description of the black box test case and (traceability) the correspondence with the Jest test case writing the 
    class and method name that contains the test case>
    <Jest tests  must be in code/server/unit_test  >

## Class SKU

### **Class SKU - method *GET***
**Criteria for method *GET*:**
	

 - Database conection where is stored all the array data
 - check if who want acess  have the correct right to do it permission


**Predicates for method *GET*:**

| Criteria | Predicate |
| -------- | --------- |
|   Database conection        |   connection up ,connection down       |  
|     permission              |    allowed, not allowed, user do not exist       |



**Combination of predicates**:


| DB connection | permssion |  Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
|connection up  |allowed     |v|T1{ manager}|||
|               |not allowed |v|T2{ Customer}|||
|               |not exist   |I|T3{ CEO}|||
|connection down|  -         |v|T4{ Customer}|  ||

**Criteria for method *id*:**


 -  number of id 
  -check Database conection where is stored all the array data
 - check if who want acess  have the correct right to do it permission


**Predicates for method *id*:**

| Criteria | Predicate |
| -------- | --------- |
|   ID       |  correct,do not exist,wrong type       |  
|   Database conection        |   connection up ,connection down       |  
|     permission              |    allowed, not allowed, user do not exist       |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|    ID      |    [0 , maxValueType]             |


**Combination of predicates**:


|   ID       | DB connection | permssion |  Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
|correct|connection up     |allowed     |v|T1{  id:"456", user: manager} ,T12B{  id:"0", user: manager},T13B{  id:"maxValueType", user: manager} |||
||                         |not allowed |v|T2{id:"456",  Customer},|||
||                         |not exist   |I|T3{id:"456" , CEO}|||
||connection down|  -                   |v|T4{ id:"456",  Customer}|  ||
|not exist|connection up   |allowed     |v|T5{id:"456" , manager}|||
||                         |not allowed |v|T6{id:"456" , Customer}|||
||                         |not exist   |I|T7{id:"456", CEO}|||
||connection down|  -         |v|T8{ Customer}|  ||
|wrong type|connection up  |allowed     |v|T9{id:"A56" , manager}|||
||                         |not allowed |v|T10{ id:"A56" , Customer}|||
||                         |not exist   |I|T11{ id:"A56" ,CEO}|||
||connection down|  -                   |v|T4{ id:"A56"Customer}|  ||



### **Class SKU - method *POST***
**Criteria for method *POST*:**


 -  number of weight, volume and price and available Quantity  (WVPaQ)
 - SKU is already stored in the wharehouse
  -check Database conection where is stored all the array data
 - check if who want acess  have the correct right to do it 
 - number of object inside the body 




**Predicates for method *POST*:**

| Criteria | Predicate |
| -------- | --------- |
|       |  positive, negative      |  
|   SKU  already stored    |  true,false     |  
|   Database conection        |   connection up ,connection down       |  
|     permission              |    allowed, not allowed       |
|     number of object             |    =!6 , =6     |



**Combination of predicates**:


|   WVPaQ    |SKU  already stored | db connection|permission|number of object |  Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|-------|-------|
| positive|T| up    |allowed|=6|v|  T1{"a old sku",100,50,first SKU",10.99,50}|-------|
| positive|T| up    |allowed|=!6|I| T2{"a old sku",100,50,first SKU"}|-------|
| positive|T| up    |not allowed|-|-|T3{"a old sku",100,50,first SKU"},clerk|-------|
| positive|T| down   |-|- |v| T4{"a old sku",100,50,first SKU",10.99,50}|-------|
| positive|F| up    |allowed|=6|v|T4{"a new sku",100,50,first SKU",10.99,50}|-------|
| positive|F| up    |allowed|=!6|I|T5{"a new sku",100,10.99,50}|-------|
| positive|F| up    |not allowed|-|I|T6{"a new sku",100,10.99,50}-------|
| positive|F| down    |-|- |-|T7{"a new sku",100,50,first SKU"},clerk|-------|
| negative |-| -    |-|- |i|-------|T8{"a new sku",-20,50,first SKU"},clerk|



### **Class SKU - method *PUT***
**Criteria for method *id*:**


 -  number of id 
-check Database conection where is stored all the array data
 - check if who want acess  have the correct right to do it permission
 -  number of weight, volume and price and available Quantity  (WVPaQ)
 - SKU is already stored in the wharehouse
 - number of object inside the body 


**Predicates for method *id*:**

| Criteria | Predicate |
| -------- | --------- |
|   ID       |  correct,do not exist,wrong type       |  
|   Database conection        |   connection up ,connection down       |  
|     permission              |    allowed, not allowed     |
|     number of object             |    =!6 , =6     |
|   SKU  already stored    |  true,false     |  

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|    ID      |    [0 , maxValueType]             |


**Combination of predicates**:


| Database conection  | sku stored |  permission   |  number of object | ID           |  Valid / Invalid | Description of the test case                                |   |   |   |   |   |   |
|---------------------|------------|---------------|-------------------|--------------|------------------|-------------------------------------------------------------|---|---|---|---|---|---|
| up                  | T          |  allowed      | 6                 | correct      |                  | T1({a new sku",100,50,"first SKU",10.99,50} ID: 123 ) T1B({a new sku",100,50,"first SKU",10.99,50} ID: MAXVALUE)     |   |   |   |   |   |   |
|                     |            |               |                   | do not exist |                  | T2({a new sku",100,50,"first SKU",10.99,50} ID: 123 )       |   |   |   |   |   |   |
|                     |            |               |                   | wrong type   |                  | T3({a new sku",100,50,"first SKU",10.99,50} ID: 1G3 )       |   |   |   |   |   |   |
|                     |            |               | !=6               | correct      |                  | T4({a new sku",10.99,50} ID: 123 )                          |   |   |   |   |   |   |
|                     |            |               |                   | do not exist |                  | T5({a new sku",100,50} ID: 123 )                            |   |   |   |   |   |   |
|                     |            |               |                   | wrong type   |                  | T6({a new sku",10.99,50} ID: 1H3 )                          |   |   |   |   |   |   |
|                     |            |  Not allowed  | 6                 | -            |                  | T7({a new sku",100,50,"first SKU",10.99,50} ID: 123,CLERK ) |   |   |   |   |   |   |
|                     | F          | -             | -                 | -            |                  | T8({a new sku",100,50,"first SKU",10.99,50} ID: 123 )       |   |   |   |   |   |   |
| down                | -          | -             | -                 | -            |                  | T9({a new sku",100,50,"first SKU",10.99,50} ID: 123 )       |   |   |   |   |   |   |




**Predicates for method *POSITION*:**

| Criteria | Predicate |
| -------- | --------- |
|   ID       |  correct,do not exist,wrong type       |  
|   position  existance     |  exist,do not exist      |  
|   Database conection        |   connection up ,connection down       |  
|     permission              |    allowed, not allowed     |

|   SKU  already stored    |  true,false     |  




**Combination of predicates**:


|   |   |   |              |               |            |                    |                     |                  |                                              |   |   |   |
|---|---|---|--------------|---------------|------------|--------------------|---------------------|------------------|----------------------------------------------|---|---|---|
|   |   |   | ID           |  permission   | sku stored | position existance | Database conection  |  Valid / Invalid | Description of the test case                 |   |   |   |
|   |   |   |    correct          |   allowed             | T          | exist              | up                  | v                | T1( POSITION:800234523412 , manager logged ) |   |   |   |
|   |   |   |              |               |            |                    | down                | I                | T2( POSITION:800234523412 , manager logged ) |   |   |   |
|   |   |   |              |               |            | Do not exist       | -                   | I                | T3( POSITION:800234523412 , manager logged ) |   |   |   |
|   |   |   |              |               | F          | -                  | -                   | I                | T4( POSITION:800234523412 , manager logged ) |   |   |   |
|   |   |   |              |  Not allowed  | -          | -                  | -                   | I                | T5( POSITION:800234523412 , clerk logged )   |   |   |   |
|   |   |   | do not exist | -             | -          | -                  | -                   | I                | T6( POSITION:800234523412 , manager logged ) |   |   |   |





### **Class SKU - method *DELETE***
**Predicates for method *delete:**

| Criteria | Predicate |
| -------- | --------- |
|   ID       |  correct,do not exist,wrong type       |  
|   Database conection        |   connection up ,connection down       |  
|     permission              |    allowed, not allowed     |
|     sku stored           |    true, false    |





**Combination of predicates**:

| ID           |  permission   | sku stored | Database conection  |  Valid / Invalid | Description of the test case   |   |   |   |   |   |   |   |
|--------------|---------------|------------|---------------------|------------------|--------------------------------|---|---|---|---|---|---|---|
| exist        | allowed       | T          | up                  | v                | T1( id: 123 ,manager logged )  |   |   |   |   |   |   |   |
|              |               |            | down                | I                | T2( id: 123 ,manager logged )  |   |   |   |   |   |   |   |
|              |               | F          | -                   | I                | T3( id: 123 ,manager logged )  |   |   |   |   |   |   |   |
|              |  Not allowed  | -          | -                   | I                | T4( id: 123 ,clerk logged )    |   |   |   |   |   |   |   |
| do not exist | -             | -          | -                   | I                | T5( id: 1245 ,manager logged ) |   |   |   |   |   |   |   |
| wrong type   | -             | -          | -                   | I                | T6( id: 1dd ,manager logged )  |   |   |   |   |   |   |   |



## Class SKU ITEM

### **Class SKU ITEM - method *GET***

**Criteria for method *skuitems*:**
	
- check Database conection where is stored all the array data
 - check if who want acess  have the correct right to do it permission



**Predicates for method *GET*:**

| Criteria | Predicate |
| -------- | --------- |
|   Database conection        |   connection up ,connection down       |  
|     permission              |    allowed, not allowed, user do not exist       |


**Combination of predicates**:

| DB connection | permssion |  Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
|connection up  |allowed     |v|T1{ manager}|||
|               |not allowed |v|T2{ Customer}|||
|               |not exist   |I|T3{ CEO}|||
|connection down|  -         |v|T4{ Customer}|  ||
**Predicates for method *:id*:**
**Criteria for method *id*:**


 -  number of id 
  -check Database conection where is stored all the array data
 - check if who want acess  have the correct right to do it permission


**Predicates for method *id*:**

| Criteria | Predicate |
| -------- | --------- |
|   ID                        |  correct,do not exist,wrong type       |  
|   Database conection        |   connection up ,connection down       |  
|     permission              |    allowed, not allowed, user do not exist       |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|    ID      |    [0 , maxValueType]             |


**Combination of predicates**:


|   ID       | DB connection | permssion |  Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
|correct|connection up     |allowed     |v|T1{  id:"556", user: manager} ,T12B{  id:"0", user: manager},T13B{  id:"maxValueType", user: manager} |||
||                         |not allowed |v|T2{id:"44",  Customer},|||
||                         |not exist   |I|T3{id:"456" , CEO}|||
||connection down|  -                   |v|T4{ id:"456",  Customer}|  ||
|not exist|connection up   |allowed     |v|T5{id:"456" , manager}|||
||                         |not allowed |v|T6{id:"456" , Customer}|||
||                         |not exist   |I|T7{id:"666", CEO}|||
||connection down|  -         |v|T8{ Customer}|  ||
|wrong type|connection up  |allowed     |v|T9{id:"xyz" , manager}|||
||                         |not allowed |v|T10{ id:"A56" , Customer}|||
||                         |not exist   |I|T11{ id:"A89" ,CEO}|||
||connection down|  -                   |v|T4{ id:"A56"Customer}|  ||




**Predicates for method *rfid*:**

| Criteria | Predicate |
| -------- | --------- |
|   ID                        |  correct,do not exist,wrong type       |  
|   Database conection        |   connection up ,connection down       |  
|     permission              |    allowed, not allowed, user do not exist       |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|    ID      |    [0 , maxValueType]             |


**Combination of predicates**:


|   ID       | DB connection | permssion |  Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
|correct|connection up     |allowed     |v|T1{  id:"556", user: manager} ,T12B{  id:"0", user: manager},T13B{  id:"maxValueType", user: manager} |||
||                         |not allowed |v|T2{id:"12345678901234567890123456789015",  Customer},|||
||                         |not exist   |I|T3{id:"12345678901234567890123456789015" , CEO}|||
||connection down|  -                   |v|T4{ id:"12345678901234567890123456789015",  Customer}|  ||
|not exist|connection up   |allowed     |v|T5{id:"12345678901234567890123456789015" , manager}|||
||                         |not allowed |v|T6{id:"12345678901234567890123456789015" , Customer}|||
||                         |not exist   |I|T7{id:"12345678901234567890123456789015", CEO}|||
||connection down|  -         |v|T8{ Customer}|  ||
|wrong type|connection up  |allowed     |v|T9{id:"sdsfsaf78901234567890123456789015" , manager}|||
||                         |not allowed |v|T10{ id:"sdsfsaf78901234567890123456789015" , Customer}|||
||                         |not exist   |I|T11{ id:"sdsfsaf78901234567890123456789015" ,CEO}|||
||connection down|  -                   |v|T4{ id:"sdsfsaf78901234567890123456789015"Customer}|  ||














### **Class SKU ITEM- method *POST***
**Predicates for method 
**Criteria for method *skuitems*:**


 -  number of RFID, SKUId,DateOfStock (RSD)
 - SKU is already stored in the wharehouse
  -check Database conection where is stored all the array data
 - check if who want acess  have the correct right to do it 
 - number of object inside the body 




**Predicates for method *POST*:**

| Criteria | Predicate |
| -------- | --------- |
|   Correct type     |  positive, negative      |  
|   SKU  already stored    |  true,false     |  
|   Database conection        |   connection up ,connection down       |  
|     permission              |    allowed, not allowed       |
|     number of object             |    =!3 , =3     |



**Combination of predicates**:


|   RSD    |SKU  already stored | db connection|permission|number of object |  Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|-------|-------|
| positive|T| up    |allowed|=6|v|  T1{12345678901234567890123456789015,1, 2021/11/29 12:30},,manager manager|-------|
| positive|T| up    |allowed|=!6|I| T2{,1, 2021/11/29 12:30}|-------|
| positive|T| up    |not allowed|-|-|T3{"12345678901234567890123456789015,1, 2021/11/29 12:30},clerk|-------|
| positive|T| down   |-|- |v| T4{12345678901234567890123456789015,1, 2021/11/29 12:30}|-------|
| positive|F| up    |allowed|=6|v|T4{12345678901234567890123456789015,1, 2021/11/29 12:30}|-------|
| positive|F| up    |allowed|=!6|I|T5{ 2021/11/29 12:30}|-------|
| positive|F| up    |not allowed|-|I|T6{12345678901234567890123456789015,1, 2021/11/29 12:30}-------|
| positive|F| down    |-|- |-|T7{12345678901234567890123456789015,1, 2021/11/29 12:30},clerk|-------|
| negative |-| -    |-|- |i|-------|T8{12345678901sdsdsds90123456789015,1, 221/11/29 12:30},clerk|


          
### **Class SKU ITEM - method *PUT***

**Predicates for method *:rfid:**
| Criteria | Predicate |
| -------- | --------- |
|   ID                        |  correct,do not exist,wrong type       |  
|   Database conection        |   connection up ,connection down       |  
|     permission              |    allowed, not allowed, user do not exist       |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|    ID      |    [0 , maxValueType]             |


**Combination of predicates**:


|   ID       | DB connection | permssion |  Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
|correct|connection up     |allowed     |v|T1{  id:"12345678901234567890123456789015", 1,2021/11/29 12:30  user: manager} ,T12B{  id:"0", user: manager},T13B{  id:"maxValueType", user: manager} |||
||                         |not allowed |v|T2{id:"12345678901234567890123456789015" ,1,2021/11/29,  Customer},|||
||                         |not exist   |I|T3{id:"12345678901234567890123456789015"  ,1,2021/11/29,, CEO}|||
||connection down|  -                   |v|T4{ id:"12345678901234567890123456789015" ,1,2021/11/29,,  Customer}|  ||
|not exist|connection up   |allowed     |v|T5{id:"12345678901234567890123456789015" ,1,2021/11/29, , manager}|||
||                         |not allowed |v|T6{id:"12345678901234567890123456789015"  ,1,2021/11/29,, Customer}|||
||                         |not exist   |I|T7{id:"12345678901234567890123456789015" ,1,2021/11/29,, CEO}|||
||connection down|  -         |v|T8{ Customer}|  ||
|wrong type|connection up  |allowed     |v|T9{id:"sdsfsaf78901234567890123456789015"  ,1,2021/11/29,, manager}|||
||                         |not allowed |v|T10{ id:"sdsfsaf78901234567890123456789015" ,1,2021/11/29, , Customer}|||
||                         |not exist   |I|T11{ id:"sdsfsaf78901234567890123456789015" ,1,2021/11/29, ,CEO}|||
||connection down|  -                   |v|T4{ id:"sdsfsaf78901234567890123456789015"  ,1,2021/11/29, Customer}|  ||
















### **Class SKU ITEM - method *DELETE***
**Predicates for method *:rfid:**


| Criteria | Predicate |
| -------- | --------- |
|   ID       |  correct,do not exist,wrong type       |  
|   Database conection        |   connection up ,connection down       |  
|     permission              |    allowed, not allowed     |
|     sku stored           |    true, false    |





**Combination of predicates**:

| ID           |  permission   | sku stored | Database conection  |  Valid / Invalid | Description of the test case   |   |   |   |   |   |   |   |
|--------------|---------------|------------|---------------------|------------------|--------------------------------|---|---|---|---|---|---|---|
| exist        | allowed       | T          | up                  | v                | T1( id: 12345678901234567890123456789015 ,manager logged )  |   |   |   |   |   |   |   |
|              |               |            | down                | I                | T2( id: 12345678901234567890123456789015,manager logged )  |   |   |   |   |   |   |   |
|              |               | F          | -                   | I                | T3( id: 12345678901234567890123456789015 ,manager logged )  |   |   |   |   |   |   |   |
|              |  Not allowed  | -          | -                   | I                | T4( id: 12345678901234567890123456789015 ,clerk logged )    |   |   |   |   |   |   |   |
| do not exist | -             | -          | -                   | I                | T5( id: 12345678901234567890123456789015 ,manager logged ) |   |   |   |   |   |   |   |
| wrong type   | -             | -          | -                   | I                | T6( id: 1dd123sddfdsvfv67890123456789015 ,manager logged )  |   |   |   |   |   |   |   |






## Class POSITION


### **Class position - method *GET***
**Criteria  for method *position**

	
- check Database conection where is stored all the array data
 - check if who want acess  have the correct right to do it permission



**Predicates for method *GET*:**

| Criteria | Predicate |
| -------- | --------- |
|   Database conection        |   connection up ,connection down       |  
|     permission              |    allowed, not allowed, user do not exist       |


**Combination of predicates**:

| DB connection | permssion |  Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
|connection up  |allowed     |v|T1{ manager}T5{ clerk}|||
|               |not allowed |I|T2{ Customer}|||
|               |not exist   |I|T3{ CEO}|||
|connection down|  -         |I|T4{ Customer}|  ||


### **Class SKU ITEM- method *POST***
**Predicates for method 
**Criteria for method *skuitems*:**


 -  number of RFID, SKUId,DateOfStock (RSD)
 - SKU is already stored in the wharehouse
  -check Database conection where is stored all the array data
 - check if who want acess  have the correct right to do it 
 - number of object inside the body 




**Predicates for method *POST*:**

| Criteria | Predicate |
| -------- | --------- |
|   Correct type     |  positive, negative      |  
|   SKU  already stored    |  true,false     |  
|   Database conection        |   connection up ,connection down       |  
|     permission              |    allowed, not allowed       |
|     number of object             |    =!6 , =6     |



**Combination of predicates**:


|   RSD    |SKU  already stored | db connection|permission|number of object |  Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|-------|-------|
| positive|T| up    |allowed|=6|v|  T1{"800234543412",8002","3454","3412",1000,1000},,manager manager|-------|
| positive|T| up    |allowed|=!6|I| T2{8002}|-------|
| positive|T| up    |not allowed|-|-|T3{"800234543412",8002","3454","3412",1000,1000},clerk|-------|
| positive|T| down   |-|- |v| T4{"800234543412",8002","3454","3412",1000,1000}|-------|
| positive|F| up    |allowed|=6|v|T4{"800234543412",8002","3454","3412",1000,1000}|-------|
| positive|F| up    |allowed|=!6|I|T5{ "3454","3412",1000,1000}|-------|
| positive|F| up    |not allowed|-|I|T6{"800234543412",8002","3454","3412",1000,1000}-------|
| positive|F| down    |-|- |-|T7{800234543412,8002},clerk|-------|
| negative |-| -    |-|- |i|-------|T8{800234543412,8002},clerk|
### **Class POSITION - method *PUT***
**Criteria for method *id*:**


 -  number of id 
-check Database conection where is stored all the array data
 - check if who want acess  have the correct right to do it permission
 -  number of all new element
 - SKU is already stored in the wharehouse
 - number of object inside the body 

**Predicates for method *:positionID**
| Criteria | Predicate |
| -------- | --------- |
|   ID                        |  correct,do not exist,wrong type       |  
|   Database conection        |   connection up ,connection down       |  
|     permission              |    allowed, not allowed, user do not exist       |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|    ID      |    [0 , maxValueType]             |


**Combination of predicates**:

|   ID       | DB connection | permssion |  Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
|correct|connection up     |allowed     |v|T1{ 3454","3412",1200, 600,200,100} ,T12B{  id:"0", user: manager},T13B{  id:"maxValueType", user: manager} |||
||                         |not allowed |v|T2{3454","3412",1200, 600,200,100},|||
||                         |not exist   |I|T3{3454","3412",1200, 600,200,100 CEO}|||
||connection down|  -                   |v|T4{ i3454","3412",1200, 600,200,100  Customer}|  ||
|not exist|connection up   |allowed     |v|T5{3454","3412",1200, 600,200,100 manager}|||
||                         |not allowed |v|T6{3454","3412",1200, 600,200,100 Customer}|||
||                         |not exist   |I|T7{3454","3412",1200, 600,200,100 CEO}|||
||connection down|  -         |v|T8{ Customer}|  ||
|wrong type|connection up  |allowed     |v|T9{3454","341sdsd2",1200, 600,200,100 manager}|||
||                         |not allowed |v|T10{ id:"3454","3412",1200, 600,20sdsd0,100 Customer}|||
||                         |not exist   |I|T11{ 3454","3412",1200, 600,200,10sdsdsd0,CEO}|||

### **Class POSITION - method *DELETE***
**Criteria for method *delete*:**
  - ID   :      correct,do not exist,wrong type        
  - Database conection :          connection up ,connection down        
 -    permission       :           allowed, not allowed        
 -  position stored    :         true, false  
**Predicates for method *delete:**

| Criteria | Predicate |
| -------- | --------- |
|   ID       |  correct,do not exist,wrong type       |  
|   Database conection        |   connection up ,connection down       |  
|     permission              |    allowed, not allowed     |
|     position stored           |    true, false    |





**Combination of predicates**:

| ID           |  permission   | sku stored | Database conection  |  Valid / Invalid | Description of the test case   |   |   |   |   |   |   |   |
|--------------|---------------|------------|---------------------|------------------|--------------------------------|---|---|---|---|---|---|---|
| exist        | allowed       | T          | up                  | v                | T1( id: 123 ,manager logged )  |   |   |   |   |   |   |   |
|              |               |            | down                | I                | T2( id: 123 ,manager logged )  |   |   |   |   |   |   |   |
|              |               | F          | -                   | I                | T3( id: 123 ,manager logged )  |   |   |   |   |   |   |   |
|              |  Not allowed  | -          | -                   | I                | T4( id: 123 ,clerk logged )    |   |   |   |   |   |   |   |
| do not exist | -             | -          | -                   | I                | T5( id: 1245 ,manager logged ) |   |   |   |   |   |   |   |
| wrong type   | -             | -          | -                   | I                | T6( id: 1dd ,manager logged )  |   |   |   |   |   |   |   |


## Class TEST DESCRIPTOR

### **Class TEST DESCRIPTOR - method *GET***
**Criteria for method *get*:**
- check Database conection where is stored all the array data
 - check if who want acess  have the correct right to do it permission



**Predicates for method *GET*:**

| Criteria | Predicate |
| -------- | --------- |
|   Database conection        |   connection up ,connection down       |  
|     permission              |    allowed, not allowed, user do not exist       |


**Combination of predicates**:

| DB connection | permssion |  Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
|connection up  |allowed     |v|T1{ manager}T5{ clerk}|||
|               |not allowed |I|T2{ Customer}|||
|               |not exist   |I|T3{ CEO}|||
|connection down|  -         |I|T4{ Customer}|  ||


**Predicates for method *get:id*:**

| Criteria | Predicate |
| -------- | --------- |
|   ID                        |  correct,do not exist,wrong type       |  
|   Database conection        |   connection up ,connection down       |  
|     permission              |    allowed, not allowed, user do not exist       |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|    ID      |    [0 , maxValueType]             |


**Combination of predicates**:


|   ID       | DB connection | permssion |  Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
|correct|connection up     |allowed     |v|T1{  id:"556", user: manager} ,T12B{  id:"0", user: manager},T13B{  id:"maxValueType", user: manager} |||
||                         |not allowed |v|T2{id:"44",  Customer},|||
||                         |not exist   |I|T3{id:"456" , CEO}|||
||connection down|  -                   |v|T4{ id:"456",  Customer}|  ||
|not exist|connection up   |allowed     |v|T5{id:"456" , manager}|||
||                         |not allowed |v|T6{id:"456" , Customer}|||
||                         |not exist   |I|T7{id:"666", CEO}|||
||connection down|  -         |v|T8{ Customer}|  ||
|wrong type|connection up  |allowed     |v|T9{id:"xyz" , manager}|||
||                         |not allowed |v|T10{ id:"A56" , Customer}|||
||                         |not exist   |I|T11{ id:"A89" ,CEO}|||
||connection down|  -                   |v|T4{ id:"A56"Customer}|  ||

### **Class TEST DESCRIPTOR - method *POST***

**Criteria for method *post:**


 -  number of RFID, SKUId,DateOfStock (RSD)
 - SKU is already stored in the wharehouse
  -check Database conection where is stored all the array data
 - check if who want acess  have the correct right to do it 
 - number of object inside the body 




**Predicates for method *POST*:**

| Criteria | Predicate |
| -------- | --------- |
|   Correct type     |  positive, negative      |  
|   SKU  already stored    |  true,false     |  
|   Database conection        |   connection up ,connection down       |  
|     permission              |    allowed, not allowed       |
|     number of object             |    =!3 , =3     |



**Combination of predicates**:


|   RSD    |SKU  already stored | db connection|permission|number of object |  Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|-------|-------|
| positive|T| up    |allowed|=3|v|  T1{test descriptor 3, This test is described by...,1|-------|
| positive|T| up    |allowed|=!3|I| T2{test descriptor 3, This test is described by...,1}|-------|
| positive|T| up    |not allowed|-|-|T3{test descriptor 3, This test is described by...,1},clerk|-------|
| positive|T| down   |-|- |v| T4{test descriptor 3, This test is described by...,1}|-------|
| positive|F| up    |allowed|=3|v|T10{test descriptor 3, This test is described by...,1}|-------|
| positive|F| up    |allowed|=!3|I|T5{  This test is described by...,1}|-------|
| positive|F| up    |not allowed|-|I|T6{"test descriptor 3, This test is described by...,1}-------|
| positive|F| down    |-|- |-|T7{test descriptor 3, This test is described by...,1},clerk|-------|
| negative |-| -    |-|- |i|-------|T8{test descriptor 3, This test is described by...,1},clerk|



### **Class TEST DESCRIPTOR- method *DELETE***
**Criteria for method *delete*:**
  - ID   :      correct,do not exist,wrong type        
  - Database conection :          connection up ,connection down        
 -    permission       :           allowed, not allowed        
 -  position stored    :         true, false  
**Predicates for method *delete:**

| Criteria | Predicate |
| -------- | --------- |
|   ID       |  correct,do not exist,wrong type       |  
|   Database conection        |   connection up ,connection down       |  
|     permission              |    allowed, not allowed     |
|     position stored           |    true, false    |


## Class TEST Result

### **Class TEST Result - method *GET***
**Criteria for method *get*:**
- check Database conection where is stored all the array data
 - check if who want acess  have the correct right to do it permission



**Predicates for method *GET*:**

| Criteria | Predicate |
| -------- | --------- |
|   Database conection        |   connection up ,connection down       |  
|     permission              |    allowed, not allowed, user do not exist       |


**Combination of predicates**:

| DB connection | permssion |  Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
|connection up  |allowed     |v|T1{ manager}T5{ clerk} T5{ Quality Employee }|||
|               |not allowed |I|T2{ Customer}|||
|               |not exist   |I|T3{ CEO}|||
|connection down|  -         |I|T4{ Customer}|  ||



### **Class TEST Result - method *POST***
**Criteria for method *post*:**


 -  number of RFID, SKUId,DateOfStock (RSD)
 - TEST Result is already stored in the wharehouse
  -check Database conection where is stored all the array data
 - check if who want acess  have the correct right to do it 
 - number of object inside the body 




**Predicates for method *POST*:**

| Criteria | Predicate |
| -------- | --------- |
|   Correct type     |  positive, negative      |  
|   TEST Result  already stored    |  true,false     |  
|   Database conection        |   connection up ,connection down       |  
|     permission              |    allowed, not allowed       |
|     number of object             |    =!4 , =4     |



**Combination of predicates**:


|   RSD    |TEST Result  already stored | db connection|permission|number of object |  Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|-------|-------|
| positive|T| up    |allowed|=4|v|  T1{12345678901234567890123456789016", 12,"2021/11/28",true},manager |-------|
| positive|T| up    |allowed|=!4|I| T2{8002}|-------|
| positive|T| up    |not allowed|-|-|T3{12345678901234567890123456789016", 12,"2021/11/28",true},clerk|-------|
| positive|T| down   |-|- |v| T4{12345678901234567890123456789016", 12,"2021/11/28",true}|-------|
| positive|F| up    |allowed|=4|v|T4{12345678901234567890123456789016", 12,"2021/11/28",true}|-------|
| positive|F| up    |allowed|=!4|I|T5{ 12,"2021/11/28",true}|-------|
| positive|F| up    |not allowed|-|I|T6{12345678901234567890123456789016", 12,"2021/11/28",true}-------|
| positive|F| down    |-|- |-|T7{12345678901234567890123456789016", 12,"2021/11/28",true},clerk|-------|
| negative |-| -    |-|- |i|-------|T8{12345678901234567890123456789016", 12,"2021/11/28",true},clerk|


### **Class TEST Result - method *PUT***
**Predicates for method *:id:**
| Criteria | Predicate |
| -------- | --------- |
|   ID                        |  correct,do not exist,wrong type       |  
|   Database conection        |   connection up ,connection down       |  
|     permission              |    allowed, not allowed, user do not exist       |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|    ID      |    [0 , maxValueType]             |


**Combination of predicates**:


|   ID       | DB connection | permssion |  Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
|correct|connection up     |allowed     |v|T1{  id:"12345678901234567890123456789015", 1,2021/11/29 12:30  user: manager} ,T12B{  id:"0", user: manager},T13B{  id:"maxValueType", user: manager} |||
||                         |not allowed |v|T2{id:"12345678901234567890123456789015" ,1,2021/11/29,  Customer},|||
||                         |not exist   |I|T3{id:"12345678901234567890123456789015"  ,1,2021/11/29,, CEO}|||
||connection down|  -                   |v|T4{ id:"12345678901234567890123456789015" ,1,2021/11/29,,  Customer}|  ||
|not exist|connection up   |allowed     |v|T5{id:"12345678901234567890123456789015" ,1,2021/11/29, , manager}|||
||                         |not allowed |v|T6{id:"12345678901234567890123456789015"  ,1,2021/11/29,, Customer}|||
||                         |not exist   |I|T7{id:"12345678901234567890123456789015" ,1,2021/11/29,, CEO}|||
||connection down|  -         |v|T8{ Customer}|  ||
|wrong type|connection up  |allowed     |v|T9{id:"sdsfsaf78901234567890123456789015"  ,1,2021/11/29,, manager}|||
||                         |not allowed |v|T10{ id:"sdsfsaf78901234567890123456789015" ,1,2021/11/29, , Customer}|||
||                         |not exist   |I|T11{ id:"sdsfsaf78901234567890123456789015" ,1,2021/11/29, ,CEO}|||
||connection down|  -                   |v|T4{ id:"sdsfsaf78901234567890123456789015"  ,1,2021/11/29, Customer}|  ||



### **Class TEST Result - method *DELETE***
**Criteria for method *delete*:**
  - ID   :      correct,do not exist,wrong type        
  - Database conection :          connection up ,connection down        
 -    permission       :           allowed, not allowed        
 -  position stored    :         true, false  
**Predicates for method *delete:**

| Criteria | Predicate |
| -------- | --------- |
|   ID       |  correct,do not exist,wrong type       |  
|   Database conection        |   connection up ,connection down       |  
|     permission              |    allowed, not allowed     |
|     position stored           |    true, false    |





## Class user
### **Class user - method *GET***
**Criteria for method *GET USER*:**
	
- check Database conection where is stored all the array data
 - check if who want acess  have the correct right to do it permission



**Predicates for method *GET*:**

| Criteria | Predicate |
| -------- | --------- |
|   Database conection        |   connection up ,connection down       |  
|     permission              |    allowed, not allowed, user do not exist       |


**Combination of predicates**:

| DB connection | permssion |  Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
|connection up  |allowed     |v|T1{ manager},T5{ clerk},T1{ supplier}|||
|               |not allowed |v|T2{ Customer}|||
|               |not exist   |I|T3{ CEO}|||
|connection down|  -         |v|T4{ Customer}|  ||

**Criteria for method *GET Supplier*:**
	
- check Database conection where is stored all the array data
 - check if who want acess  have the correct right to do it permission



**Predicates for method *GET*:**

| Criteria | Predicate |
| -------- | --------- |
|   Database conection        |   connection up ,connection down       |  
|     permission              |    allowed, not allowed, user do not exist       |


**Combination of predicates**:

| DB connection | permssion |  Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
|connection up  |allowed     |v|T1{ manager}|||
|               |not allowed |v|T2{ Customer}|||
|               |not exist   |I|T3{ CEO}|||
|connection down|  -         |v|T4{ Customer}|  ||

**Criteria for method *GET USER*:**
	
- check Database conection where is stored all the array data
 - check if who want acess  have the correct right to do it permission



**Predicates for method *GET user*:**

| Criteria | Predicate |
| -------- | --------- |
|   Database conection        |   connection up ,connection down       |  
|     permission              |    allowed, not allowed, user do not exist       |


**Combination of predicates**:

| DB connection | permssion |  Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
|connection up  |allowed     |v|T1{ manager}|||
|               |not allowed |v|T2{ Customer}|||
|               |not exist   |I|T3{ CEO}|||
|connection down|  -         |v|T4{ Customer}|  ||



### **Class user- method  *POST***
**Criteria for method *post*:**


 -  name new user 
 - user  is already stored in the wharehouse
  -check Database conection where is stored all the array data
 - check if who want acess  have the correct right to do it 
 - number of object inside the body 




**Predicates for method *POST*:**

| Criteria | Predicate |
| -------- | --------- |
|   Correct type     |  positive, negative      |  
|   new user   already stored    |  true,false     |  
|   Database conection        |   connection up ,connection down       |  
|     permission              |    allowed, not allowed       |
|     number of object             |    =!5 , =5    |



**Combination of predicates**:


|   RSD    |TEST Result  already stored | db connection|permission|number of object |  Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|-------|-------|
| positive|T| up    |allowed|=5|v|  T1{"user1@ezwh.com","John","Smith", "testpassword", "customer"},manager |-------|
| positive|T| up    |allowed|=!5|I| T2{8002}|-------|
| positive|T| up    |not allowed|-|-|T3{"user1@ezwh.com","John","Smith", "testpassword", "customer"},clerk|-------|
| positive|T| down   |-|- |v| T4{"user1@ezwh.com","John","Smith", "testpassword", "customer"}|-------|
| positive|F| up    |allowed|=5|v|T9{"user1@ezwh.com","John","Smith", "testpassword", "customer"}|-------|
| positive|F| up    |allowed|=!5|I|T5{ "testpassword", "customer"}|-------|
| positive|F| up    |not allowed|-|I|T6{"user1@ezwh.com","John","Smith", "testpassword", "customer"}-------|
| positive|F| down    |-|- |-|T7{"user1@ezwh.com","John","Smith", "testpassword", "customer"},clerk|-------|
| negative |-| -    |-|- |i|-------|T8{"user1@ezwh.com","John","Smith", "testpassword", "customer"},clerk|

**Criteria for method *managerSessions*:**
- check Database conection where is stored all the array data
 - check if who want acess  have the correct right to do it permission
- all body element is written correct
-user name is actually an e-mail


**Predicates for method *GET*:**

| Criteria | Predicate |
| -------- | --------- |
|   Database conection        |   connection up ,connection down       |  
|     permission              |    allowed, not allowed, user do not exist       |
|     number of object             |    =!3 , =3    |
|     e-mail            |    T , F   |


**Combination of predicates**:

| DB connection | permssion |number of object  | e-mail   |  Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|-------|
|connection up  |allowed  | =3|  T |v|T1{32615,jhon.clock@yahoo.com,jhon }, manager|
|connection up  |allowed  | =!3|  - |I|T2{jhon.clock@yahoo.com,jhon} manager|
|connection up  | not allowed  |-|  - |I|T1{32615,jhon.clock@yahoo.com,jhon } clerk|
|connection down | n- |-|  - |I|T1{32615,jhon.clock@yahoo.com,jhon }|




**Criteria for method *managerSessions*:**
- check Database conection where is stored all the array data
 - check if who want acess  have the correct right to do it permission
- all body element is written correct
-user name is actually an e-mail


**Predicates for method *customerSessions*:**

| Criteria | Predicate |
| -------- | --------- |
|   Database conection        |   connection up ,connection down       |  
|     permission              |    allowed, not allowed, user do not exist       |
|     number of object             |    =!3 , =3    |
|     e-mail            |    T , F   |


**Combination of predicates customerSessions**:

| DB connection | permssion |number of object  | e-mail   |  Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|-------|
|connection up  |allowed  | =3|  T |v|T1{32615,jhon.clock@yahoo.com,jhon }, costumer|
|connection up  |allowed  | =!3|  - |I|T2{jhon.clock@yahoo.com,jhon} costumer|
|connection up  | not allowed  |-|  - |I|T1{32615,jhon.clock@yahoo.com,jhon } clerk|
|connection down | n- |-|  - |I|T1{32615,jhon.clock@yahoo.com,jhon }|

**Criteria for method *supplierSessions*:**
- check Database conection where is stored all the array data
 - check if who want acess  have the correct right to do it permission
- all body element is written correct
-user name is actually an e-mail


**Predicates for method *supplierSessions*:**

| Criteria | Predicate |
| -------- | --------- |
|   Database conection        |   connection up ,connection down       |  
|     permission              |    allowed, not allowed, user do not exist       |
|     number of object             |    =!3 , =3    |
|     e-mail            |    T , F   |


**Combination of predicatessupplierSessions*:

| DB connection | permssion |number of object  | e-mail   |  Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|-------|
|connection up  |allowed  | =3|  T |v|T1{32615,jhon.clock@yahoo.com,jhon }, supplier|
|connection up  |allowed  | =!3|  - |I|T2{jhon.clock@yahoo.com,jhon} supplier|
|connection up  | not allowed  |-|  - |I|T1{32615,jhon.clock@yahoo.com,jhon } clerk|
|connection down | n- |-|  - |I|T1{32615,jhon.clock@yahoo.com,jhon }|


**Criteria for method *clerkSessions*:**
- check Database conection where is stored all the array data
 - check if who want acess  have the correct right to do it permission
- all body element is written correct
-user name is actually an e-mail


**Predicates for method *clerkSessions*:**

| Criteria | Predicate |
| -------- | --------- |
|   Database conection        |   connection up ,connection down       |  
|     permission              |    allowed, not allowed, user do not exist       |
|     number of object             |    =!3 , =3    |
|     e-mail            |    T , F   |


**Combination of predicates clerkSessions**:

| DB connection | permssion |number of object  | e-mail   |  Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|-------|
|connection up  |allowed  | =3|  T |v|T1{32615,jhon.clock@yahoo.com,jhon }, clerk|
|connection up  |allowed  | =!3|  - |I|T2{jhon.clock@yahoo.com,jhon}clerk |
|connection up  | not allowed  |-|  - |I|T1{32615,jhon.clock@yahoo.com,jhon supplier} |
|connection down | n- |-|  - |I|T1{32615,jhon.clock@yahoo.com,jhon }clerk|



**Criteria for method *qualityEmployeeSessions*:**
- check Database conection where is stored all the array data
 - check if who want acess  have the correct right to do it permission
- all body element is written correct
-user name is actually an e-mail


**Predicates for method *quality EmployeeSessions:**

| Criteria | Predicate |
| -------- | --------- |
|   Database conection        |   connection up ,connection down       |  
|     permission              |    allowed, not allowed, user do not exist       |
|     number of object         |    =!3 , =3    |
|     e-mail            |    T , F   |


**Combination of predicates qualityEmployeeSessions**:

| DB connection | permssion |number of object  | e-mail   |  Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|-------|
|connection up  |allowed  | =3|  T |v|T1{32615,jhon.clock@yahoo.com,jhon }, quality Employee|
|connection up  |allowed  | =!3|  - |I|T2{jhon.clock@yahoo.com,jhon} quality Employee |
|connection up  | not allowed  |-|  - |I|T1{32615,jhon.clock@yahoo.com,jhon supplier} |
|connection down | n- |-|  - |I|T1{32615,jhon.clock@yahoo.com,jhon } quality Employee|












**Criteria for method **:**

**Criteria for method *deliveryEmployeeSessions*:**
- check Database conection where is stored all the array data
 - check if who want acess  have the correct right to do it permission
- all body element is written correct
-user name is actually an e-mail


**Predicates for method *deliveryEmployeeSessions:**

| Criteria | Predicate |
| -------- | --------- |
|   Database conection        |   connection up ,connection down       |  
|     permission              |    allowed, not allowed, user do not exist       |
|     number of object         |    =!3 , =3    |
|     e-mail            |    T , F   |


**Combination of predicates delivery EmployeeSessions**:

| DB connection | permssion |number of object  | e-mail   |  Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|-------|
|connection up  |allowed  | =3|  T |v|T1{32615,jhon.clock@yahoo.com,jhon },delivery  Employee|
|connection up  |allowed  | =!3|  - |I|T2{jhon.clock@yahoo.com,jhon} delivery Employee |
|connection up  | not allowed  |-|  - |I|T1{32615,jhon.clock@yahoo.com,jhon supplier} |
|connection down | n- |-|  - |I|T1{32615,jhon.clock@yahoo.com,jhon } delivery  Employee|





**Criteria for method *logout*:**
    
  - Database conection :          connection up ,connection down        
 -    permission       :           allowed, not allowed        

**Predicates for method *delete:**

| Criteria | Predicate |
| -------- | --------- |
|   Database conection        |   connection up ,connection down       |  
|     permission              |    allowed, not allowed     |

**Combination of predicates**:

|  permission   | Database conection  |  Valid / Invalid | Description of the test case   |  
|--------------|---------------|------------|---------------------|
  | allowed       | T          | up                  | v                | T1( clerk)  |   
  | allowed       | T          | -                  | I            | T2( clerk)  |  
    |not allowed      | -          | -                  | I            | T3( clerk)  |  

### **Class user - method *PUT***


### **Class user - method *DELETE***

## Class Restock order
### **Class Restock order - method *GET***
### **Class Restock order- method  *POST***
### **Class Restock order - method *PUT***
### **Class Restock order - method *DELETE***


## Class Return order

### **Class Return order - method *GET***
### **Class Return order- method  *POST***
### **Class Return order - method *PUT***
### **Class Return order - method *DELETE***

## Class Internal order
### **Class Internal order - method *GET***
### **Class Internal order- method  *POST***
### **Class Internal order - method *PUT***
### **Class Internal order - method *DELETE***


## Class Item
### **Class Internal order - method *GET***
### **Class Internal order- method  *POST***
### **Class Internal order - method *PUT***
### **Class Internal order - method *DELETE***















# White Box Unit Tests

### Test cases definition
    
    
    <Report here all the created Jest test cases, and the units/classes under test >
    <For traceability write the class and method name that contains the test case>


| Unit name | Jest test case |
|--|--|
|||
|||
||||

### Code coverage report

    <Add here the screenshot report of the statement and branch coverage obtained using
    the coverage tool. >


### Loop coverage analysis

    <Identify significant loops in the units and reports the test cases
    developed to cover zero, one or multiple iterations >

|Unit name | Loop rows | Number of iterations | Jest test case |
|---|---|---|---|
|||||
|||||
||||||




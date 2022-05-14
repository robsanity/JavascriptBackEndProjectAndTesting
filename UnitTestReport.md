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
### **Class SKU - method *PUT***
### **Class SKU - method *DELETE***

## Class SKU ITEM

### **Class SKU ITEM - method *GET***
### **Class SKU ITEM- method *POST***
### **Class SKU ITEM - method *PUT***
### **Class SKU ITEM - method *DELETE***


## Class POSITION

### **Class POSITION - method *GET***
### **Class POSITION - method *POST***
### **Class POSITION - method *PUT***
### **Class POSITION - method *DELETE***

## Class TEST DESCRIPTOR

### **Class TEST DESCRIPTOR - method *GET***
### **Class TEST DESCRIPTOR - method *POST***
### **Class TEST DESCRIPTOR - method *PUT***
### **Class TEST DESCRIPTOR- method *DELETE***

## Class TEST Result

### **Class TEST Result - method *GET***
### **Class TEST Result - method *POST***
### **Class TEST Result - method *PUT***
### **Class TEST Result - method *DELETE***

## Class user

### **Class user - method *GET***
### **Class user- method  *POST***
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




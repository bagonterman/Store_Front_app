DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
  item_id INTEGER(100) NOT NULL,
   product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
	price DECIMAL(8,2) NOT NULL,
      stock_quantity DECIMAL(10,2) NOT NULL,
      PRIMARY KEY (item_id)

);
CREATE TABLE departments (

  department_id INTEGER(100) NOT NULL,
   department_name VARCHAR(45) NOT NULL,
    over_head_cost  DECIMAL(8,2) NOT NULL, 
    PRIMARY KEY (department_id)

);
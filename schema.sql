DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
    item_id INT AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(30) NOT NULL,
    department_name VARCHAR(30) NOT NULL,
    price DECIMAL(60,2) NOT NULL,
    stock_quantity INT NOT NULL,
    product_sales DECIMAL(60,2),
    PRIMARY KEY (item_id)
);

 CREATE TABLE departments (
     department_id INT AUTO_INCREMENT NOT NULL,
     department_name VARCHAR(30) NOT NULL,
     over_head_costs DECIMAL(60,2) NOT NULL,
     PRIMARY KEY (department_id)
 );

INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales)
VALUES ("nerf gun", "toys", 12.99, 0, 0), 
    ("computer", "electronics", 859.99, 0, 0),
    ("ipod", "electronics", 199.99, 0, 0);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("toys", 0),
    ("electronics", 0),
    ("clothing", 0),
    ("outdoors", 0),
    ("furniture", 0);

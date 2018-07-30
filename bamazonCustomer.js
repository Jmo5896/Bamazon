var inquirer = require('inquirer'); //npm install inquirer
var mysql = require('mysql'); //npm install mysql
var cTable = require('console.table'); //npm install console.table

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'bamazon_db'
});
   
connection.connect(function(error) {
    if (error) throw error;

    displayProducts();
});

function displayTable(results) {
    var tableArr = [];
    for (var i = 0; i < results.length; i++) {
        tableArr.push(
            {
                item_id: results[i].item_id,
                product_name: results[i].product_name,
                department_name: results[i].department_name,
                price: results[i].price,
                stock_quantity:results[i].stock_quantity
              }
        );    
    }
    console.table(tableArr);
};

function displayProducts() {
    
    connection.query('SELECT * FROM products', function (error, results, fields) {
        if (error) throw error;
        
        //convert results to a table: table and console.table
        displayTable(results);

        //prompt user to select an item
        promptProduct(results);
    });
      
};

function promptProduct(inventory) {
    inquirer.prompt(
        {
            name: 'item_id',
            message: 'Enter product id (type q to quit): ',
            type: 'input',
            validate: function(value) {
                if (!isNaN(value) || value == 'q') {
                    return true;
                }
                return false;
            }
        }
    ).then(function(answers) {
        quit(answers.item_id);
        if (answers.item_id) {
            var userProduct;
            inventory.forEach(function(product) {
                if (product.item_id === parseInt(answers.item_id)) {
                    userProduct = product;
                }
                
            });
            if (userProduct) {
                //prompt user for quantity
                promptQuantity(userProduct);
            } else {
                console.log('No product exists with that id');
                displayProducts();
            }
        }
    });
};

function promptQuantity(product) {
    inquirer.prompt(
        {
            name: 'userQuantity',
            message: 'how many units do you want? (type q to quit): ',
            type: 'input',
            validate: function(value) {
                if (!isNaN(value) || value == 'q') {
                    return true;
                }
                return false;
            }
        }
    ).then(function(answers) {
        quit(answers.userQuantity);
        var userQuantity = parseInt(answers.userQuantity);
        if (userQuantity <= product.stock_quantity) {
            //update the product in the database
            
            updateQuantity(userQuantity, product);
        } else {
            console.log('insufficient quantity');
            promptQuantity(product);
        }
    });
};

function updateQuantity(quantity, product) {
    var newQuantity = product.stock_quantity - quantity;
    connection.query('UPDATE products SET stock_quantity = ? WHERE item_id = ?', [newQuantity, product.item_id], function (error, results, fields) {
        if (error) throw error;
        if (quantity > 1) {
            console.log(`You purchased ${quantity} ${product.product_name}s, their are ${newQuantity} left.`);
            updateSales(quantity, product);
            displayProducts();
        } else {
            console.log(`You purchased ${quantity} ${product.product_name}, their are ${newQuantity} left.`);
            updateSales(quantity, product);
            displayProducts();
        }
        
    });
};

// Modify the products table so that there's a product_sales column and modify the bamazonCustomer.js app so that this value is updated with each individual products total revenue from each sale.
// Modify your bamazonCustomer.js app so that when a customer purchases anything from the store, the price of the product multiplied by the quantity purchased is added to the product's product_sales column.

function updateSales(quantity, product) {
    var sales = (quantity * product.price) + product.product_sales;
    connection.query('UPDATE products SET product_sales = ? WHERE item_id = ?', [sales, product.item_id], function (error, results, fields) {
        if (error) throw error;
    });
};

function quit(answers) {
    if (answers.toLowerCase() === 'q') {
        process.exit(0);
    } 
};
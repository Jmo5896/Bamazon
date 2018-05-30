var inquirer = require('inquirer');
var mysql = require ('mysql');

// Then create a Node application called bamazonCustomer.js. Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.
// The app should then prompt users with two messages.

// The first should ask them the ID of the product they would like to buy.
// The second message should ask how many units of the product they would like to buy.

// Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

// If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.

// However, if your store does have enough of the product, you should fulfill the customer's order.

// This means updating the SQL database to reflect the remaining quantity.
// Once the update goes through, show the customer the total cost of their purchase.

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

function displayLoop(results) {
    for (var i = 0; i < results.length; i++) {
        console.log(`Item ID: ${results[i].item_id}\nProduct Name: ${results[i].product_name}\nDepartment Name: ${results[i].department_name}\nPrice: ${results[i].price}\nQuantity: ${results[i].stock_quantity}\n=====================================\n`);
    }
};

function displayProducts() {
    
    connection.query('SELECT * FROM products', function (error, results, fields) {
        if (error) throw error;
        
        //convert results to a table: table and console.table
        displayLoop(results);

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
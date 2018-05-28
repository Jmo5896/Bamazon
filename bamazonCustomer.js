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

function displayProducts() {
    
    connection.query('SELECT * FROM products', function (error, results, fields) {
        if (error) throw error;
        
        //convert results to a table: table and console.table
        console.log(results);

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
        if (answers.item_id.toLowerCase() === 'q') {
            console.log('thank you, come again!!!');
            process.exit(0);
        } 
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
        if (answers.userQuantity.toLowerCase() === 'q') {
            console.log('thank you, come again!!!');
            process.exit(0);
        } 
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
        console.log(`You purchased ${quantity} ${product.product_name}s, their are ${newQuantity} left.`);
        displayProducts();
    });
};

function quit() {

};
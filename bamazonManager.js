var inquirer = require('inquirer'); //npm install inquirer
var mysql = require('mysql'); //npm install mysql
var cTable = require('console.table'); //npm install console.table

const VIEW_PRODUCTS = 'View Products for Sale';
const LOW_INVENTORY = 'View Low Inventory';
const ADD_INVENTORY = 'Add to Inventory';
const ADD_PRODUCT = 'Add New Product';

// List a set of menu options:
    // View Products for Sale
    // View Low Inventory
    // Add to Inventory
    // Add New Product
// If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
// If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.

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
        promptCommand(results);
    });
};

function displayLowInventory() {
    connection.query('SELECT * FROM products WHERE stock_quantity < 5', function (error, results, fields) {
        if (error) throw error;
        
        //convert results to a table: table and console.table
        displayTable(results);
        
    });

    //prompt user to select an item
    connection.query('SELECT * FROM products', function (error, results, fields) {
        promptCommand(results);
    });
};

function promptProduct(inventory) {
    displayTable(inventory);
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
            message: 'how many units do you want to add? (type q to quit): ',
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
        updateInventory(userQuantity, product);
    });
};

function updateInventory(quantity, product) {
    var newQuantity = product.stock_quantity + quantity;
    
    //testing
    updateOverHead(product.price, product.department_name, quantity);
    connection.query('UPDATE products SET stock_quantity = ? WHERE item_id = ?', [newQuantity, product.item_id], function (error, results, fields) {
        if (error) throw error;
        console.log(`You added ${quantity} to ${results.product_name}`);
        displayProducts();
    });
};

function addProduct(array) {
    inquirer.prompt([
        {
            name: 'productName',
            message: 'what is the product called?: ',
            type: 'input'
        },
        {
            name: 'departmentName',
            type: 'list',
            message: 'what department will it be in?: ',
            choices: array
        },
        {
            name: 'price',
            message: 'How much does each unit cost?: ',
            type: 'input',
            validate: function(value) {
                if (!isNaN(value)) {
                    return true;
                }
                return false;
            }
        },
        {
            name: 'stockQuantity',
            message: 'How many units?: ',
            type: 'input',
            validate: function(value) {
                if (!isNaN(value)) {
                    return true;
                }
                return false;
            }
        },
    ]).then(function(answers) {
        var addName = answers.productName;
        var addDepartment = answers.departmentName;
        var addPrice = parseFloat(answers.price);
        var addQuantity = parseInt(answers.stockQuantity);     
        addToProducts(addName, addDepartment, addPrice, addQuantity);
    });
};

function updateOverHead(price, department, quantity) {
    var newOverHead = (price / 2) * quantity;
        
    connection.query('SELECT * FROM departments WHERE department_name = ?', [department], function (error, results, fields) {
        if (error) throw error;
        newOverHead += parseFloat(results[0].over_head_costs);
            
        connection.query('UPDATE departments SET over_head_costs = ? WHERE department_name = ?', [newOverHead, department], function (error, results, fields) {
            if (error) throw error;
            
    
        });
    });
    
};

function addToProducts(name, department, price, quantity) {
    updateOverHead(price, department, quantity);

    connection.query('INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ? ,? ,?)', [name, department, price, quantity], function (error, results, fields) {
        if (error) throw error;
        console.log(`You added ${quantity} to ${results.product_name}`);
        displayProducts();
    });
};

function promptCommand(inventory) {
    inquirer.prompt(
        {
            name: 'command',
            message: 'What would you like to do?',
            type: 'list',
            choices: [LOW_INVENTORY, ADD_INVENTORY, ADD_PRODUCT, 'quit']
        }
    ).then(function(answers) {
        switch (answers.command) {
            case VIEW_PRODUCTS:
                displayProducts();
                break;
            case LOW_INVENTORY:
                displayLowInventory();
                break;
            case ADD_INVENTORY:
                promptProduct(inventory);
                break;
            case ADD_PRODUCT:
                connection.query('SELECT * FROM departments', function (error, results, fields) {
                    var departmentArr = [];
                    for (var i = 0; i < results.length; i++) {
                        departmentArr.push(results[i].department_name);
                    }
                    addProduct(departmentArr);
                });
                break;
            case 'quit':
                process.exit(0);
                break;
        }
    });
};

function quit(answers) {
    if (answers.toLowerCase() === 'q') {
        process.exit(0);
    } 
};
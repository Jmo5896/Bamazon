var inquirer = require('inquirer'); //npm install inquirer
var mysql = require('mysql'); //npm install mysql
var cTable = require('console.table'); //npm install console.table

const PRODUCT_SALES = 'View Product Sales by Department';
const NEW_DEPARTMENT = 'Create New Department';



var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'bamazon_db'
});
   
connection.connect(function(error) {
    if (error) throw error;
    promptCommand();
});
    
// BROKEN 
function collectSupervisorData() {
    var dataArr1 = [];
    var dataArr2 = [];

    connection.query('SELECT * FROM departments ', function (error, results, fields) {
        if (error) throw error;
        for (var i = 0; i < results.length; i++) {
            results[i].product_sales = '';    
            dataArr1.push(results[i]);
        
        }
        

        connection.query('SELECT products.department_name, products.product_sales FROM products ', function (error, res, fields) {
            if (error) throw error;
            for (var i = 0; i < res.length; i++) {  
                dataArr2.push(res[i]);

                if (res[i].department_name === dataArr1[i].department_name) {

                }
            }
            dataArr2.forEach(function())
        console.table(dataArr2);
        console.table(dataArr1);
        });
        
        
    });
    
};
// END BROKEN

//display sales
function displayTable() {
    var tableArr = [];
    
    for (var i = 0; i < results.length; i++) {
        tableArr.push(
            {
                department_id: results[i].item_id,
                department_name: results[i].product_name,
                over_head_costs: results[i].department_name,
                product_sales: results[i].price,
                total_profit: results[i].stock_quantity
                }
        );    
    }
    promptCommand();
    console.table(tableArr);
};

//end display sales

//add department
function add_department() {
    inquirer.prompt(
        {
            name: 'newDepartment',
            message: 'what is the name of the new department?: ',
            type: 'input'
        }
    ).then(function(answers) {
        var addDepartment = answers.newDepartment;   
        addToDepartments(addDepartment);
        
    });
};

function addToDepartments(department) {
    connection.query('INSERT INTO departments (department_name, over_head_costs) VALUES (?, ?)', [department, 0], function (error, results, fields) {
        if (error) throw error;
        console.log(`\n\n-------------\n\n${department} has been added\n\n-------------\n\n`);
        promptCommand();
    });
    
};
//end add department

function promptCommand() {
    inquirer.prompt(
        {
            name: 'command',
            message: 'What would you like to do?',
            type: 'list',
            choices: [PRODUCT_SALES, NEW_DEPARTMENT, 'quit']
        }
    ).then(function(answers) {
        switch (answers.command) {
            case PRODUCT_SALES:
                collectSupervisorData();
                break;
            case NEW_DEPARTMENT:
                add_department();
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
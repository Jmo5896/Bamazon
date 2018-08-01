# Bamazon
        The original purpose of this project was to teach myself mySQL,
    and to make a working back-end application that will be able to track 
    inventory and organize products.  I created three different views
    for the data: customer, manager, and supervisor.  

# Getting Started
These instructions will get you a copy of the project up and running on your
 local machine.

    *Prerequisites:
        You will need both MAMP and an app for
        your mySQL databases, I use HeidiSQL.
[MAMP](https://www.mamp.info/en/)
[HeidiSQL](https://www.heidisql.com/download.php)

    *Getting Bamazon Running:
        1. Clone this repository to your local machine, for help check out the
        link below.
[https://services.github.com/on-demand/github-cli/clone-repo-cli](https://services.github.com/on-demand/github-cli/clone-repo-cli)

        2. When it finishes downloading run "npm i" this will install the
         following npm packages that you will need for the app to run:
            *console.table
            *inquirer
            *mysql
        3. Next you will want to open your HeidiSQL, and copy paste the 
        schema.sql file into the query line to seed/set up the databases.  
        (Don't forget to hit run!!!)
        4. Now you are all set up to run any of the 3 options

# How It Works Walkthrough:
    After set up you have 3 files you get to choose from to start up 
    with node: bamazonCustomer.js, bamazonManager.js, 
    and bamazonSupervisor.js.

    *bamazonCustomer.js:
        1. After booting up your mamp and your HeidiSQL make sure lines
         7-8 in the bamazonManager.js file match your HeidiSQL credentials
[Customer Credentials](./gifs/customer-credentials.gif)
        
        2. In your bash enter "node bamazonCustomer.js"
[Customer Start-up](./gifs/customer-startUp.gif)
       
        3. select any item by it's item_id number, or hit q to quit
            *You will then be asked, "how many units do you want?" enter 
            a number.
            *The app will tell you how many units you purchased and will go
             back to the start-up table
            *It will continue to do this until you quit.
[Customer Demo](./gifs/customer-demo.gif)
    
    *bamazonManager.js
        1. After booting up your mamp and your HeidiSQL make sure lines 12-13 
        in the bamazonManager.js file match your HeidiSQL credentials
[Manager Credentials](./gifs/manager-credentials.gif)

        2. In your bash enter "node bamazonManager.js"
[Manager Start-up](./gifs/manager-startUp.gif)

        3. select any of four menu options: View low Inventory, Add to 
        Inventory, Add New Product, or Quit.  
            1. View low Inventory:
                *if selected it will take you to a screen showing all products 
                with a stock_inventory less than 5.
[Manager Low-Inventory](./gifs/manager-lowInventory.gif)

            2. Add to Inventory
                *If selected it will prompt you to enter the item_id of what you 
                want to update, then it will ask you to enter the number of units 
                you want to add
[Manager Add-Inventory](./gifs/manager-addInventory.gif)

            3. Add New Product:
                *If selected  it will prompt you to enter the name of the product, 
                what department it will be in, how much it will cost, and how 
                many units.
[Manager Add-Product](./gifs/manager-addProduct.gif)

            4. Quit:
                *allows you to exit the program, you can also hit control+c to quit 
                at anytime.
    
    *bamazonSupervisor.js
        1. After booting up your mamp and your HeidiSQL make sure lines 10-11 in the 
        bamazonSupervisor.js file match your HeidiSQL credentials
[Supervisor Credentials](./gifs/supervisor-credentials.gif)

        2. In your bash enter "node bamazonSupervisor.js"
[Supervisor Start-up](./gifs/supervisor-startUp.gif)

        3. select any of three menu options: View Product Sales by Department, Create 
        New Department, or Quit.  
            1. View Product Sales by Department:
                *if selected it will take you to a screen showing a table sorted by 
                department_id with: department_name, over_head_costs, product_sales, 
                and total_profit.
[Supervisor Profit](./gifs/supervisor-profit.gif)

            2. Create New Department
                *If selected it will prompt you to enter the item_id of what you want 
                to update, then it will ask you to enter the number of units you want 
                to add.
[Supervisor Add-Department](./gifs/supervisor-addDepartment.gif)

            3. Quit:
                *allows you to exit the program, you can also hit control+c to quit
                at anytime.

# Built With:
    *Javascript
    *Node.js

# Authors:
    *Justin Moore
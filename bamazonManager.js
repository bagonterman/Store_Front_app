var mysql = require("mysql");
var requirer = require("inquirer");
var $ = require('jquery');
//var search = process.argv[2];

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "naomic1201",
    database: "bamazonDB"
});
var bamCustomer = () => {
    connection.connect(function (err) {
        if (err) throw err;
        console.log("connected as id " + connection.threadId);

        afterConnection();


    });
    function req() {
        requirer.prompt([
            {
                type: "rawlist",
                name: "item",
                message: "Please Choose",
                choices: ["View Products for Sale", new requirer.Separator(), "View Low Inventory", new requirer.Separator(), "Change Inventory"]
            },

            {
                type: "confirm",
                message: "Are you sure:",
                name: "confirm",
                default: true
            },

        ])
            .then(answers => {

                managerChoices = answers.item
                if (managerChoices == "View Products for Sale") {
                    showInventory()
                    connection.end();
                }
                else if (managerChoices == "View Low Inventory") {
                    lowInventory()
                }
                else if (managerChoices == "Change Inventory") {
                    showInventory()
                }



                //lowInventory()
                //showInventory()

            }).then(answers => {

                if (managerChoices == "Change Inventory") {
                    setTimeout(function () { addInventory() }, 1000);
                }

            })
    }
    function showInventory() {
        connection.query("SELECT * FROM products", function (err, res) {
            if (err) throw err;
            //console.log(res);
            for (i = 0; i < res.length; i++) {
                console.log("\n" + zeroAppend(res[i].item_id, 15) + " | " + zeroAppend(res[i].product_name, 15) + " | " + zeroAppend(res[i].department_name, 15) + " | " + zeroAppend(res[i].price, 15) + " | " + zeroAppend(res[i].stock_quantity, 15));
                //console.log(zeroAppend(res[i].item_id, 15) + " | " + zeroAppend(res[i].product_name, 15) + " | " + zeroAppend(res[i].department_name, 15) + " | " + zeroAppend(res[i].price, 15) + " | " + zeroAppend(res[i].stock_quantity, 15));
            }
        });

    }
    function lowInventory() {

        connection.query("SELECT * FROM products WHERE stock_quantity <=3 ORDER BY stock_quantity", function (err, res) {
            if (err) throw err;
            for (i = 0; i < res.length; i++) {
                console.log(zeroAppend(res[i].item_id, 15) + " | " + zeroAppend(res[i].product_name, 15) + " | " + zeroAppend(res[i].department_name, 15) + " | " + zeroAppend(res[i].price, 15) + " | " + zeroAppend(res[i].stock_quantity, 15));

            }
        });
        connection.end();
    }
    function addInventory() {

        requirer.prompt([
            {
                type: "rawlist",
                name: "change_choice",
                message: "Please Choose",
                choices: ["Change Inventory", new requirer.Separator(), "New Product"]
            },

            // {
            //     type: "input",
            //     message: "Choose the product to add inventory to?",
            //     name: "product"
            // },
            // {
            //     type: "input",
            //     message: "Please type the amount you would like to add.",
            //     name: "productAmount"
            // }



        ])
            .then(Invanswers => {
                //console.log(Invanswers.change_choice)
                if (Invanswers.change_choice == "Change Inventory") {

                    requirer.prompt([
                        {
                            type: "input",
                            message: "Choose the product to add inventory to?",
                            name: "product"
                        },
                        {
                            type: "input",
                            message: "Please type the amount you would like to add.",
                            name: "productAmount"
                        }
                    ]).then(Invanswers => {
                        myChoice = Invanswers.change_choice;
                        prodToChange = Invanswers.product;
                        productAmount = Invanswers.productAmount;
                        //console.log(myChoice)

                        connection.query("SELECT stock_quantity FROM products WHERE item_id = ?", [prodToChange], function (err, res) {
                            if (err) throw err;

                            var currentStock = res[0].stock_quantity;
                            let updatedQty = Number(currentStock) + Number(productAmount);
                            connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [updatedQty, prodToChange], function (err, res) {
                                if (err) throw err;
                                for (i = 0; i < res.length; i++) {
                                    console.log(zeroAppend(res[i].item_id, 15) + " | " + zeroAppend(res[i].product_name, 15) + " | " + zeroAppend(res[i].department_name, 15) + " | " + zeroAppend(res[i].price, 15) + " | " + zeroAppend(res[i].stock_quantity, 15));

                                }
                            });
                            connection.end();
                        });

                    })
                }
                else {
                    requirer.prompt([

                        {
                            type: "input",
                            message: "Create an id.",
                            name: "id",
                            validate: function validateLastName(name) {
                                return name !== '';
                            }
                        },
                        {
                            type: "input",
                            message: "Type product name.",
                            name: "productName"
                        },
                        {
                            type: "input",
                            message: "Enter Department Name.",
                            name: "deptName"
                        },
                        {
                            type: "input",
                            message: "Enter the item price.",
                            name: "itemPrice"
                        },
                        {
                            type: "input",
                            message: "Enter stock quantity.",
                            name: "quantity"
                        },




                    ])
                        .then(addProdanswers => {

                            connection.query(" INSERT INTO products (item_id,product_name, department_name, price, stock_quantity) VALUES (?,?,?,?,?)", [addProdanswers.id, addProdanswers.productName, addProdanswers.deptName, addProdanswers.itemPrice, addProdanswers.quantity], function (err, res) {
                                if (err) throw err;
                                console.log(addProdanswers.id + "  " + addProdanswers.productName + "  " + addProdanswers.deptName + "  " + addProdanswers.itemPrice + "  " + addProdanswers.quantity)
                                connection.end();
                            });

                        })

                }


            })


    }

    function zeroAppend(string, i) {

        string = String(string)// Convert input into a string
        var str_length = String(string).length// Count the characters in the string

        //Append 0 to the start of the string until the string length == i
        while (str_length < i) {

            var new_string = " " + string
            string = String(new_string)
            str_length = new_string.length

        }

        return string
    }
    function afterConnection() {

        req();



    }///end afterConnection
    //connection.end();
}
bamCustomer()
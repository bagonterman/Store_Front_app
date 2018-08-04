var mysql = require("mysql");
var requirer = require("inquirer");
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
                }
                else if (managerChoices == "View Low Inventory") {
                    showInventory()
                }
                else if (managerChoices == "Change Inventory") {
                    showInventory()
                }



                //lowInventory()
                //showInventory()
            }).then(answers => {
                setTimeout(function () { addInventory() }, 2000);

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

    }
    function addInventory() {

        requirer.prompt([
            {
                type: "rawlist",
                name: "change_choice",
                message: "Please Choose",
                choices: ["Change Inventory", new requirer.Separator(), "New Product"]
            },

            {
                type: "input",
                message: "Choose the product to add inventory to?",
                name: "product"
            },



        ])
            .then(Invanswers => {
                myChoice = Invanswers.change_choice;
                prodToChange = Invanswers.product;
                if (myChoice == "Change Inventory") {

                }
                //showInventory()
                //console.log(Invanswers)
                //managerChoices = answers.item

                // connection.query("SELECT * FROM products WHERE stock_quantity <=3 ORDER BY stock_quantity", function (err, res) {
                //     if (err) throw err;
                //     for (i = 0; i < res.length; i++) {
                //         console.log(zeroAppend(res[i].item_id, 15) + " | " + zeroAppend(res[i].product_name, 15) + " | " + zeroAppend(res[i].department_name, 15) + " | " + zeroAppend(res[i].price, 15) + " | " + zeroAppend(res[i].stock_quantity, 15));

                //     }
                // });

            })


    }
    function newProducts() {

        connection.query("SELECT * FROM products WHERE stock_quantity <=3 ORDER BY stock_quantity", function (err, res) {
            if (err) throw err;
            for (i = 0; i < res.length; i++) {
                console.log(zeroAppend(res[i].item_id, 15) + " | " + zeroAppend(res[i].product_name, 15) + " | " + zeroAppend(res[i].department_name, 15) + " | " + zeroAppend(res[i].price, 15) + " | " + zeroAppend(res[i].stock_quantity, 15));

            }
        });

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
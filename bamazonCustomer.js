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
                type: "input",
                message: "What is the ID of the product you would like to buy?",
                name: "product_id"
            },
            {
                type: "input",
                message: "How many units of the product they would like to buy?",
                name: "units"
            },

            {
                type: "confirm",
                message: "Are you sure:",
                name: "confirm",
                default: true
            }
        ])
            .then(answers => {
                // console.log(answers.product_id)
                prod_id = answers.product_id;
                requested_units = answers.units;
                function fufillOrder() {
                    let updated = {
                        qty: qty,
                        requested_units: requested_units
                    }
                    connection.query(
                        "UPDATE products SET ? WHERE item_id=?", [{ stock_quantity: Number(qty) - Number(requested_units) }, prod_id],
                        function (err, res) {
                            if (err) throw err;
                            // console.log(res);
                            return
                            //console.log(err)
                            // console.log(udated.requested_units);
                            // console.log("stock quantity was updated to " + Number(updated.qty) - Number(udated.requested_units))
                        }

                    );

                    console.log("stock quantity was updated to " + (Number(qty) - Number(requested_units)) + "\n" +
                        "The total cost of your purchase is " + (Number(requested_units) * Number(price))
                    )

                }
                function insufficientQuantity() {

                }
                connection.query("SELECT * FROM products WHERE item_id=?", [prod_id], function (err, res) {
                    if (err) throw err;
                    qty = res[0].stock_quantity;
                    price = res[0].price;
                    Number(requested_units) <= Number(qty) ? fufillOrder() : insufficientQuantity();


                });

            })
    }
    function afterConnection() {

        connection.query("SELECT * FROM products", function (err, res) {
            if (err) throw err;
            //console.log(res);
            for (i = 0; i < res.length; i++) {

                console.log(zeroAppend(res[i].item_id, 15) + " | " + zeroAppend(res[i].product_name, 15) + " | " + zeroAppend(res[i].department_name, 15) + " | " + zeroAppend(res[i].price, 15) + " | " + zeroAppend(res[i].stock_quantity, 15));
            }
            // console.log(res);
            req();

        });
        //}
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


    }///end afterConnection
    //connection.end();
}
bamCustomer()
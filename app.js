//jshint esversion:6

// Const modules (express, body-parser, https)

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const https = require("https");



// .use(express.static() allows us to use "static" files in our project folder for our server to be able to call up and use.
// this function is part of the express module
app.use(express.static("public"));

app.get("/", function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/", function(req,res){
    const firstName = req.body.first;
    const lastName = req.body.last;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    // formats our data object into a JSON flat packed object(JSON object)
    const jsonData = JSON.stringify(data);
    console.log(jsonData);

    const url = "https://us6.api.mailchimp.com/3.0/lists/dc2d721869";
    const options = {
        method: "POST",
        auth: "nikperu12:47fb089f7b29e47ac77943136fe0956e-us6"
    }
    

    const request = https.request(url, options, function(response){

        // check for status code inside this function (response.statusCode) and either send (res.send)
        // success.html or failure.html 
        // use res.send inside the app.get()

        console.log(response.statusCode);

        if(response.statusCode / 100 === 2){
            res.sendFile(__dirname +"/success.html");
        }
        else{
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
        
    })


    request.write(jsonData);
    request.end();


});

// Takes us back to home route after pressing button(check failure.html)
app.post("/failure", function(req,res){
    res.redirect("/");
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, ()=>{
    console.log("Successfully started on server")
});
 
// API KEY
// 47fb089f7b29e47ac77943136fe0956e-us6 :   ${dc} = us6

// List/Audience ID
// dc2d721869
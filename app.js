const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");
const p1 = "jayyveer:40720a5801297f8";
const p2 = "3ebc8a5f2bd532ea1-us8";
const p3 = p1+p2;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    var firstName = req.body.fname;
    var lastName = req.body.lname;
    var email = req.body.email;
    console.log(firstName, lastName, email); 
    //dataobject
    const data = {
        members: [
            {
                email_address: email,
                status:"subscribed",
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    var jsonData = JSON.stringify(data);

    const url = " https://us8.api.mailchimp.com/3.0/lists/ca10006632";
    const options = {
        method: "POST",
        auth: p3
    }

    const request = https.request(url, options, function(response){
        if(response.statusCode === 200)
        {
            res.sendFile(__dirname + "/success.html");
        }
        else
        {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    })
    request.write(jsonData);
    request.end();
});

app.listen(process.env.PORT  || 3000,function(){
    console.log("Server is running on port 3000");
})

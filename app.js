const express = require('express');
const request = require('request');
const https = require('https');
const bodyParser = require('body-parser');

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }))


app.get("/", (req, res) =>
{

    res.sendFile(`${__dirname}/signup.html`)
})

app.post("/", (req, res) =>
{
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;
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

    const jsonData = JSON.stringify(data);
    const url = "https://us21.api.mailchimp.com/3.0/lists/d965fb5764";

    const options = {
        method: "POST",
        auth: "aziz:13e9bf1da364f0f67f339d212c7cb719-us21"
    }

    const request = https.request(url,options, (response)=>{
        if(response.statusCode==200){
            res.sendFile(`${__dirname}/success.html`)
        }
        else{
            res.sendFile(`${__dirname}/failure.html`)
        }
        response.on("data",(data)=>{
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();


});

app.post("/failure",(req,res)=>{
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, () =>
{
    console.log("The Server is runing on port 3000");
})


// APi key
// 13e9bf1da364f0f67f339d212c7cb719-us21

// Aud- ID
// d965fb5764

// curl -X POST \
//   https://us21.api.mailchimp.com/3.0/lists/13e9bf1da364f0f67f339d212c7cb719-us21 \
//   --user "anystring:${apikey}"' \
//   -d '{"name":"","contact":{"company":"","address1":"","address2":"","city":"","state":"","zip":"","country":"","phone":""},"permission_reminder":"","use_archive_bar":false,"campaign_defaults":{"from_name":"","from_email":"","subject":"","language":""},"notify_on_subscribe":"","notify_on_unsubscribe":"","email_type_option":false,"double_optin":false,"marketing_permissions":false}'
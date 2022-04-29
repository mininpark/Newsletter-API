const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const mailchimp = require('@mailchimp/mailchimp_marketing')

const app = express();


//------MailChimp Config-------//
 
mailchimp.setConfig({
  server:"us12", //your server can be found at the end of your API-key.
  apiKey:"841a55fff2efb18dfe4387836b1722a8-us12",
});

//static files into public folder
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});
 

//---Your post function that is used when submitting your info--//
//app.post --> included HTML action and method important! 
app.post("/", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  console.log(firstName,lastName,email);

//-------MailChimp add user to audience-------//
  const listId = "0681173e55";
  const subscribingUser = {
      firstName: firstName,
      lastName: lastName,
      email: email,
  };
//Mailchimp API POST New Subscriber Function
  async function run(){
    //"Try" this function and if sucessful do the following
    try {
      const response = await mailchimp.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName
      }
  });
  console.log("Added the contact from" +response.merge_fields.FNAME+ " as an audience member.");

  res.sendFile(__dirname + "/success.html")
}
  //If the "Try" function isn't successful, do this on failure
  catch (err) {
    //This is will return the error code
    console.log(err.status);
    res.sendFile(__dirname + "/failure.html")
    }
  }

  run(); //runs the MailChimp function above.

});
/*
app.post("/error", (req,res) => {
  res.redirect("/");
})
*/
app.listen(3000, () => {
  console.log("server is running");
});

//API Key: 841a55fff2efb18dfe4387836b1722a8-us12
//Audiance ID: 0681173e55

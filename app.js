const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const client = require("@mailchimp/mailchimp_marketing");

// Configure Mailchimp API
client.setConfig({
  apiKey: "6153bd333f94b821ebd0c8c2e41a8929-us21",
  server: "us21",
});

const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/signup.html');
});

app.post('/', async (req, res) => {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  // Create the Mailchimp subscriber object
  const subscriber = {
    email_address: email,
    status: "subscribed",
    merge_fields: {
      FNAME: firstName,
      LNAME: lastName
    }
  };

  try {
    // Subscribe the user to the Mailchimp list
    const response = await client.lists.addListMember("7352285ad8", subscriber);
    console.log(response);
    res.sendFile(__dirname + '/success.html');
  } catch (error) {
    console.error(error);
    res.sendFile(__dirname + '/failure.html');
  }
});

app.post('/failure', (req, res) => {
    res.redirect('/');
  });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



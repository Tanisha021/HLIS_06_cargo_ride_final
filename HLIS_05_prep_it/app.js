const express = require('express');
const app_routing = require('./modules/app-routing');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;
const path = require("path");
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
const common  = require('./utilities/common');
const validator = require("./middleware/validators");
const headerAuth = require("./middleware/header-auth");
const api_doc = require("./modules/v1/Api_document/route");
const cronn = require("./middleware/cronjob")
app.use('/api-doc', api_doc);

app.use(validator.extractHeaderLanguage);
app.use(headerAuth.validateApiKey);
app.use(headerAuth.header)

// cronn.updateOrderStatus();
// app.use(common.decryptPlain);
app_routing.v1(app); //router v1 ko call karega 


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port,()=>{
    console.log(`Server is running on port:${port}`);
})


const express = require('express');
const app_routing = require('./modules/app-routing');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;
// Set EJS as the templating engine
app.set('view engine', 'ejs');  
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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


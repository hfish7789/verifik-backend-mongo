const express = require("express");
const cors = require("cors");
const app = express();
var bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(upload.array()); 

require("./app.js")(app);

const PORT =  3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
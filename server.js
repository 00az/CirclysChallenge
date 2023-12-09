const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");


const serverConfig = require("./configs/server.config");
const dbConfig = require("./configs/db.config");
var cors = require('cors')
const app = express();

app.use(bodyParser.json());
app.use(cors())

mongoose.connect(dbConfig.DB_URL)
const db = mongoose.connection
db.on("error", () => console.log("Can't connect to DB"));
db.once("open", () => {
  console.log("Connected to Mongo DB");
});


require("./routes/movie.routes")(app);
require("./routes/auth.routes")(app);
require("./routes/booking.routes")(app);

app.use((req, res, next) => {
  var contype = req.headers['content-type'];
  if (contype.indexOf('application/json') !== 0){
    return res.status(205).send({
      code: 205,
      msg:"Content is wrong"
    });
  }
  res.contentType('application/json');
  res.status(405).send({
  code: 405,
  msg: "Method wrong"
  })
 });

app.listen(serverConfig.PORT, () => {
  console.log(`Application running on port ${serverConfig.PORT}`);
});


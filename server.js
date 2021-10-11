const express = require("express");
const app = express();
const sequelize = require("./models");
const initRoutes = require("./routes/candidate_summay.route");

global.__basedir = __dirname + "/..";

app.use(express.urlencoded({ extended: true }));
initRoutes(app);

sequelize.sync();

let port = 5000;
app.listen(port, () => {
  console.log(`Running at localhost:${port}`);
});
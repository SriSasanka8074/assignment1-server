const express = require("express");
const cors = require("cors");
const app = express();
const sequelize = require("./models");
const initRoutes = require("./routes/candidate_summay.route");

global.__basedir = __dirname + "/..";
app.use(
  cors({
      origin: "*",
  })
);

const corsOptions = {
  origin: '*',
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('assets'));
app.use("/api/excel", initRoutes);

sequelize.sync();

let port = 5000;
app.listen(port, () => {
  console.log(`Running at localhost:${port}`);
});
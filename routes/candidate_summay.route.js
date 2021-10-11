const express = require("express");
const router = express.Router();
const excelController = require("../controllers/excel.controller");
const upload = require("../middleware/upload");

let routes = (app) => {
  router.post("/upload", upload.single("file"), excelController.upload);
  router.get("/candidateSummary", excelController.getCandidateSummary);

  app.use("/api/excel", router);
};

module.exports = routes;
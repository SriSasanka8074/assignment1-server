const Candidate_Summary = require("../models/candidate_summary");

const readXlsxFile = require("read-excel-file/node");

const upload = async (req, res) => {
  try {
    if (req.file == undefined) {
      return res.status(400).send("Please upload an excel file!");
    }

    let path =
      __basedir + "/resources/static/assets/uploads/" + req.file.filename;

    readXlsxFile(path).then((rows) => {
      // skip header
      rows.shift();

      let candidate_summary = [];

      rows.forEach((row) => {
        let tutorial = {
            name: row[0],
            email_id: row[1],
            phone_number: row[2],
            candidates_data: {
              "ctc":  {
                 "value" : 65,
                 "ctcUnit": "Lakhs",
                  "ctcCurrency" : "INR",
               },
              "candidateExperience": 23,
              "company ": {
                "name": "BAJAJ FINANCIAL SECURITIES LIMITED"
              },
              "location" : {
                "city": "Mumbai, Maharashtra"
              },
              "linkedIn": "https://www.linkedin.com/profile" 
            },
            created_date: row[3],
            created_by: row[4],
            modified_date: row[5],
            modified_by: row[6],
        };
        candidate_summary.push(tutorial);
      });

      Candidate_Summary.bulkCreate(candidate_summary)
        .then(() => {
          res.status(200).send({
            message: "Uploaded the file successfully: " + req.file.originalname,
          });
        })
        .catch(Sequelize.ValidationError, function (err) {
          // respond with validation errors
          return res.status(422).send(err.errors);
        })
        .catch((error) => {
          res.status(500).send({
            message: "Fail to import data into database!",
            error: error.message,
          });
        });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
};

const getCandidateSummary = (req, res) => {
  Candidate_Summary.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving candidate_summary.",
      });
    });
};

module.exports = {
  upload,
  getCandidateSummary,
};
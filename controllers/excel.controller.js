const Candidate_Summary = require("../models/candidate_summary");

const readXlsxFile = require("read-excel-file/node");
const Sequelize = require("sequelize");
const _ = require("lodash");

const upload = async (req, res) => {
  try {
    if (req.file == undefined) {
      return res.status(400).send("Please upload an excel file!");
    }

    let path =
    __basedir + "/assignment1-server/assets/" + req.file.filename;
    readXlsxFile(path).then((rows, index) => {
      // skip header
      rows.shift();
      
      let candidate_summary = [];
      let ccsmry = [];
      rows.forEach((row) => {
        let candidate_details = {
            name: row[0],
            email_id: row[7],
            phone_number: row[8],
            candidates_data: {
              "ctc":  {
                 "value" : row[5],
                 "ctcUnit": row[6],
                  "ctcCurrency" : row[4],
               },
              "candidateExperience": row[3],
              "company ": {
                "name": row[2]
              },
              "location" : {
                "city": row[10]
              },
              "linkedIn": row[9] 
            },
            created_by: "SriSasanka",
            modified_by: "SriSasanka",
        };
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(re.test(candidate_details.email_id)) {
          let ctc = candidate_details.candidates_data.ctc;
          if (ctc.ctcCurrency.includes("INR") || ctc.ctcCurrency.includes("USD") || ctc.ctcCurrency.includes("EUR")) {
            if (ctc.ctcCurrency.includes("INR")) {
              if (ctc.ctcUnit.toUpperCase().includes("LAKHS") || ctc.ctcUnit.toUpperCase().includes("CRORES")) {
                candidate_summary.push(candidate_details);
              } else {
                const ccdetails = {...candidate_details};
                ccdetails.reason = ccdetails.reason + "/ Invalid CTC Units";
              }
            } else {
              if (ctc.ctcUnit.toUpperCase().includes("THOUSANDS") || ctc.ctcUnit.toUpperCase().includes("MILLIONS")) {
                candidate_summary.push(candidate_details);
              } else {
                const ccdetails = {...candidate_details};
                ccdetails.reason = ccdetails.reason + "/ Invalid CTC Units";
              }
            }
          } else {
            const ccdetails = {...candidate_details};
            ccdetails.reason = ccdetails.reason + "/ Invalid CTC Currency"
          }
        } else {
          const ccdetails = {...candidate_details};
          ccdetails.reason = "Invalid email id.";
          let ctc = ccdetails.candidates_data.ctc;
          if (ctc.ctcCurrency.includes("INR") || ctc.ctcCurrency.includes("USD") || ctc.ctcCurrency.includes("EUR")) {
            if (ctc.ctcCurrency.includes("INR")) {
              if (!ctc.ctcUnit.toUpperCase().includes("LAKHS") || !ctc.ctcUnit.toUpperCase().includes("CRORES")) {
                ccdetails.reason = ccdetails.reason + "/ Invalid CTC Units";
              }
            } else {
              if (!ctc.ctcUnit.toUpperCase().includes("THOUSANDS") || !ctc.ctcUnit.toUpperCase().includes("MILLIONS")) {
                ccdetails.reason = ccdetails.reason + "/ Invalid CTC Units";
              }
            }
          } else {
            ccdetails.reason = ccdetails.reason + "/ Invalid CTC Currency"
          }
          ccsmry.push(ccdetails);
        }

      });
      for (let i = 0; i< candidate_summary.length-1; i++) {
        if ((candidate_summary[i].name === candidate_summary[i+1].name )|| (candidate_summary[i].email_id === candidate_summary[i+1].email_id ) ||
        (candidate_summary[i].phone_number === candidate_summary[i+1].phone_number )) {
          const ccdtls = {...candidate_summary[i]};
          ccdtls.reason = "duplicate name/ email id/ phone number";
          ccsmry.push(ccdtls);
          if (i > -1) {
            candidate_summary.splice(i, 1);
          }
        }
      }
      Candidate_Summary.bulkCreate(candidate_summary, {validate: true})
        .then(() => {
          res.status(200).json({
            message: "Uploaded the file successfully: " + req.file.originalname,
            data: candidate_summary,
            failedcases: ccsmry
          });
        })
        .catch((error) => {
          res.status(500).json({
            message: "Fail to import data into database!",
            error: error.errors,
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
const dbConfig = require("../config/database.config");
const Sequelize = require("sequelize");
console.log(dbConfig);
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

/* const db = {};

db.Sequelize = Sequelize;
db.DataTypes = Sequelize.DataTypes;
db.sequelize = sequelize;

db.candidateSummary = require("./candidate_summary")(sequelize, Sequelize, DataTypes); */

module.exports = sequelize;
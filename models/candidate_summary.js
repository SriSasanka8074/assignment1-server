const sequelize = require("./index");
const Sequelize = require("sequelize");
const DataTypes = require("sequelize").DataTypes;

const Candidate_Summary = sequelize.define("candidate_summary", {
  candidate_id: {
      type: DataTypes.BIGINT, 
      primaryKey: true,
      autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      isAlpha: true,
      notNull: true,
      notEmpty: true
    },
    unique: {
      args: true,
      msg: 'name already exists!'
    },
  },
  email_id: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      isEmail: true,
      notNull: true,
      notEmpty: true,
    },
    unique: {
      args: true,
      msg: 'Email address already exists!'
    },
  },
  phone_number: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notNull: true,
      notEmpty: true
    },
    unique: {
      args: true,
      msg: 'Phone no. already exists!'
    },
  },
  candidates_data: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  created_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  created_by: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notNull: true,
      notEmpty: true
    }
  },
  modified_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  modified_by: {
    type: DataTypes.STRING(100),
    allowNull: true,
  }
});
module.exports = Candidate_Summary;
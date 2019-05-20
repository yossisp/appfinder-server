const constants = require('../../config/constants.js');

module.exports = function errorsModel(sequelize, DataTypes) {
  return sequelize.define(constants.DB.MODELS.ERRORS, {
    appId: {
      type: DataTypes.STRING, // default length 255
      allowNull: true,
    },
    message: {
      type: DataTypes.STRING(2000),
      allowNull: true,
      validate: {
        len: [1, 2000]
      }
    },
    func: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 255]
      }
    },
    file: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 255]
      }
    }
  });
};

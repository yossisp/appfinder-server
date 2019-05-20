const constants = require('../../config/constants.js');

module.exports = function appModel(sequelize, DataTypes) {
  return sequelize.define(constants.DB.MODELS.APP, {
    appId: {
      type: DataTypes.STRING, // default length 255
      allowNull: false,
      primaryKey: true,
      validate: {
        len: [1, 255]
      }
    },
    appStore: {
      type: DataTypes.STRING,
      allowNull: false
    },
    found: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    appName: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    contentRating: {
      type: DataTypes.STRING,
      allowNull: true
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true
    },
    version: {
      type: DataTypes.STRING,
      allowNull: true
    },
    image: {
      type: DataTypes.STRING(1000),
      allowNull: true
    }
  });
};

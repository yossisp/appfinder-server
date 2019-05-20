'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('appModels');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.createTable('appModels', {
      appId: {
        type: DataTypes.STRING, // default length 255
        allowNull: false,
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
      }
    });
  }
};

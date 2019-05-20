'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('errorsModels');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.createTable('errorsModels', {
      appId: {
        type: DataTypes.STRING(1000), // default length 255
        allowNull: true,
        validate: {
          len: [1, 1000]
        }
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
  }
};

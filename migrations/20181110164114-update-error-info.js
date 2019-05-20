'use strict';

const DataTypes = require('sequelize/lib/data-types');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('errors', 'appId', {
      type: DataTypes.STRING,
      allowNull: true
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('errors', 'appId', {
      type: DataTypes.STRING(1000),
      allowNull: true,
      validate: {
        len: [1, 1000]
      }
    });
  }
};

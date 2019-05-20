'use strict';

const DataTypes = require('sequelize/lib/data-types');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('apps', 'newCol', {
      type: DataTypes.STRING, // default length 255
      allowNull: true
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('apps', 'newCol');
  }
};

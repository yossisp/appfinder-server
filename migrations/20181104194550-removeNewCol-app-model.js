'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('apps', 'newCol');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('apps', 'newCol', {
      type: DataTypes.STRING, // default length 255
      allowNull: true
    });
  }
};

const { getIdFieldDef } = require("../helpers");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("pools", {
      id: getIdFieldDef(),
      poolName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      creatorName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      creatorEmail: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable("pools");
  },
};

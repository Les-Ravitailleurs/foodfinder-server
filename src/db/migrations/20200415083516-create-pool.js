const { getIdFieldDef } = require("../helpers");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("pools", {
      id: getIdFieldDef(),
      creatorName: {
        type: Sequelize.STRING,
      },
      creatorEmail: {
        type: Sequelize.STRING,
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

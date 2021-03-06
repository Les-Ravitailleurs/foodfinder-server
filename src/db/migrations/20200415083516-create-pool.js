const { getIdFieldDef } = require("../helpers");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("pools", {
      id: getIdFieldDef(),
      poolName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      creatorName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      creatorEmail: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      startAt: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      adminId: {
        type: Sequelize.STRING(21),
        allowNull: false,
      },
      shareImage: {
        type: Sequelize.STRING,
        allowNull: true,
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

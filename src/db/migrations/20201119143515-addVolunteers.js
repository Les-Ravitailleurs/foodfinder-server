const { getIdFieldDef } = require("../helpers");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("volunteers", {
      id: getIdFieldDef(),
      username: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      emoji: {
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
    await queryInterface.addColumn("donations", "volunteerId", {
      type: Sequelize.STRING(21),
      allowNull: true,
      references: {
        model: "volunteers",
        key: "id",
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn("donations", "volunteerId");
    await queryInterface.dropTable("volunteers");
  },
};

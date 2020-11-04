"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("donations", "donatorAddress", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "",
    });
    await queryInterface.addColumn("donations", "hideDonatorName", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    await queryInterface.addColumn("donations", "taxReceiptId", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "",
    });
    await queryInterface.addColumn("donations", "taxReceiptNumber", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "",
    });
    await queryInterface.addColumn("donations", "taxReceiptURL", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn("donations", "taxReceiptURL");
    await queryInterface.removeColumn("donations", "taxReceiptNumber");
    await queryInterface.removeColumn("donations", "taxReceiptId");
    await queryInterface.removeColumn("donations", "hideDonatorName");
    await queryInterface.removeColumn("donations", "donatorAddress");
  },
};

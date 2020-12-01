module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("donations", "manual", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    await queryInterface.changeColumn("donations", "stripePaymentIntentId", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn("donations", "stripeName", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn("donations", "email", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn("donations", "donatorAddress", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn("donations", "taxReceiptId", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn("donations", "taxReceiptNumber", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn("donations", "manual");
  },
};

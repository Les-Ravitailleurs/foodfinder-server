module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("donations", "likeCount", {
      type: Sequelize.BIGINT,
      allowNull: false,
      defaultValue: 0,
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn("donations", "likeCount");
  },
};

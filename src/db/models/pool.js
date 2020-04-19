const { getIdFieldDef, addIdHooks } = require("../helpers");

module.exports = (sequelize, Sequelize) => {
  const Pool = sequelize.define(
    "Pool",
    {
      id: getIdFieldDef(),
      creatorName: { type: Sequelize.STRING, allowNull: false },
      poolName: { type: Sequelize.STRING, allowNull: true },
      startAt: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      adminId: {
        type: Sequelize.STRING(21),
        allowNull: false,
      },
      creatorEmail: Sequelize.STRING,
    },
    {
      tableName: "pools",
      paranoid: true,
    }
  );
  addIdHooks(Pool);
  return Pool;
};

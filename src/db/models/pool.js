const { getIdFieldDef, addIdHooks } = require("../helpers");
const { imgGen } = require("../../imgen");

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
      message: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      adminId: {
        type: Sequelize.STRING(21),
        allowNull: false,
      },
      shareImage: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      creatorEmail: Sequelize.STRING,
    },
    {
      tableName: "pools",
      paranoid: true,
    }
  );
  addIdHooks(Pool);
  Pool.addHook("afterCreate", (pool) => {
    imgGen(pool.id, pool.creatorName)
      .then((shareImage) => {
        Pool.update({ shareImage }, { where: { id: pool.id } });
      })
      .catch(console.log);
  });
  return Pool;
};

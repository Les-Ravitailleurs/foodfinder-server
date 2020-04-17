const { getIdFieldDef, addIdHooks } = require("../helpers");

module.exports = (sequelize, Sequelize) => {
  const Pool = sequelize.define(
    "Pool",
    {
      id: getIdFieldDef(),
      creatorName: Sequelize.STRING,
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

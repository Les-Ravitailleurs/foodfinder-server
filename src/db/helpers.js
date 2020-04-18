const { Sequelize } = require("sequelize");
const { nanoid } = require("nanoid");

module.exports = {
  getIdFieldDef: function () {
    return {
      type: Sequelize.STRING(21),
      primaryKey: true,
    };
  },
  addIdHooks: function (model) {
    var idFieldName = (model || {}).primaryKeyAttribute;

    if (!model || !model.addHook || !idFieldName)
      throw new Error("invalid addIdHooks input");

    function generateIdHook(record) {
      record[idFieldName] = nanoid();
    }
    function ensureNotUpdatingUnmodifiableFieldsHook(record) {
      if (record._changed[idFieldName])
        throw new Error("cannot update " + idFieldName + " field");
    }

    model.addHook("beforeCreate", generateIdHook);
    model.addHook("beforeUpdate", ensureNotUpdatingUnmodifiableFieldsHook);
  },
};
